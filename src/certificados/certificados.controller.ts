import type { RbacRequest } from '../rbac/authorization.guard.js';
import { RequirePermission, ScopedPermissions } from '../rbac/require-permission.decorator.js';
import { Body, Controller, Get, Param, ParseIntPipe, Patch, Res, Req } from '@nestjs/common';
import type { Response } from 'express';
import { Public } from '../auth/decorators/public.decorator.js';
import { CertificadosService } from './certificados.service.js';
import { PdfGeneratorService } from '../pdf/pdf-generator.service.js';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuditoriaService } from '../auditoria/auditoria.service.js';
import { AccionAuditoria } from '../auditoria/entities/auditoria.entity.js';
import { Throttle } from '@nestjs/throttler';
import * as XLSX from '@e965/xlsx';
import { AnularCertificadoDto } from './dto/anular-certificado.dto.js';

type AuthenticatedRequest = RbacRequest;

@Controller('certificados')
@ApiTags('Certificados')
@ScopedPermissions()
export class CertificadosController {
  constructor(
    private readonly certificadosService: CertificadosService,
    private readonly pdfGenerator: PdfGeneratorService,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar certificados' })
  @ApiResponse({ status: 200, description: 'Lista de certificados' })
  @RequirePermission('certificados.ver')
  findAll(@Req() request: RbacRequest) {
    return this.certificadosService.findAll(request.rbac);
  }

  @Get('validar/:token')
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({ summary: 'Validar certificado mediante token público' })
  @ApiResponse({ status: 200, description: 'Resultado de validación' })
  @ApiResponse({ status: 404, description: 'Certificado no encontrado o inválido' })
  validar(@Param('token') token: string) {
    return this.certificadosService.validarToken(token);
  }

  @Patch(':id/anular')
  @ApiOperation({ summary: 'Anular certificado aprobado con motivo y confirmación de contraseña' })
  @ApiResponse({ status: 200, description: 'Certificado anulado' })
  @RequirePermission('certificados.anular')
  anular(@Param('id', ParseIntPipe) id: number, @Body() dto: AnularCertificadoDto, @Req() request: AuthenticatedRequest) {
    return this.certificadosService.anular(id, dto, request.user.id, request.rbac);
  }

  @Get('exportar')
  @ApiOperation({ summary: 'Exportar certificados a Excel' })
  @ApiResponse({ status: 200, description: 'Archivo Excel con certificados' })
  @RequirePermission('certificados.exportar')
  async exportar(@Req() request: RbacRequest, @Res() response: Response) {
    const certificados = await this.certificadosService.findAll(request.rbac);
    const rows = certificados.map((certificate) => [
      certificate.id,
      certificate.consecutivo,
      certificate.estado,
      certificate.cicloEsterilizacion?.orden?.cotizacion?.cliente?.razon_social ?? '',
      certificate.fecha_esterilizacion ?? '',
      certificate.fecha_vencimiento ?? '',
    ]);
    const sheet = XLSX.utils.aoa_to_sheet([
      ['ID', 'Consecutivo', 'Estado', 'Cliente', 'Fecha de esterilización', 'Fecha de vencimiento'],
      ...rows,
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Certificados');
    const bytes = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader('Content-Disposition', 'attachment; filename="certificados.xlsx"');
    return response.send(bytes);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar certificado' })
  @ApiResponse({ status: 200, description: 'Certificado encontrado' })
  @RequirePermission('certificados.ver')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() request: RbacRequest) {
    return this.certificadosService.findOne(id, request.rbac);
  }

  @Get(':id/descargar')
  @ApiOperation({ summary: 'Descargar PDF de certificado' })
  @ApiResponse({ status: 200, description: 'Archivo PDF' })
  @RequirePermission('certificados.descargar')
  async descargar(@Param('id', ParseIntPipe) id: number, @Res() response: Response, @Req() request: AuthenticatedRequest) {
    const certificate = await this.certificadosService.ensurePdfCurrent(id, request.rbac);
    if (!certificate.pdf_url) return response.status(404).send({ message: 'El certificado aún no tiene PDF emitido' });
    const pdf = await this.pdfGenerator.getFile(certificate.pdf_url, certificate.hash_pdf ?? undefined);
    response.setHeader('Cache-Control', 'private, no-store, no-cache, must-revalidate');
    response.setHeader('Pragma', 'no-cache');
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', `attachment; filename="certificado-${certificate.consecutivo}.pdf"`);
    return response.end(pdf, () => {
      void this.auditoriaService.create({
        usuario_id: request.user.id,
        entidad: 'certificado',
        entidad_id: certificate.id,
        accion: AccionAuditoria.DESCARGAR,
        detalle: { consecutivo: certificate.consecutivo },
      }).catch(() => undefined);
    });
  }
}

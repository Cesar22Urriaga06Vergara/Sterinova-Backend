import { UpdateMaterialesOrdenDto } from './dto/update-materiales-orden.dto.js';
import {
  Body,
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Patch,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { createHash } from 'node:crypto';

type AuthenticatedRequest = RbacRequest;
import { LogisticaService } from './logistica.service.js';
import { CreateOrdenDto } from './dto/create-orden.dto.js';
import { ActaFase1Dto } from './dto/acta-fase1.dto.js';
import { ActaFase2Dto } from './dto/acta-fase2.dto.js';
import { CerrarActaDto } from './dto/cerrar-acta.dto.js';
import { UpdateEstadoOrdenDto } from './dto/update-estado-orden.dto.js';
import { PdfGeneratorService } from '../pdf/pdf-generator.service.js';
import { StorageService } from '../common/services/storage.service.js';
import {
  RequirePermission,
  ScopedPermissions,
} from '../rbac/require-permission.decorator.js';
import type { RbacRequest } from '../rbac/authorization.guard.js';

@Controller('logistica')
@ScopedPermissions()
export class LogisticaController {
  constructor(
    private readonly logisticaService: LogisticaService,
    private readonly pdfGenerator: PdfGeneratorService,
    private readonly storage: StorageService,
  ) {}

  @Post('ordenes')
  @RequirePermission('logistica.ordenes.crear')
  createOrden(
    @Body() createOrdenDto: CreateOrdenDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.logisticaService.createOrden(
      createOrdenDto,
      request.user.id, request.rbac);
  }

  @Patch('ordenes/:id/materiales')
  @RequirePermission('logistica.recepciones.registrar')
  updateMateriales(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMaterialesOrdenDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.logisticaService.updateMateriales(id, dto, request.user.id, request.rbac);
  }

  @Patch('ordenes/:id/acta/fase1')
  @RequirePermission('logistica.recepciones.registrar')
  guardarFase1Acta(@Param('id', ParseIntPipe) id: number, @Body() dto: ActaFase1Dto, @Req() request: RbacRequest) {
    return this.logisticaService.guardarFase1Acta(id, dto, request.user.id, request.rbac);
  }

  @Patch('ordenes/:id/acta/fase2')
  @RequirePermission('logistica.despacho.ejecutar')
  guardarFase2Acta(@Param('id', ParseIntPipe) id: number, @Body() dto: ActaFase2Dto, @Req() request: RbacRequest) {
    return this.logisticaService.guardarFase2Acta(id, dto, request.user.id, request.rbac);
  }

  @Patch('ordenes/:id/acta/cerrar')
  @RequirePermission('logistica.despacho.ejecutar')
  cerrarActa(@Param('id', ParseIntPipe) id: number, @Body() dto: CerrarActaDto, @Req() request: RbacRequest) {
    return this.logisticaService.cerrarActa(id, dto, request.user.id, request.rbac);
  }

  @Get('ordenes')
  @RequirePermission('logistica.ordenes.ver')
  findAllOrdenes(@Req() request: RbacRequest) {
    return this.logisticaService.findAll(request.rbac);
  }

  @Get('cotizaciones-aprobadas')
  @RequirePermission('logistica.cotizaciones_disponibles.ver')
  findCotizacionesAprobadas(@Req() request: RbacRequest) {
    return this.logisticaService.findCotizacionesAprobadasConSaldo(
      request.rbac,
    );
  }

  @Get('ordenes/:id')
  @RequirePermission('logistica.ordenes.ver')
  findOneOrden(@Param('id', ParseIntPipe) id: number, @Req() request: RbacRequest) {
    return this.logisticaService.findOne(id, request.rbac);
  }

  @Get('ordenes/:id/pdf')
  @ScopedPermissions()
  @RequirePermission('logistica.ordenes.ver')
  async descargarPdf(
    @Param('id', ParseIntPipe) id: number,
    @Query('tipo') tipo: string = 'orden',
    @Res() response: Response,
    @Req() request: RbacRequest,
  ) {
    if (tipo !== 'orden' && tipo !== 'acta') {
      throw new BadRequestException(
        'El tipo de documento debe ser "orden" o "acta"',
      );
    }

    const orden = await this.logisticaService.findOneForPdf(
      id,
      request.rbac,
    );
    const pdfType = tipo === 'acta' ? 'ACTA_SERVICIO' : 'ORDEN_SERVICIO';
    const tipoDoc = tipo === 'acta' ? 'ACTA' : 'ORDEN';
    const docConsecutivo =
      tipo === 'acta'
        ? orden.acta_consecutivo ?? orden.consecutivo
        : orden.consecutivo;
    const safeConsecutivo = docConsecutivo.replace(/[^A-Za-z0-9._-]/g, '_');
    const snapshot = await this.logisticaService.buildPdfSnapshot(
      orden,
      pdfType,
    );

    const existing =
      typeof this.logisticaService.findDocumentoEmitido === 'function'
        ? await this.logisticaService.findDocumentoEmitido(
            tipoDoc,
            docConsecutivo,
          )
        : null;
    if (
      existing?.pdf_storage_key &&
      JSON.stringify(existing.snapshot_json) === JSON.stringify(snapshot) &&
      typeof this.storage.getFile === 'function'
    ) {
      try {
        const cachedPdf = await this.storage.getFile(existing.pdf_storage_key);
        const cachedHash = createHash('sha256').update(cachedPdf).digest('hex');
        if (!existing.pdf_hash || existing.pdf_hash === cachedHash) {
          response.setHeader('Content-Type', 'application/pdf');
          response.setHeader('Cache-Control', 'private, no-store');
          response.setHeader(
            'Content-Disposition',
            `inline; filename="${safeConsecutivo}-${tipo}.pdf"`,
          );
          return response.send(cachedPdf);
        }
      } catch {
        // Missing or unreadable cached file will be regenerated below.
      }
    }

    const pdf = await this.pdfGenerator.render(snapshot);
    const pdfHash = createHash('sha256').update(pdf).digest('hex');
    const storageKey = `logistica/${safeConsecutivo}-${tipo}.pdf`;
    await this.storage.saveFile(pdf, storageKey);

    const docPayload = {
      tipo: tipoDoc as 'ORDEN' | 'ACTA',
      consecutivo: docConsecutivo,
      formato_version_id: snapshot.formato.id,
      snapshot_json: snapshot,
      pdf_storage_key: storageKey,
      pdf_hash: pdfHash,
      fecha_emision: new Date().toISOString(),
      usuario_id: request.user.id,
      orden_id: orden.id,
    };
    if (typeof this.logisticaService.upsertDocumentoEmitido === 'function') {
      await this.logisticaService.upsertDocumentoEmitido(
        docPayload,
        request.user.id,
        pdfHash,
      );
    } else {
      await this.logisticaService.crearDocumentoEmitido(
        docPayload,
        request.user.id,
        pdfHash,
      );
    }

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Cache-Control', 'private, no-store');
    response.setHeader(
      'Content-Disposition',
      `inline; filename="${safeConsecutivo}-${tipo}.pdf"`,
    );
    return response.send(pdf);
  }

  @Get('ordenes/:id/documentos-emitidos')
  @RequirePermission('logistica.ordenes.ver')
  async listarDocumentosEmitidos(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RbacRequest,
  ) {
    return this.logisticaService.findDocumentosEmitidosPorOrden(id, request.rbac);
  }

  @Put('ordenes/:id/estado')
  @RequirePermission('logistica.ordenes.cambiar_estado')
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEstadoOrdenDto: UpdateEstadoOrdenDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.logisticaService.updateEstado(
      id,
      updateEstadoOrdenDto,
      request.user.id, request.rbac);
  }
}

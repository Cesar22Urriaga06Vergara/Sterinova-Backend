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
import type { Request, Response } from 'express';

type AuthenticatedRequest = Request & { user: { id: number } };
import { LogisticaService } from './logistica.service.js';
import { CreateOrdenDto } from './dto/create-orden.dto.js';
import { UpdateEstadoOrdenDto } from './dto/update-estado-orden.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { UserRole } from '../users/entities/user-role.enum.js';
import { PdfGeneratorService } from '../pdf/pdf-generator.service.js';
import {
  RequirePermission,
  ScopedPermissions,
} from '../rbac/require-permission.decorator.js';
import type { RbacRequest } from '../rbac/authorization.guard.js';

@Controller('logistica')
@Roles(UserRole.ADMIN, UserRole.LOGISTICA)
export class LogisticaController {
  constructor(
    private readonly logisticaService: LogisticaService,
    private readonly pdfGenerator: PdfGeneratorService,
  ) {}

  @Post('ordenes')
  createOrden(@Body() createOrdenDto: CreateOrdenDto) {
    return this.logisticaService.createOrden(createOrdenDto);
  }

  @Patch('ordenes/:id/materiales')
  updateMateriales(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMaterialesOrdenDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.logisticaService.updateMateriales(id, dto, request.user.id);
  }

  @Get('ordenes')
  findAllOrdenes() {
    return this.logisticaService.findAll();
  }

  @Get('cotizaciones-aprobadas')
  findCotizacionesAprobadas() {
    return this.logisticaService.findCotizacionesAprobadasSinOrden();
  }

  @Get('ordenes/:id')
  findOneOrden(@Param('id', ParseIntPipe) id: number) {
    return this.logisticaService.findOne(id);
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
    const snapshot = this.logisticaService.buildPdfSnapshot(orden, pdfType);
    const safeConsecutivo = orden.consecutivo.replace(/[^A-Za-z0-9._-]/g, '_');
    const pdf = await this.pdfGenerator.render(snapshot);
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Cache-Control', 'private, no-store');
    response.setHeader(
      'Content-Disposition',
      `inline; filename="${safeConsecutivo}-${tipo}.pdf"`,
    );
    return response.send(pdf);
  }

  @Put('ordenes/:id/estado')
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEstadoOrdenDto: UpdateEstadoOrdenDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.logisticaService.updateEstado(
      id,
      updateEstadoOrdenDto,
      request.user.id,
    );
  }
}

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

type AuthenticatedRequest = RbacRequest;
import { LogisticaService } from './logistica.service.js';
import { CreateOrdenDto } from './dto/create-orden.dto.js';
import { UpdateEstadoOrdenDto } from './dto/update-estado-orden.dto.js';
import { PdfGeneratorService } from '../pdf/pdf-generator.service.js';
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

  @Get('ordenes')
  @RequirePermission('logistica.ordenes.ver')
  findAllOrdenes(@Req() request: RbacRequest) {
    return this.logisticaService.findAll(request.rbac);
  }

  @Get('cotizaciones-aprobadas')
  @RequirePermission('logistica.cotizaciones_disponibles.ver')
  findCotizacionesAprobadas(@Req() request: RbacRequest) {
    return this.logisticaService.findCotizacionesAprobadasSinOrden(request.rbac);
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

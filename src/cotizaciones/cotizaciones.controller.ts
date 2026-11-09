import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { PdfGeneratorService } from '../pdf/pdf-generator.service.js';
import { CotizacionesService } from './cotizaciones.service.js';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto.js';
import { UpdateCotizacionDto } from './dto/update-cotizacion.dto.js';
import {
  ScopedPermissions,
  RequirePermission,
} from '../rbac/require-permission.decorator.js';
import type { RbacRequest } from '../rbac/authorization.guard.js';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('cotizaciones')
@ApiTags('Cotizaciones')
@ScopedPermissions()
export class CotizacionesController {
  constructor(
    private readonly cotizacionesService: CotizacionesService,
    private readonly pdfGenerator: PdfGeneratorService,
  ) {}

  @Post()
  @RequirePermission('cotizaciones.crear')
  @ApiHeader({
    name: 'x-scope-id',
    required: false,
    description:
      'Ámbito autorizado. Obligatorio al crear si la cuenta tiene varios ámbitos posibles.',
    schema: { type: 'integer', minimum: 1 },
  })
  @ApiOperation({ summary: 'Crear cotización' })
  @ApiResponse({ status: 201, description: 'Cotización creada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(
    @Body() createCotizacionDto: CreateCotizacionDto,
    @Req() request: RbacRequest,
  ) {
    return this.cotizacionesService.create(createCotizacionDto, request.rbac);
  }

  @Get()
  @RequirePermission('cotizaciones.ver')
  @ApiOperation({ summary: 'Listar cotizaciones' })
  @ApiResponse({ status: 200, description: 'Lista de cotizaciones' })
  findAll(@Req() request: RbacRequest) {
    return this.cotizacionesService.findAll(request.rbac);
  }

  @Get(':id')
  @RequirePermission('cotizaciones.ver')
  @ApiOperation({ summary: 'Consultar cotización' })
  @ApiResponse({ status: 200, description: 'Cotización encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() request: RbacRequest) {
    return this.cotizacionesService.findOne(id, request.rbac);
  }

  @Get(':id/previsualizar')
  @RequirePermission('cotizaciones.previsualizar')
  @ApiOperation({ summary: 'Previsualizar cotización' })
  @ApiResponse({ status: 200, description: 'Contenido de la cotización' })
  previsualizar(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RbacRequest,
  ) {
    return this.cotizacionesService.previsualizar(id, request.rbac);
  }

  @Post(':id/emitir')
  @RequirePermission('cotizaciones.emitir')
  @ApiOperation({ summary: 'Emitir cotización' })
  @ApiResponse({ status: 201, description: 'Cotización emitida' })
  emitir(@Param('id', ParseIntPipe) id: number, @Req() request: RbacRequest) {
    return this.cotizacionesService.emitir(id, request.rbac);
  }

  @Get(':id/descargar')
  @RequirePermission('cotizaciones.descargar')
  @ApiOperation({ summary: 'Descargar PDF de cotización' })
  @ApiResponse({ status: 200, description: 'Archivo PDF' })
  async descargar(
    @Param('id', ParseIntPipe) id: number,
    @Res() response: Response,
    @Req() request: RbacRequest,
  ) {
    const quote = await this.cotizacionesService.ensurePdfCurrent(
      id,
      request.rbac,
    );
    if (!quote.pdf_url)
      return response
        .status(404)
        .send({ message: 'La cotización aún no tiene PDF emitido' });
    const pdf = await this.pdfGenerator.getFile(
      quote.pdf_url,
      quote.hash_pdf ?? undefined,
    );
    response.setHeader(
      'Cache-Control',
      'private, no-store, no-cache, must-revalidate',
    );
    response.setHeader('Pragma', 'no-cache');
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="${quote.consecutivo}.pdf"`,
    );
    return response.send(pdf);
  }

  @Put(':id')
  @RequirePermission('cotizaciones.editar')
  @ApiOperation({ summary: 'Actualizar cotización' })
  @ApiResponse({ status: 200, description: 'Cotización actualizada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCotizacionDto: UpdateCotizacionDto,
    @Req() request: RbacRequest,
  ) {
    return this.cotizacionesService.update(
      id,
      updateCotizacionDto,
      request.rbac,
    );
  }

  @Delete(':id')
  @RequirePermission('cotizaciones.eliminar')
  @ApiOperation({ summary: 'Eliminar cotización' })
  @ApiResponse({ status: 200, description: 'Cotización eliminada' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() request: RbacRequest) {
    return this.cotizacionesService.remove(id, request.rbac);
  }
}

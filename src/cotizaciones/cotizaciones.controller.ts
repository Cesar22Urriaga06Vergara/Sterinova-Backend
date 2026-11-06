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
import { Roles } from '../common/decorators/roles.decorator.js';
import { UserRole } from '../users/entities/user-role.enum.js';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

type AuthenticatedRequest = { user: { id: number } };

@Controller('cotizaciones')
@ApiTags('Cotizaciones')
@Roles(UserRole.ADMIN, UserRole.COMERCIAL)
export class CotizacionesController {
  constructor(
    private readonly cotizacionesService: CotizacionesService,
    private readonly pdfGenerator: PdfGeneratorService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear cotización' })
  @ApiResponse({ status: 201, description: 'Cotización creada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(
    @Body() createCotizacionDto: CreateCotizacionDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.cotizacionesService.create(createCotizacionDto, request.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar cotizaciones' })
  @ApiResponse({ status: 200, description: 'Lista de cotizaciones' })
  findAll() {
    return this.cotizacionesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar cotización' })
  @ApiResponse({ status: 200, description: 'Cotización encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cotizacionesService.findOne(id);
  }

  @Get(':id/previsualizar')
  @ApiOperation({ summary: 'Previsualizar cotización' })
  @ApiResponse({ status: 200, description: 'Contenido de la cotización' })
  previsualizar(@Param('id', ParseIntPipe) id: number) {
    return this.cotizacionesService.previsualizar(id);
  }

  @Post(':id/emitir')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Emitir cotización' })
  @ApiResponse({ status: 201, description: 'Cotización emitida' })
  emitir(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.cotizacionesService.emitir(id, request.user.id);
  }

  @Get(':id/descargar')
  @ApiOperation({ summary: 'Descargar PDF de cotización' })
  @ApiResponse({ status: 200, description: 'Archivo PDF' })
  async descargar(@Param('id', ParseIntPipe) id: number, @Res() response: Response) {
    const quote = await this.cotizacionesService.ensurePdfCurrent(id);
    if (!quote.pdf_url) return response.status(404).send({ message: 'La cotización aún no tiene PDF emitido' });
    const pdf = await this.pdfGenerator.getFile(quote.pdf_url, quote.hash_pdf ?? undefined);
    response.setHeader('Cache-Control', 'private, no-store, no-cache, must-revalidate');
    response.setHeader('Pragma', 'no-cache');
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', `attachment; filename="${quote.consecutivo}.pdf"`);
    return response.send(pdf);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar cotización' })
  @ApiResponse({ status: 200, description: 'Cotización actualizada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCotizacionDto: UpdateCotizacionDto,
  ) {
    return this.cotizacionesService.update(id, updateCotizacionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar cotización' })
  @ApiResponse({ status: 200, description: 'Cotización eliminada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cotizacionesService.remove(id);
  }
}

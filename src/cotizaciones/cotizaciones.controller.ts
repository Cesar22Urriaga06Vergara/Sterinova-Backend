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

type AuthenticatedRequest = { user: { id: number } };

@Controller('cotizaciones')
@Roles(UserRole.ADMIN, UserRole.COMERCIAL)
export class CotizacionesController {
  constructor(
    private readonly cotizacionesService: CotizacionesService,
    private readonly pdfGenerator: PdfGeneratorService,
  ) {}

  @Post()
  create(
    @Body() createCotizacionDto: CreateCotizacionDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.cotizacionesService.create(createCotizacionDto, request.user.id);
  }

  @Get()
  findAll() {
    return this.cotizacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cotizacionesService.findOne(id);
  }

  @Get(':id/previsualizar')
  previsualizar(@Param('id', ParseIntPipe) id: number) {
    return this.cotizacionesService.previsualizar(id);
  }

  @Post(':id/emitir')
  @Roles(UserRole.ADMIN)
  emitir(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.cotizacionesService.emitir(id, request.user.id);
  }

  @Get(':id/descargar')
  async descargar(@Param('id', ParseIntPipe) id: number, @Res() response: Response) {
    const quote = await this.cotizacionesService.ensurePdfCurrent(id);
    if (!quote.pdf_url) return response.status(404).send({ message: 'La cotización aún no tiene PDF emitido' });
    const path = await this.pdfGenerator.getAbsolutePath(quote.pdf_url);
    response.setHeader('Cache-Control', 'private, no-store, no-cache, must-revalidate');
    response.setHeader('Pragma', 'no-cache');
    return response.download(path, `${quote.consecutivo}.pdf`);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCotizacionDto: UpdateCotizacionDto,
  ) {
    return this.cotizacionesService.update(id, updateCotizacionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cotizacionesService.remove(id);
  }
}

import { RequirePermission, ScopedPermissions } from '../rbac/require-permission.decorator.js';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateSelloCertificacionDto } from './dto/create-sello-certificacion.dto.js';
import { UpdateSelloCertificacionDto } from './dto/update-sello-certificacion.dto.js';
import { SellosService, type UploadedImage } from './sellos.service.js';

@Controller('sellos')
@ScopedPermissions()
export class SellosController {
  constructor(private readonly sellosService: SellosService) {}

  @Get()
  @RequirePermission('sellos.ver')
  findAll() {
    return this.sellosService.findAll();
  }

  @Get(':id/imagen')
  @RequirePermission('sellos.ver')
  async getImage(@Param('id', ParseIntPipe) id: number) {
    const image = await this.sellosService.getImage(id);
    return new StreamableFile(image.buffer, { type: image.mimeType });
  }

  @Post()
  @UseInterceptors(FileInterceptor('imagen', { limits: { fileSize: 5 * 1024 * 1024 } }))
  @RequirePermission('sellos.crear')
  create(
    @Body() dto: CreateSelloCertificacionDto,
    @UploadedFile() file?: UploadedImage,
  ) {
    return this.sellosService.create(dto, file);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('imagen', { limits: { fileSize: 5 * 1024 * 1024 } }))
  @RequirePermission('sellos.editar')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSelloCertificacionDto,
    @UploadedFile() file?: UploadedImage,
  ) {
    return this.sellosService.update(id, dto, file);
  }

  @Delete(':id')
  @RequirePermission('sellos.desactivar')
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.sellosService.deactivate(id);
  }
}

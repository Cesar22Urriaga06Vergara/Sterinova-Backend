import type { RbacRequest } from '../rbac/authorization.guard.js';
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
  Req,
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
  findAll(@Req() request: RbacRequest) {
    return this.sellosService.findAll(request.rbac);
  }

  @Get(':id/imagen')
  @RequirePermission('sellos.ver')
  async getImage(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RbacRequest,
  ) {
    const image = await this.sellosService.getImage(id, request.rbac);
    return new StreamableFile(image.buffer, { type: image.mimeType });
  }

  @Post()
  @UseInterceptors(FileInterceptor('imagen', { limits: { fileSize: 5 * 1024 * 1024 } }))
  @RequirePermission('sellos.crear')
  create(
    @Body() dto: CreateSelloCertificacionDto,
    @UploadedFile() file?: UploadedImage,
    @Req() request?: RbacRequest,
  ) {
    return this.sellosService.create(
      dto,
      file,
      request?.rbac,
    );
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('imagen', { limits: { fileSize: 5 * 1024 * 1024 } }))
  @RequirePermission('sellos.editar')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSelloCertificacionDto,
    @UploadedFile() file?: UploadedImage,
    @Req() request?: RbacRequest,
  ) {
    return this.sellosService.update(
      id,
      dto,
      file,
      request?.rbac,
    );
  }

  @Delete(':id')
  @RequirePermission('sellos.desactivar')
  deactivate(
    @Param('id', ParseIntPipe) id: number,
    @Req() request?: RbacRequest,
  ) {
    return this.sellosService.deactivate(id, request?.rbac);
  }

}

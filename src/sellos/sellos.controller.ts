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
import { Roles } from '../common/decorators/roles.decorator.js';
import { UserRole } from '../users/entities/user-role.enum.js';
import { CreateSelloCertificacionDto } from './dto/create-sello-certificacion.dto.js';
import { UpdateSelloCertificacionDto } from './dto/update-sello-certificacion.dto.js';
import { SellosService, type UploadedImage } from './sellos.service.js';

@Controller('sellos')
@Roles(UserRole.ADMIN)
export class SellosController {
  constructor(private readonly sellosService: SellosService) {}

  @Get()
  findAll() {
    return this.sellosService.findAll();
  }

  @Get(':id/imagen')
  async getImage(@Param('id', ParseIntPipe) id: number) {
    const image = await this.sellosService.getImage(id);
    return new StreamableFile(image.buffer, { type: image.mimeType });
  }

  @Post()
  @UseInterceptors(FileInterceptor('imagen', { limits: { fileSize: 5 * 1024 * 1024 } }))
  create(
    @Body() dto: CreateSelloCertificacionDto,
    @UploadedFile() file?: UploadedImage,
  ) {
    return this.sellosService.create(dto, file);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('imagen', { limits: { fileSize: 5 * 1024 * 1024 } }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSelloCertificacionDto,
    @UploadedFile() file?: UploadedImage,
  ) {
    return this.sellosService.update(id, dto, file);
  }

  @Delete(':id')
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.sellosService.deactivate(id);
  }
}

import type { RbacRequest } from '../rbac/authorization.guard.js';
import { RequirePermission, ScopedPermissions } from '../rbac/require-permission.decorator.js';
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
} from '@nestjs/common';
import { CreateFormatoDocumentalDto } from './dto/create-formato-documental.dto.js';
import { CreateFormatoVersionDto } from './dto/create-formato-version.dto.js';
import { UpdateFormatoDocumentalDto } from './dto/update-formato-documental.dto.js';
import { UpdateFormatoVersionDto } from './dto/update-formato-version.dto.js';
import { UpdateFormatoVersionStateDto } from './dto/update-formato-version-state.dto.js';
import { FormatosDocumentalesService } from './formatos-documentales.service.js';

@Controller('formatos-documentales')
@ScopedPermissions()
export class FormatosDocumentalesController {
  constructor(
    private readonly formatosDocumentalesService: FormatosDocumentalesService,
  ) {}

  @Get()
  @RequirePermission('formatos.ver')
  findAll(@Req() request: RbacRequest) {
    return this.formatosDocumentalesService.findAll(request.rbac);
  }

  @Get(':id')
  @RequirePermission('formatos.ver')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() request: RbacRequest) {
    return this.formatosDocumentalesService.findOne(id, request.rbac);
  }

  @Get(':id/versiones')
  @RequirePermission('formatos.ver')
  findVersions(@Param('id', ParseIntPipe) id: number, @Req() request: RbacRequest) {
    return this.formatosDocumentalesService.findVersions(id, request.rbac);
  }

  @Post()
  @RequirePermission('formatos.crear')
  create(
    @Body() dto: CreateFormatoDocumentalDto,
    @Req() request: RbacRequest,
  ) {
    return this.formatosDocumentalesService.create(
      dto,
      request.user.id,
      request.rbac,
    );
  }

  @Put(':id')
  @RequirePermission('formatos.editar')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFormatoDocumentalDto,
    @Req() request: RbacRequest,
  ) {
    return this.formatosDocumentalesService.update(
      id,
      dto,
      request.user.id,
      request.rbac,
    );
  }

  @Delete(':id')
  @RequirePermission('formatos.eliminar')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: RbacRequest,
  ) {
    return this.formatosDocumentalesService.remove(id, request.user.id, request.rbac);
  }

  @Post(':id/versiones')
  @RequirePermission('formatos.versiones.crear')
  createVersion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateFormatoVersionDto,
    @Req() request: RbacRequest,
  ) {
    return this.formatosDocumentalesService.createVersion(
      id,
      dto,
      request.user.id,
      request.rbac,
    );
  }

  @Put(':id/versiones/:versionId')
  @RequirePermission('formatos.versiones.editar')
  updateVersion(
    @Param('id', ParseIntPipe) id: number,
    @Param('versionId', ParseIntPipe) versionId: number,
    @Body() dto: UpdateFormatoVersionDto,
    @Req() request: RbacRequest,
  ) {
    return this.formatosDocumentalesService.updateVersion(
      id,
      versionId,
      dto,
      request.user.id,
      request.rbac,
    );
  }

  @Post(':id/versiones/:versionId/estado')
  @RequirePermission('formatos.versiones.publicar')
  updateVersionState(
    @Param('id', ParseIntPipe) id: number,
    @Param('versionId', ParseIntPipe) versionId: number,
    @Body() dto: UpdateFormatoVersionStateDto,
    @Req() request: RbacRequest,
  ) {
    return this.formatosDocumentalesService.updateVersionState(
      id,
      versionId,
      dto,
      request.user.id,
      request.rbac,
    );
  }

}

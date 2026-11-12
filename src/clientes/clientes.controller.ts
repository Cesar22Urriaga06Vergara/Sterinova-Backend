import type { RbacRequest } from '../rbac/authorization.guard.js';
import { RequirePermission, ScopedPermissions } from '../rbac/require-permission.decorator.js';
import {
  Req,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ClientesService } from './clientes.service.js';
import { CreateClienteDto } from './dto/create-cliente.dto.js';
import { UpdateClienteDto } from './dto/update-cliente.dto.js';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('clientes')
@ApiTags('Clientes')
@ScopedPermissions()
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @RequirePermission('clientes.crear')
  create(@Body() createClienteDto: CreateClienteDto, @Req() request: RbacRequest) {
    return this.clientesService.create(createClienteDto, request.rbac);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Crear clientes en lote' })
  @ApiResponse({ status: 201, description: 'Clientes procesados' })
  @RequirePermission('clientes.importar')
  bulk(
    @Body(
      new ParseArrayPipe({
        items: CreateClienteDto,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    createClienteDtos: CreateClienteDto[], @Req() request: RbacRequest) {
    return this.clientesService.bulk(createClienteDtos, request.rbac);
  }

  @Get()
  @ApiOperation({ summary: 'Listar clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes' })
  @RequirePermission('clientes.ver')
  findAll(@Req() request: RbacRequest) {
    return this.clientesService.findAll(request.rbac);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar cliente' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @RequirePermission('clientes.ver')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() request: RbacRequest) {
    return this.clientesService.findOne(id, request.rbac);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar cliente' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado' })
  @RequirePermission('clientes.editar')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClienteDto: UpdateClienteDto, @Req() request: RbacRequest) {
    return this.clientesService.update(id, updateClienteDto, request.rbac);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar cliente' })
  @ApiResponse({ status: 200, description: 'Cliente eliminado' })
  @RequirePermission('clientes.eliminar')
  remove(@Param('id', ParseIntPipe) id: number, @Req() request: RbacRequest) {
    return this.clientesService.remove(id, request.rbac);
  }
}

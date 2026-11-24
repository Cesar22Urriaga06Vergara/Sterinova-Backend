import {
  Body,
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { RbacRequest } from '../rbac/authorization.guard.js';
import {
  RequirePermission,
  ScopedPermissions,
} from '../rbac/require-permission.decorator.js';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { SearchProductosDto } from './dto/search-productos.dto.js';
import { UpdateProductoStatusDto } from './dto/update-producto-status.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';
import { QueryProductosDto } from './dto/query-productos.dto.js';
import { ProductosService } from './productos.service.js';
import { TipoItemCatalogo } from './entities/producto.entity.js';

@Controller('productos')
@ApiTags('Productos')
@ScopedPermissions()
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  @RequirePermission('productos.gestionar')
  @ApiOperation({ summary: 'Listar catálogo de productos y servicios' })
  findAll(@Query() query: QueryProductosDto, @Req() request: RbacRequest) {
    return this.productosService.findAll(request.rbac, query.tipo_item);
  }

  @Post('importar-excel')
  @UseInterceptors(FileInterceptor('archivo', { limits: { fileSize: 10 * 1024 * 1024 } }))
  @RequirePermission('productos.gestionar')
  @ApiOperation({ summary: 'Importar insumos desde un archivo Excel .xlsx' })
  importExcel(@UploadedFile() file: { buffer: Buffer; originalname: string } | undefined, @Query('tipo_item') tipoItem: string | undefined, @Req() request: RbacRequest) {
    if (!file || !file.originalname.toLocaleLowerCase().endsWith('.xlsx')) {
      throw new BadRequestException('Adjunte un archivo .xlsx en el campo archivo');
    }
    if (tipoItem && tipoItem !== TipoItemCatalogo.PRODUCTO) {
      throw new BadRequestException('La importación Excel solo admite el segmento de productos e insumos');
    }
    return this.productosService.importExcel(file.buffer, request.rbac);
  }

  @Get('buscar/crear')
  @RequirePermission('cotizaciones.crear')
  @ApiOperation({ summary: 'Buscar productos activos para una cotización nueva' })
  searchForCreation(
    @Query() query: SearchProductosDto,
    @Req() request: RbacRequest,
  ) {
    return this.productosService.searchForQuote(
      query.tipo_servicio,
      query.q,
      request.rbac,
      query.tipo_item,
    );
  }

  @Get('buscar/editar')
  @RequirePermission('cotizaciones.editar')
  @ApiOperation({ summary: 'Buscar productos activos para editar una cotización' })
  searchForEditing(
    @Query() query: SearchProductosDto,
    @Req() request: RbacRequest,
  ) {
    return this.productosService.searchForQuote(
      query.tipo_servicio,
      query.q,
      request.rbac,
      query.tipo_item,
    );
  }

  @Post()
  @RequirePermission('productos.gestionar')
  @ApiOperation({ summary: 'Crear producto o servicio del catálogo' })
  create(
    @Body() dto: CreateProductoDto,
    @Req() request: RbacRequest,
  ) {
    return this.productosService.create(dto, request.rbac);
  }

  @Put(':id')
  @RequirePermission('productos.gestionar')
  @ApiOperation({ summary: 'Actualizar producto o servicio del catálogo' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductoDto,
    @Req() request: RbacRequest,
  ) {
    return this.productosService.update(id, dto, request.rbac);
  }

  @Patch(':id/estado')
  @RequirePermission('productos.gestionar')
  @ApiOperation({ summary: 'Activar o desactivar una referencia del catálogo' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductoStatusDto,
    @Req() request: RbacRequest,
  ) {
    return this.productosService.updateStatus(id, dto.activo, request.rbac);
  }
}

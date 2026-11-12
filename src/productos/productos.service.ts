import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import type { PermissionContext } from '../rbac/rbac-authorization.service.js';
import { creationScope } from '../rbac/resource-access.js';
import { TipoServicioCotizacion } from '../cotizaciones/entities/tipo-servicio.enum.js';
import {
  CategoriaProducto,
  Producto,
} from './entities/producto.entity.js';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';

const SEARCH_FIELDS = [
  'descripcion',
  'codigo',
  'referencia',
  'metodo',
  'presentacion',
  'marca',
] as const;

function trimmedOrNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function requiredTrimmed(value: string, field: string): string {
  const trimmed = value.trim();
  if (!trimmed) throw new BadRequestException(`${field} es obligatorio`);
  return trimmed;
}

function validateCategory(
  tipoServicio: TipoServicioCotizacion,
  category: CategoriaProducto | null | undefined,
): CategoriaProducto | null {
  if (tipoServicio === TipoServicioCotizacion.INSUMOS) {
    if (
      category !== CategoriaProducto.EMPAQUES &&
      category !== CategoriaProducto.MONITOREO &&
      category !== CategoriaProducto.EQUIPOS
    ) {
      throw new BadRequestException(
        'Seleccione una categoría válida para los insumos',
      );
    }
    return category;
  }
  if (category !== undefined && category !== null) {
    throw new BadRequestException(
      'La categoría solo aplica a cotizaciones de Insumos',
    );
  }
  return null;
}

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productosRepository: Repository<Producto>,
  ) {}

  async create(
    dto: CreateProductoDto,
    access: PermissionContext,
  ): Promise<Producto> {
    const producto = this.productosRepository.create({
      scope_id: creationScope(access),
      tipo_servicio: dto.tipo_servicio,
      tipo_item: dto.tipo_item,
      categoria: validateCategory(dto.tipo_servicio, dto.categoria),
      codigo: trimmedOrNull(dto.codigo),
      referencia: trimmedOrNull(dto.referencia),
      metodo: trimmedOrNull(dto.metodo),
      presentacion: trimmedOrNull(dto.presentacion),
      marca: trimmedOrNull(dto.marca),
      descripcion: requiredTrimmed(dto.descripcion, 'La descripción'),
      unidad: requiredTrimmed(dto.unidad, 'La unidad'),
      precision_cantidad: dto.precision_cantidad,
      activo: true,
    });
    return this.productosRepository.save(producto);
  }

  findAll(access: PermissionContext): Promise<Producto[]> {
    const scopeIds = this.scopeIds(access);
    return this.productosRepository.find({
      where: { scope_id: In(scopeIds) },
      order: { tipo_servicio: 'ASC', categoria: 'ASC', descripcion: 'ASC' },
    });
  }

  searchForQuote(
    tipoServicio: TipoServicioCotizacion,
    query: string | undefined,
    access: PermissionContext,
  ): Promise<Producto[]> {
    const scopeIds = this.scopeIds(access);
    const term = query?.trim();
    const base = {
      scope_id: In(scopeIds),
      tipo_servicio: tipoServicio,
      activo: true,
    };
    const where = term
      ? SEARCH_FIELDS.map((field) => ({
          ...base,
          [field]: Like(`%${term}%`),
        }))
      : base;
    return this.productosRepository.find({
      where,
      order: { categoria: 'ASC', descripcion: 'ASC' },
      take: 50,
    });
  }

  async update(
    id: number,
    dto: UpdateProductoDto,
    access: PermissionContext,
  ): Promise<Producto> {
    const producto = await this.findOne(id, access);
    const tipoServicio = dto.tipo_servicio ?? producto.tipo_servicio;
    const category =
      dto.categoria === undefined ? producto.categoria : dto.categoria;
    producto.tipo_servicio = tipoServicio;
    producto.categoria = validateCategory(tipoServicio, category);
    if (dto.tipo_item !== undefined) producto.tipo_item = dto.tipo_item;
    if (dto.codigo !== undefined) producto.codigo = trimmedOrNull(dto.codigo);
    if (dto.referencia !== undefined)
      producto.referencia = trimmedOrNull(dto.referencia);
    if (dto.metodo !== undefined) producto.metodo = trimmedOrNull(dto.metodo);
    if (dto.presentacion !== undefined)
      producto.presentacion = trimmedOrNull(dto.presentacion);
    if (dto.marca !== undefined) producto.marca = trimmedOrNull(dto.marca);
    if (dto.descripcion !== undefined)
      producto.descripcion = requiredTrimmed(dto.descripcion, 'La descripción');
    if (dto.unidad !== undefined)
      producto.unidad = requiredTrimmed(dto.unidad, 'La unidad');
    if (dto.precision_cantidad !== undefined)
      producto.precision_cantidad = dto.precision_cantidad;
    return this.productosRepository.save(producto);
  }

  async updateStatus(
    id: number,
    active: boolean,
    access: PermissionContext,
  ): Promise<Producto> {
    const producto = await this.findOne(id, access);
    producto.activo = active;
    return this.productosRepository.save(producto);
  }

  private async findOne(
    id: number,
    access: PermissionContext,
  ): Promise<Producto> {
    const producto = await this.productosRepository.findOne({
      where: { id, scope_id: In(this.scopeIds(access)) },
    });
    if (!producto)
      throw new NotFoundException(`Producto #${id} no encontrado`);
    return producto;
  }

  private scopeIds(access: PermissionContext): readonly number[] {
    const scopeIds = access.resourceScopeIds;
    if (!scopeIds.length)
      throw new ForbiddenException('Sin ámbito autorizado para el catálogo');
    return scopeIds;
  }
}

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Like, Repository } from 'typeorm';
import type { PermissionContext } from '../rbac/rbac-authorization.service.js';
import { creationScope } from '../rbac/resource-access.js';
import { TipoServicioCotizacion } from '../common/tipo-servicio-cotizacion.js';
import {
  CategoriaProducto,
  Producto,
} from './entities/producto.entity.js';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';
import * as XLSX from '@e965/xlsx';
import { TipoItemCatalogo } from './entities/producto.entity.js';

const SEARCH_FIELDS = [
  'descripcion',
  'categoria',
  'codigo',
  'referencia',
  'metodo',
  'presentacion',
  'marca',
] as const;

export type ImportExcelSummary = {
  created: number;
  updated: number;
  errors: Array<{ row: number; message: string }>;
};

const IMPORT_HEADERS: Record<string, string> = {
  categoria: 'categoria', referencia: 'referencia', metodo: 'metodo',
  'metodo de esterilizacion': 'metodo', presentacion: 'presentacion',
  marca: 'marca', codigo: 'codigo',
};

function normalizeHeader(value: unknown): string {
  return String(value ?? '').trim().toLocaleLowerCase('es-CO')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ');
}

function normalizeCategory(value: unknown): CategoriaProducto {
  const raw = normalizeHeader(value);
  if (raw.includes('empaque')) return CategoriaProducto.EMPAQUES;
  if (raw.includes('monitoreo')) return CategoriaProducto.MONITOREO;
  if (raw.includes('equipo')) return CategoriaProducto.EQUIPOS;
  const normalized = raw.toUpperCase().replace(/\s+/g, '_');
  if (Object.values(CategoriaProducto).includes(normalized as CategoriaProducto))
    return normalized as CategoriaProducto;
  throw new Error('Categoría inválida; use EMPAQUES, MONITOREO, EQUIPOS o GENERAL');
}

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
  tipoItem: TipoItemCatalogo,
  category: CategoriaProducto | null | undefined,
): CategoriaProducto | null {
  if (tipoServicio === TipoServicioCotizacion.INSUMOS && tipoItem === TipoItemCatalogo.PRODUCTO) {
    if (
      category !== CategoriaProducto.EMPAQUES &&
      category !== CategoriaProducto.MONITOREO &&
      category !== CategoriaProducto.EQUIPOS &&
      category !== CategoriaProducto.GENERAL
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
    this.validateSegmentFields(dto.tipo_item, dto);
    const categoria = dto.tipo_servicio === TipoServicioCotizacion.INSUMOS && dto.tipo_item === TipoItemCatalogo.PRODUCTO
      ? dto.categoria ?? CategoriaProducto.GENERAL
      : dto.categoria;
    const producto = this.productosRepository.create({
      scope_id: creationScope(access),
      tipo_servicio: dto.tipo_servicio,
      tipo_item: dto.tipo_item,
      categoria: validateCategory(dto.tipo_servicio, dto.tipo_item, categoria),
      codigo: trimmedOrNull(dto.codigo),
      referencia: trimmedOrNull(dto.referencia),
      metodo: trimmedOrNull(dto.metodo),
      presentacion: trimmedOrNull(dto.presentacion),
      marca: trimmedOrNull(dto.marca),
      descripcion: requiredTrimmed(dto.descripcion, 'La descripción'),
      unidad: dto.unidad === undefined ? 'unidad' : requiredTrimmed(dto.unidad, 'La unidad'),
      precision_cantidad: dto.precision_cantidad ?? 2,
      activo: true,
    });
    return this.productosRepository.save(producto);
  }

  async importExcel(buffer: Buffer, access: PermissionContext): Promise<ImportExcelSummary> {
    const scopeId = creationScope(access);
    const summary: ImportExcelSummary = { created: 0, updated: 0, errors: [] };
    let rows: unknown[][];
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const firstSheet = workbook.SheetNames[0];
      if (!firstSheet) throw new Error('El archivo no contiene hojas');
      rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], { header: 1, defval: '' }) as unknown[][];
    } catch {
      throw new BadRequestException('No se pudo leer el archivo .xlsx');
    }
    if (rows.length < 2) throw new BadRequestException('El Excel debe incluir encabezados y al menos una fila');
    const headerRowIndex = rows.findIndex((row) => {
      const normalized = row.map((value) => IMPORT_HEADERS[normalizeHeader(value)] ?? '');
      return normalized.includes('categoria') && normalized.includes('referencia') &&
        normalized.includes('metodo') && normalized.includes('presentacion') && normalized.includes('marca');
    });
    if (headerRowIndex < 0) throw new BadRequestException('No se encontraron las columnas de catálogo requeridas en la hoja inicial');
    const headers = rows[headerRowIndex].map((value) => IMPORT_HEADERS[normalizeHeader(value)] ?? '');
    for (const required of ['categoria', 'referencia', 'metodo', 'presentacion', 'marca']) {
      if (!headers.includes(required)) throw new BadRequestException(`Falta la columna obligatoria: ${required}`);
    }
    const column = (row: unknown[], name: string) => {
      const index = headers.indexOf(name);
      return index < 0 ? '' : String(row[index] ?? '').trim();
    };
    for (let index = headerRowIndex + 1; index < rows.length; index++) {
      const row = rows[index];
      const rowNumber = index + 1;
      if (!row.some((value) => String(value ?? '').trim())) continue;
      try {
        const categoria = normalizeCategory(column(row, 'categoria'));
        const referencia = column(row, 'referencia');
        if (!referencia) throw new Error('Referencia es obligatoria');
        const rawCode = column(row, 'codigo');
        const codigo = rawCode && !['—', '-', 'N/A', 'NA'].includes(rawCode.toUpperCase()) ? rawCode : null;
        const fields = {
          scope_id: scopeId,
          tipo_servicio: TipoServicioCotizacion.INSUMOS,
          tipo_item: TipoItemCatalogo.PRODUCTO,
          categoria,
          codigo,
          referencia,
          metodo: column(row, 'metodo') || null,
          presentacion: column(row, 'presentacion') || null,
          marca: column(row, 'marca') || null,
          descripcion: referencia,
          unidad: 'unidad',
          precision_cantidad: 2,
          activo: true,
        };
        const existing = await this.productosRepository.findOne({
          where: codigo
            ? { scope_id: scopeId, tipo_servicio: TipoServicioCotizacion.INSUMOS, tipo_item: TipoItemCatalogo.PRODUCTO, codigo }
            : { scope_id: scopeId, tipo_servicio: TipoServicioCotizacion.INSUMOS, tipo_item: TipoItemCatalogo.PRODUCTO, referencia, metodo: fields.metodo ?? IsNull(), presentacion: fields.presentacion ?? IsNull(), marca: fields.marca ?? IsNull() },
        });
        if (existing) {
          Object.assign(existing, {
            categoria, codigo, referencia, metodo: fields.metodo,
            presentacion: fields.presentacion, marca: fields.marca,
            descripcion: referencia,
          });
          await this.productosRepository.save(existing);
          summary.updated++;
        } else {
          await this.productosRepository.save(this.productosRepository.create(fields));
          summary.created++;
        }
      } catch (error) {
        summary.errors.push({ row: rowNumber, message: error instanceof Error ? error.message : 'Fila inválida' });
      }
    }
    return summary;
  }

  findAll(access: PermissionContext, tipoItem?: TipoItemCatalogo): Promise<Producto[]> {
    const scopeIds = this.scopeIds(access);
    return this.productosRepository.find({
      where: { scope_id: In(scopeIds), ...(tipoItem ? { tipo_item: tipoItem } : {}) },
      order: { tipo_servicio: 'ASC', categoria: 'ASC', descripcion: 'ASC' },
    });
  }

  searchForQuote(
    tipoServicio: TipoServicioCotizacion,
    query: string | undefined,
    access: PermissionContext,
    tipoItem?: TipoItemCatalogo,
  ): Promise<Producto[]> {
    const scopeIds = this.scopeIds(access);
    const term = query?.trim();
    const base = {
      scope_id: In(scopeIds),
      tipo_servicio: tipoServicio,
      activo: true,
      ...(tipoItem ? { tipo_item: tipoItem } : {}),
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
    const nextTipoItem = dto.tipo_item ?? producto.tipo_item;
    this.validateSegmentFields(
      nextTipoItem,
      dto,
      producto,
      producto.tipo_item === TipoItemCatalogo.PRODUCTO && nextTipoItem === TipoItemCatalogo.SERVICIO,
    );
    const tipoServicio = dto.tipo_servicio ?? producto.tipo_servicio;
    const category = nextTipoItem === TipoItemCatalogo.SERVICIO
      ? null
      : dto.categoria === undefined ? producto.categoria : dto.categoria;
    producto.tipo_servicio = tipoServicio;
    producto.categoria = validateCategory(
      tipoServicio,
      nextTipoItem,
      tipoServicio === TipoServicioCotizacion.INSUMOS && nextTipoItem === TipoItemCatalogo.PRODUCTO
        ? category ?? CategoriaProducto.GENERAL
        : category,
    );
    if (dto.tipo_item !== undefined) producto.tipo_item = dto.tipo_item;
    if (nextTipoItem === TipoItemCatalogo.SERVICIO) {
      producto.categoria = null;
      producto.codigo = null;
      producto.referencia = null;
      producto.presentacion = null;
      producto.marca = null;
    }
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

  private validateSegmentFields(
    tipoItem: TipoItemCatalogo,
    values: Partial<Producto>,
    existing?: Producto,
    allowExistingProductFields = false,
  ): void {
    if (tipoItem !== TipoItemCatalogo.SERVICIO) return;
    const productOnlyFields: Array<keyof Producto> = [
      'categoria', 'codigo', 'referencia', 'presentacion', 'marca',
    ];
    const hasProductFields = productOnlyFields.some((field) => {
      const value = values[field] === undefined
        ? allowExistingProductFields ? null : existing?.[field]
        : values[field];
      return value !== undefined && value !== null && value !== '';
    });
    if (hasProductFields) {
      throw new BadRequestException(
        'Los campos de producto e insumo no aplican al segmento de servicios',
      );
    }
  }
}

import type { Repository } from 'typeorm';
import { In, Like } from 'typeorm';
import type { PermissionContext } from '../rbac/rbac-authorization.service.js';
import { TipoServicioCotizacion } from '../cotizaciones/entities/tipo-servicio.enum.js';
import { Producto, TipoItemCatalogo } from './entities/producto.entity.js';
import { ProductosService } from './productos.service.js';
import * as XLSX from '@e965/xlsx';

describe('ProductosService', () => {
  const access: PermissionContext = {
    permission: 'cotizaciones.crear',
    policy: { userId: 7, scopeIds: [4], ownScopeIds: [] },
    resourceScopeIds: [4],
  };

  it('creates a normalized catalog entry in the selected operational scope', async () => {
    const repository = {
      create: vi.fn((value) => value),
      save: vi.fn(async (value) => ({ id: 11, ...value })),
    };
    const service = new ProductosService(
      repository as unknown as Repository<Producto>,
    );

    const result = await service.create(
      {
        tipo_servicio: TipoServicioCotizacion.INSUMOS,
        tipo_item: 'PRODUCTO',
        categoria: 'EMPAQUES',
        codigo: '  EMP-01 ',
        referencia: ' REF-01 ',
        descripcion: ' Bolsa grado médico ',
        unidad: ' unidad ',
        precision_cantidad: 0,
      },
      access,
    );

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        scope_id: 4,
        tipo_servicio: TipoServicioCotizacion.INSUMOS,
        tipo_item: 'PRODUCTO',
        categoria: 'EMPAQUES',
        codigo: 'EMP-01',
        referencia: 'REF-01',
        descripcion: 'Bolsa grado médico',
        unidad: 'unidad',
        precision_cantidad: 0,
        activo: true,
      }),
    );
    expect(result.id).toBe(11);
  });

  it('searches only active entries of the requested type and authorized scope', async () => {
    const repository = {
      find: vi.fn(async () => []),
    };
    const service = new ProductosService(
      repository as unknown as Repository<Producto>,
    );

    await service.searchForQuote(
      TipoServicioCotizacion.INSUMOS,
      ' Bolsa ',
      access,
    );

    const options = repository.find.mock.calls[0][0];
    expect(options.take).toBe(50);
    expect(options.where).toHaveLength(7);
    for (const condition of options.where) {
      expect(condition.scope_id).toEqual(In([4]));
      expect(condition.tipo_servicio).toBe(TipoServicioCotizacion.INSUMOS);
      expect(condition.activo).toBe(true);
    }
    expect(options.where).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ descripcion: Like('%Bolsa%') }),
      ]),
    );
  });

  it('filters the catalog and quote search by item segment when requested', async () => {
    const repository = { find: vi.fn(async () => []) };
    const service = new ProductosService(repository as unknown as Repository<Producto>);

    await service.findAll(access, TipoItemCatalogo.SERVICIO);
    expect(repository.find.mock.calls[0][0].where).toEqual({ scope_id: In([4]), tipo_item: TipoItemCatalogo.SERVICIO });

    await service.searchForQuote(TipoServicioCotizacion.INSUMOS, 'vapor', access, TipoItemCatalogo.PRODUCTO);
    expect(repository.find.mock.calls[1][0].where[0]).toEqual(expect.objectContaining({ tipo_item: TipoItemCatalogo.PRODUCTO }));
  });

  it('rejects product-only fields for newly created services', async () => {
    const repository = { create: vi.fn((value) => value), save: vi.fn() };
    const service = new ProductosService(repository as unknown as Repository<Producto>);
    await expect(service.create({
      tipo_servicio: TipoServicioCotizacion.INDUSTRIAL_ETO,
      tipo_item: TipoItemCatalogo.SERVICIO,
      descripcion: 'Esterilización',
      codigo: 'COD-1',
    }, access)).rejects.toThrow('Los campos de producto e insumo no aplican al segmento de servicios');
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('uses safe defaults when catalog-only details are omitted', async () => {
    const repository = {
      create: vi.fn((value) => value),
      save: vi.fn(),
    };
    const service = new ProductosService(
      repository as unknown as Repository<Producto>,
    );

    await service.create(
        {
          tipo_servicio: TipoServicioCotizacion.INSUMOS,
          tipo_item: 'PRODUCTO',
          descripcion: 'Bolsa grado médico',
        },
        access,
      );
    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({
      categoria: 'GENERAL', unidad: 'unidad', precision_cantidad: 2,
      codigo: null, referencia: null, metodo: null, presentacion: null, marca: null,
    }));
    expect(repository.save).toHaveBeenCalled();
  });

  it('changes catalog availability without deleting the entry', async () => {
    const product = { id: 11, scope_id: 4, activo: true };
    const repository = {
      findOne: vi.fn(async () => product),
      save: vi.fn(async (value) => value),
      remove: vi.fn(),
    };
    const service = new ProductosService(
      repository as unknown as Repository<Producto>,
    );

    const result = await service.updateStatus(11, false, access);

    expect(result.activo).toBe(false);
    expect(repository.save).toHaveBeenCalledWith(product);
    expect(repository.remove).not.toHaveBeenCalled();
  });

  it('imports .xlsx rows idempotently into the authorized INSUMOS scope', async () => {
    const existing = { id: 12, scope_id: 4, codigo: 'C-1' };
    const repository = {
      create: vi.fn((value) => value),
      findOne: vi.fn().mockResolvedValueOnce(existing).mockResolvedValueOnce(null),
      save: vi.fn(async (value) => value),
    };
    const service = new ProductosService(repository as unknown as Repository<Producto>);
    const sheet = XLSX.utils.aoa_to_sheet([
      ['CATÁLOGO DE INSUMOS'],
      ['Notas y texto introductorio'],
      [],
      ['Categoría', 'Referencia', 'Código', 'Método de Esterilización', 'Presentación', 'Marca', 'Precio Antes de IVA', 'Precio Con IVA'],
      ['EMPAQUES PARA ESTERILIZACIÓN', 'REF-1', 'C-1', 'Vapor', 'Caja x 10', 'Marca', '', ''],
      ['MONITOREO ESTERILIZACIÓN', 'REF-2', '—', 'EtO', 'Caja', 'Marca', 100, 119],
    ]);
    const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, sheet, 'Insumos');
    const buffer = Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }));

    const result = await service.importExcel(buffer, access);

    expect(result).toEqual({ created: 1, updated: 1, errors: [] });
    expect(repository.findOne).toHaveBeenCalledWith({ where: expect.objectContaining({ scope_id: 4, tipo_servicio: TipoServicioCotizacion.INSUMOS, codigo: 'C-1' }) });
    expect(repository.save).toHaveBeenCalledWith(expect.objectContaining({ categoria: 'EMPAQUES', referencia: 'REF-1', metodo: 'Vapor', presentacion: 'Caja x 10', marca: 'Marca', codigo: 'C-1', scope_id: 4 }));
    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ categoria: 'MONITOREO', referencia: 'REF-2', metodo: 'EtO', codigo: null, tipo_servicio: TipoServicioCotizacion.INSUMOS }));
  });
});

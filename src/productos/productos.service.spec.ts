import type { Repository } from 'typeorm';
import { In, Like } from 'typeorm';
import type { PermissionContext } from '../rbac/rbac-authorization.service.js';
import { TipoServicioCotizacion } from '../cotizaciones/entities/tipo-servicio.enum.js';
import { Producto } from './entities/producto.entity.js';
import { ProductosService } from './productos.service.js';

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
    expect(options.where).toHaveLength(6);
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

  it('requires an Insumos category before creating a catalog item', async () => {
    const repository = {
      create: vi.fn((value) => value),
      save: vi.fn(),
    };
    const service = new ProductosService(
      repository as unknown as Repository<Producto>,
    );

    await expect(
      service.create(
        {
          tipo_servicio: TipoServicioCotizacion.INSUMOS,
          tipo_item: 'PRODUCTO',
          descripcion: 'Bolsa grado médico',
          unidad: 'unidad',
          precision_cantidad: 0,
        },
        access,
      ),
    ).rejects.toThrow('Seleccione una categoría válida para los insumos');
    expect(repository.save).not.toHaveBeenCalled();
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
});

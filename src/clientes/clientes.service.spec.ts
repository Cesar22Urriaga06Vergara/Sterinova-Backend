import { QueryFailedError, type Repository } from 'typeorm';
import { ClientesService } from './clientes.service.js';
import { Cliente } from './entities/cliente.entity.js';
import { CreateClienteDto } from './dto/create-cliente.dto.js';
import type { PermissionContext } from '../rbac/rbac-authorization.service.js';

describe('ClientesService.bulk', () => {
  const access: PermissionContext = {
    permission: 'clientes.importar',
    policy: { userId: 7, scopeIds: [2], ownScopeIds: [] },
    resourceScopeIds: [2],
  };

  it('omite NIT existentes e inserta el resto en un solo lote', async () => {
    const existing = [{ nit: '900' }];
    const clientesRepository = {
      find: vi.fn(async () => existing),
      create: vi.fn((clientes: CreateClienteDto[]) =>
        clientes.map((cliente) => ({ ...cliente })),
      ),
      save: vi.fn(async (clientes: Cliente[]) => clientes),
    };
    const service = new ClientesService(
      clientesRepository as unknown as Repository<Cliente>,
    );
    const clientes = [
      {
        razon_social: 'Cliente existente',
        nit: '900',
        contacto: 'Ana',
        telefono: '123',
        email: 'ana@example.com',
        direccion: 'Calle 1',
      },
      {
        razon_social: 'Cliente nuevo',
        nit: '901',
        contacto: 'Luis',
        telefono: '456',
        email: 'luis@example.com',
        direccion: 'Calle 2',
      },
    ];

    const result = await service.bulk(clientes, access);

    expect(clientesRepository.save).toHaveBeenCalledTimes(1);
    expect(clientesRepository.save).toHaveBeenCalledWith([
      expect.objectContaining({ nit: '901' }),
    ]);
    expect(result).toEqual({ imported: 1, skipped: 1 });
  });

  it('recupera un NIT duplicado concurrente e inserta los demás clientes', async () => {
    const duplicateError = new QueryFailedError('INSERT', [], {
      code: 'ER_DUP_ENTRY',
    });
    const clientesRepository = {
      find: vi
        .fn()
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{ nit: '901' }]),
      create: vi.fn((clientes: CreateClienteDto[]) =>
        clientes.map((cliente) => ({ ...cliente })),
      ),
      save: vi.fn().mockRejectedValueOnce(duplicateError).mockResolvedValueOnce([]),
    };
    const service = new ClientesService(
      clientesRepository as unknown as Repository<Cliente>,
    );
    const clientes = ['900', '901'].map((nit) => ({
      razon_social: `Cliente ${nit}`,
      nit,
      contacto: 'Contacto',
      telefono: '123',
      email: `${nit}@example.com`,
      direccion: 'Calle 1',
    }));

    const result = await service.bulk(clientes, access);

    expect(clientesRepository.save).toHaveBeenCalledTimes(2);
    expect(clientesRepository.save).toHaveBeenLastCalledWith([
      expect.objectContaining({ nit: '900' }),
    ]);
    expect(result).toEqual({ imported: 1, skipped: 1 });
  });
});

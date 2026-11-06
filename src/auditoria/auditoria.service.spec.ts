import { AuditoriaService } from './auditoria.service.js';

describe('AuditoriaService', () => {
  it('returns paginated audit entries with entity, user, and date filters', async () => {
    const entries = [{ id: 8, entidad: 'ciclo', usuario_id: 4 }];
    const repository = {
      findAndCount: vi.fn(async () => [entries, 1]),
      create: vi.fn((value) => value),
      save: vi.fn(async (value) => value),
    };
    const service = new AuditoriaService(repository as never);

    await expect(service.findAll({
      page: 2,
      limit: 10,
      entidad: 'ciclo',
      usuario_id: 4,
      desde: new Date('2026-11-01T00:00:00.000Z'),
      hasta: new Date('2026-11-06T23:59:59.999Z'),
    })).resolves.toEqual({ data: entries, total: 1, page: 2, limit: 10, totalPages: 1 });
    expect(repository.findAndCount).toHaveBeenCalledWith(expect.objectContaining({
      skip: 10,
      take: 10,
      order: { created_at: 'DESC' },
      where: expect.objectContaining({ entidad: 'ciclo', usuario_id: 4 }),
    }));
  });
});

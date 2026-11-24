import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { UsersService } from './users.service.js';
import { UserRole } from '../../test/fixtures/legacy-user-role.js';

describe('UsersService', () => {
  const createService = (users: Partial<User>[] = []) => {
    let excludedId: number | undefined;
    let queryBuilder: any;
    const repository = {
      query: vi.fn(async () => [{is_admin:1}]),
      find: vi.fn(async () => users),
      findOne: vi.fn(async ({ where }: { where: Partial<User> }) =>
        users.find((user) => Object.entries(where).every(([key, value]) => user[key as keyof User] === value)) ?? null,
      ),
      create: vi.fn((value: Partial<User>) => value),
      save: vi.fn(async (value: Partial<User>) => value),
      createQueryBuilder: vi.fn(() => queryBuilder),
    };
    queryBuilder = {
      addSelect: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      andWhere: vi.fn((_condition: string, parameters?: Record<string, unknown>) => {
        if (parameters?.excludedId !== undefined) excludedId = Number(parameters.excludedId);
        return queryBuilder;
      }),
      setLock: vi.fn().mockReturnThis(),
      getOne: vi.fn(async () => users[0] ?? null),
      getMany: vi.fn(async () => users.filter((user) => user.id !== excludedId && user.rol === UserRole.ADMIN && user.activo)),
    };
    const manager = {
      getRepository: vi.fn(() => repository),
      query: vi.fn(async () => []),
    };
    const transaction = vi.fn(async (work: (manager: unknown) => unknown) => work(manager));
    Object.assign(repository, { manager: { transaction, query: manager.query } });
    return { service: new UsersService(repository as unknown as Repository<User>), repository, transaction };
  };

  it('rejects listing without an explicit permission context before querying users', async () => {
    const user = { id: 1, nombre: 'Ana', password_hash: 'secret' } as User;
    const { service, repository } = createService([user]);

    await expect(service.findAll(undefined as never)).rejects.toMatchObject({ status: 403 });
    expect(repository.find).not.toHaveBeenCalled();
    expect(repository.createQueryBuilder).not.toHaveBeenCalled();
  });

  it('creates a user with contact details and hashes the password', async () => {
    const { service, repository } = createService();

    const user = await service.create({
      nombre: 'Ana', apellido: 'Pérez', email: 'ana@sterinova.co', password: 'ClaveSegura123!',
      rol: UserRole.COMERCIAL, cargo: 'Asesora', celular: '3001234567', email_contacto: 'ana.contacto@example.com',
    });

    expect(user).toMatchObject({ nombre: 'Ana', apellido: 'Pérez', activo: true });
    expect(user).not.toHaveProperty('rol');
    expect(user).not.toHaveProperty('password_hash');
    expect(repository.save).toHaveBeenCalled();
  });

  it('prevents an administrator from deactivating their own account', async () => {
    const { service } = createService([{ id: 1, rol: UserRole.ADMIN, activo: true }]);

    await expect(service.setActive(1, false, 1)).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('prevents deactivating the last active administrator', async () => {
    const { service } = createService([{ id: 2, rol: UserRole.ADMIN, activo: true }]);

    await expect(service.setActive(2, false, 1)).rejects.toBeInstanceOf(ConflictException);
  });

  it('allows deactivating an administrator when another active administrator remains', async () => {
    const users = [
      { id: 1, rol: UserRole.ADMIN, activo: true },
      { id: 2, rol: UserRole.ADMIN, activo: true },
    ];
    const { service } = createService(users);

    const updated = await service.setActive(2, false, 1);

    expect(updated.activo).toBe(false);
  });

  it('returns not found when updating a missing user', async () => {
    const { service } = createService();

    await expect(service.setActive(8, false, 1)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('protects platform owner from update by area admin', async () => {
    const users = [{ id: 1, nombre: 'Owner', email: 'owner@sterinova.co', activo: true }];
    const { service, repository } = createService(users);
    repository.manager.query = vi.fn(async () => [{protected: 1}]); // platform owner

    await expect(service.update(1, { nombre: 'Nuevo' })).rejects.toBeInstanceOf(ForbiddenException);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('protects user with GLOBAL scope assignment from update', async () => {
    const users = [{ id: 2, nombre: 'GlobalAdmin', email: 'global@sterinova.co', activo: true }];
    const { service, repository } = createService(users);
    repository.manager.query = vi.fn(async () => [{protected: 1}]); // GLOBAL scope assignment

    await expect(service.update(2, { cargo: 'Nuevo Cargo' })).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('protects platform owner from deactivation', async () => {
    const { service, repository } = createService([{ id: 1, rol: UserRole.ADMIN, activo: true }]);
    repository.manager.query = vi.fn(async () => [{protected: 1}]); // platform owner

    await expect(service.setActive(1, false, 2)).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('prevents self-modification of email (identity)', async () => {
    const users = [{ id: 1, nombre: 'Ana', email: 'ana@sterinova.co', activo: true }];
    const { service } = createService(users);

    await expect(service.update(1, { email: 'nuevo@sterinova.co' })).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('creates a user atomically with role assignment and activation in one transaction', async () => {
    const { service, repository, transaction } = createService();
    repository.manager.query = vi.fn(async () => []);

    const result = await service.createWithAssignment(
      {
        nombre: 'Nuevo',
        apellido: 'Usuario',
        email: 'nuevo@sterinova.co',
        password: 'ClaveSegura123!',
        cargo: 'Analista',
        celular: '3001112233',
      },
      { role_id: 5, scope_id: 2 },
      1, // actorId
    );

    expect(result).toMatchObject({ nombre: 'Nuevo', email: 'nuevo@sterinova.co', activo: true });
    expect(transaction).toHaveBeenCalledTimes(1);
  });
});

import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { UsersService } from './users.service.js';
import { UserRole } from './entities/user-role.enum.js';
import { UsersController } from './users.controller.js';

describe('UsersService', () => {
  const createService = (users: Partial<User>[] = []) => {
    let excludedId: number | undefined;
    let queryBuilder: any;
    const repository = {
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
    };
    const transaction = vi.fn(async (work: (manager: unknown) => unknown) => work(manager));
    Object.assign(repository, { manager: { transaction } });
    return { service: new UsersService(repository as unknown as Repository<User>), repository, transaction };
  };

  it('lists users without exposing password hashes', async () => {
    const user = { id: 1, nombre: 'Ana', password_hash: 'secret' } as User;
    const { service, repository } = createService([user]);

    const result = await service.findAll();

    expect(repository.find).toHaveBeenCalledWith({ order: { id: 'ASC' } });
    expect(result[0]).not.toHaveProperty('password_hash');
  });

  it('creates a user with contact details and hashes the password', async () => {
    const { service, repository } = createService();

    const user = await service.create({
      nombre: 'Ana', apellido: 'Pérez', email: 'ana@sterinova.co', password: 'ClaveSegura123!',
      rol: UserRole.COMERCIAL, cargo: 'Asesora', celular: '3001234567', email_contacto: 'ana.contacto@example.com',
    });

    expect(user).toMatchObject({ nombre: 'Ana', apellido: 'Pérez', rol: UserRole.COMERCIAL, activo: true });
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
});

describe('UsersController authorization', () => {
  it('restricts user administration to Admin', () => {
    expect(Reflect.getMetadata('roles', UsersController)).toEqual([UserRole.ADMIN]);
  });
});

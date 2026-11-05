import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserRole } from './entities/user-role.enum.js';

export type PublicUser = Omit<User, 'password_hash'>;

function toPublicUser(user: User): PublicUser {
  const { password_hash: _passwordHash, ...result } = user;
  return result;
}

function isDuplicateEmail(error: unknown): boolean {
  return typeof error === 'object' && error !== null &&
    ('code' in error && (error.code === 'ER_DUP_ENTRY' || error.code === 'SQLITE_CONSTRAINT_UNIQUE'));
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<PublicUser[]> {
    const users = await this.usersRepository.find({ order: { id: 'ASC' } });
    return users.map(toPublicUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.password_hash')
      .where('LOWER(usuario.email) = LOWER(:email)', { email: email.trim() })
      .getOne();
  }

  findById(id: number): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.password_hash')
      .where('usuario.id = :id', { id })
      .getOne();
  }

  findActiveById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id, activo: true } });
  }

  async create(createUserDto: CreateUserDto): Promise<PublicUser> {
    const email = createUserDto.email.trim().toLowerCase();
    if (await this.usersRepository.findOne({ where: { email } })) {
      throw new ConflictException('Ya existe un usuario con ese correo');
    }
    const password_hash = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      nombre: createUserDto.nombre.trim(),
      apellido: createUserDto.apellido?.trim() || null,
      email,
      email_contacto: createUserDto.email_contacto?.trim().toLowerCase() || null,
      cargo: createUserDto.cargo?.trim() || null,
      celular: createUserDto.celular?.trim() || null,
      password_hash,
      rol: createUserDto.rol,
      activo: true,
    });
    try {
      return toPublicUser(await this.usersRepository.save(user as User));
    } catch (error) {
      if (isDuplicateEmail(error)) throw new ConflictException('Ya existe un usuario con ese correo');
      throw error;
    }
  }

  async update(id: number, dto: UpdateUserDto): Promise<PublicUser> {
    return this.usersRepository.manager.transaction(async (manager) => {
      const repository = manager.getRepository(User);
      const user = await repository.findOne({ where: { id }, lock: { mode: 'pessimistic_write' } });
      if (!user) throw new NotFoundException(`Usuario #${id} no encontrado`);

      if (dto.email !== undefined) {
        const email = dto.email.trim().toLowerCase();
        const existing = await repository.findOne({ where: { email } });
        if (existing && existing.id !== id) throw new ConflictException('Ya existe un usuario con ese correo');
        user.email = email;
      }
      if (dto.rol !== undefined && user.activo && user.rol === UserRole.ADMIN && dto.rol !== UserRole.ADMIN) {
        await this.assertAnotherActiveAdmin(repository, id);
      }
      if (dto.nombre !== undefined) user.nombre = dto.nombre.trim();
      if (dto.apellido !== undefined) user.apellido = dto.apellido?.trim() || null;
      if (dto.cargo !== undefined) user.cargo = dto.cargo?.trim() || null;
      if (dto.celular !== undefined) user.celular = dto.celular?.trim() || null;
      if (dto.email_contacto !== undefined) user.email_contacto = dto.email_contacto?.trim().toLowerCase() || null;
      if (dto.rol !== undefined) user.rol = dto.rol;
      try {
        return toPublicUser(await repository.save(user));
      } catch (error) {
        if (isDuplicateEmail(error)) throw new ConflictException('Ya existe un usuario con ese correo');
        throw error;
      }
    });
  }

  async changePassword(id: number, password: string): Promise<{ id: number; actualizado: true }> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Usuario #${id} no encontrado`);
    user.password_hash = await bcrypt.hash(password, 10);
    await this.usersRepository.save(user);
    return { id, actualizado: true };
  }

  async setActive(id: number, activo: boolean, actorId: number): Promise<PublicUser> {
    if (!activo && id === actorId) {
      throw new ForbiddenException('No puedes desactivar tu propio usuario');
    }
    return this.usersRepository.manager.transaction(async (manager) => {
      const repository = manager.getRepository(User);
      const user = await repository.findOne({ where: { id }, lock: { mode: 'pessimistic_write' } });
      if (!user) throw new NotFoundException(`Usuario #${id} no encontrado`);
      if (!activo && user.activo && user.rol === UserRole.ADMIN) {
        await this.assertAnotherActiveAdmin(repository, id);
      }
      user.activo = activo;
      return toPublicUser(await repository.save(user));
    });
  }

  private async assertAnotherActiveAdmin(repository: Repository<User>, excludedId: number): Promise<void> {
    const admins = await repository
      .createQueryBuilder('usuario')
      .where('usuario.rol = :rol', { rol: UserRole.ADMIN })
      .andWhere('usuario.activo = :activo', { activo: true })
      .andWhere('usuario.id <> :excludedId', { excludedId })
      .setLock('pessimistic_write')
      .getMany();
    if (!admins.length) throw new ConflictException('Debe permanecer al menos un Admin activo');
  }
}

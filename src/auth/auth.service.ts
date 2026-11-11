import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { User } from '../users/entities/user.entity.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password_hash'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.activo) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return null;
    }

    const { password_hash: _passwordHash, ...result } = user;
    return result;
  }

  async verifyPassword(userId: number, password: string): Promise<boolean> {
    const user = await this.usersService.findById(userId);
    return user ? bcrypt.compare(password, user.password_hash) : false;
  }

  login(user: Pick<User, 'id' | 'nombre' | 'apellido' | 'email' | 'rol' | 'cargo' | 'celular' | 'email_contacto' | 'password_version'>) {
    const payload = {
      sub: user.id,
      email: user.email,
      rol: user.rol,
      password_version: user.password_version ?? 1,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol,
        cargo: user.cargo,
        celular: user.celular,
        email_contacto: user.email_contacto,
      },
    };
  }
}

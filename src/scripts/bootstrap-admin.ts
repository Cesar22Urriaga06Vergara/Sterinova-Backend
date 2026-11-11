import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../database/data-source.js';
import { User } from '../users/entities/user.entity.js';
import { UserRole } from '../users/entities/user-role.enum.js';

const nombre = process.env.ADMIN_NAME?.trim();
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!nombre || !email || !password || password.length < 12) {
  throw new Error(
    'Define ADMIN_NAME, ADMIN_EMAIL y ADMIN_PASSWORD (mínimo 12 caracteres) para crear el Admin inicial.',
  );
}

await AppDataSource.initialize();
try {
  const users = AppDataSource.getRepository(User);
  if (await users.findOneBy({ email })) {
    if (!process.argv.includes('--if-missing')) {
      throw new Error(`Ya existe un usuario con email ${email}. No se modificó ninguna cuenta.`);
    }
    process.stdout.write('La cuenta inicial ya existe; no se modificó.\n');
  } else {
    const password_hash = await bcrypt.hash(password, 12);
    const user = users.create({
      nombre,
      email,
      password_hash,
      rol: UserRole.ADMIN,
    });
    await users.save(user);
    process.stdout.write(`Admin inicial creado (id=${user.id}).\n`);
  }
} finally {
  await AppDataSource.destroy();
}

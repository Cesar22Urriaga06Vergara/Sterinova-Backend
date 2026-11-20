import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../database/data-source.js';
import { User } from '../users/entities/user.entity.js';

type Assignment = { role_id: number; scope_id: number };

const nombre = process.env.ADMIN_NAME?.trim() || undefined;
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const args = process.argv.slice(2);
const ifMissing = args.includes('--if-missing');
const reconfigureId1 = args.includes('--reconfigure-id1');

if (ifMissing && reconfigureId1) {
  throw new Error('Usa un solo modo de bootstrap por ejecución.');
}
const missingCredentials = !email || !password;

async function getSuperadminAssignment(): Promise<Assignment> {
  const rows = (await AppDataSource.query(`
    SELECT r.id AS role_id, s.id AS scope_id
    FROM rbac_roles r
    JOIN rbac_scopes s ON s.kind='GLOBAL' AND s.active=1
    WHERE r.code='superadmin' AND r.kind='PLATFORM' AND r.active=1
    ORDER BY s.id
    LIMIT 1
  `)) as { role_id: number | string; scope_id: number | string }[];

  if (!rows[0]) {
    throw new Error(
      'No existe un perfil superadmin de plataforma activo o un ámbito global activo.',
    );
  }
  return {
    role_id: Number(rows[0].role_id),
    scope_id: Number(rows[0].scope_id),
  };
}

async function getAssignments(userId: number): Promise<Assignment[]> {
  const rows = (await AppDataSource.query(
    `SELECT role_id,scope_id FROM rbac_user_role_assignments
       WHERE user_id=? AND active=1
     UNION ALL
     SELECT role_id,scope_id FROM rbac_platform_owner WHERE user_id=?`,
    [userId, userId],
  )) as { role_id: number | string; scope_id: number | string }[];
  return rows.map(({ role_id, scope_id }) => ({
    role_id: Number(role_id),
    scope_id: Number(scope_id),
  }));
}

async function isGlobalAdmin(userId: number): Promise<boolean> {
  const rows = (await AppDataSource.query(
    'SELECT rbac_is_global_admin(?) AS is_admin',
    [userId],
  )) as { is_admin: number | boolean }[];
  return Number(rows[0]?.is_admin) === 1;
}

async function hasAnyAssignment(): Promise<boolean> {
  const rows = (await AppDataSource.query(`
    SELECT (
      EXISTS(SELECT 1 FROM rbac_user_role_assignments)
      OR EXISTS(SELECT 1 FROM rbac_platform_owner)
    ) AS has_assignments
  `)) as { has_assignments: number | boolean }[];
  return Number(rows[0]?.has_assignments) === 1;
}

async function hasAnyUser(): Promise<boolean> {
  const rows = (await AppDataSource.query(
    'SELECT EXISTS(SELECT 1 FROM usuarios LIMIT 1) AS has_users',
  )) as { has_users: number | boolean }[];
  return Number(rows[0]?.has_users) === 1;
}

async function assignSuperadmin(
  userId: number,
  actorId: number | null,
  assignments: Assignment[],
) {
  const versions = (await AppDataSource.query(
    'SELECT rbac_version FROM usuarios WHERE id=?',
    [userId],
  )) as { rbac_version: number | string }[];
  if (!versions[0]) throw new Error(`No existe el usuario ID ${userId}.`);

  await AppDataSource.query('CALL rbac_set_user_roles(?, ?, ?, ?)', [
    userId,
    JSON.stringify(assignments),
    actorId,
    Number(versions[0].rbac_version),
  ]);
  if (!(await isGlobalAdmin(userId))) {
    throw new Error(
      `No se pudo verificar el acceso global de la cuenta ID ${userId}.`,
    );
  }
}

async function runBootstrap(): Promise<void> {
  if (missingCredentials && process.env.NODE_ENV === 'production') {
    process.stdout.write(
      'Bootstrap de administrador omitido: ADMIN_EMAIL o ADMIN_PASSWORD no están configurados.\n',
    );
    return;
  }
  await AppDataSource.initialize();
  try {
    const users = AppDataSource.getRepository(User);
    if (!reconfigureId1 && (await hasAnyUser())) {
      process.stdout.write(
        'Bootstrap de administrador omitido: ya existe al menos un usuario.\n',
      );
    } else {
      if (
        !email ||
        !password ||
        password.length < 12 ||
        (!reconfigureId1 && !nombre)
      ) {
        throw new Error(
          'Define ADMIN_EMAIL y ADMIN_PASSWORD (mínimo 12 caracteres); ADMIN_NAME también es obligatorio para crear el Admin inicial.',
        );
      }
      const existingByEmail = await users.findOneBy({ email });

      if (reconfigureId1) {
        const user = await users.findOneBy({ id: 1 });
        if (!user)
          throw new Error('No existe una cuenta ID 1 para reconfigurar.');
        if (!user.activo) {
          throw new Error(
            'La cuenta ID 1 está inactiva; debe reactivarla un administrador autorizado.',
          );
        }
        if (existingByEmail && existingByEmail.id !== 1) {
          throw new Error(
            'El correo configurado ya pertenece a otra cuenta; no se modificó ninguna cuenta.',
          );
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const superadmin = await getSuperadminAssignment();
        const assignments = await getAssignments(user.id);
        const alreadyAdmin = await isGlobalAdmin(user.id);

        if (!alreadyAdmin && (await hasAnyAssignment())) {
          throw new Error(
            'No se puede asignar el superadmin: hay asignaciones RBAC existentes y la cuenta ID 1 no es administradora global. Use una cuenta administradora autorizada.',
          );
        }
        if (alreadyAdmin && assignments.length === 0) {
          throw new Error(
            'No se pudieron leer las asignaciones RBAC de ID 1; no se modificó la cuenta.',
          );
        }

        const hasSuperadmin = assignments.some(
          (assignment) =>
            assignment.role_id === superadmin.role_id &&
            assignment.scope_id === superadmin.scope_id,
        );
        if (!alreadyAdmin) {
          await assignSuperadmin(user.id, null, [superadmin]);
        } else if (!hasSuperadmin) {
          await assignSuperadmin(user.id, user.id, [
            ...assignments,
            superadmin,
          ]);
        }

        const result: { affectedRows?: number } = await AppDataSource.query(
          `UPDATE usuarios SET nombre=?, email=?, password_hash=?,
        password_version=password_version+1, activo=1 WHERE id=1`,
          [nombre ?? user.nombre, email, passwordHash],
        );
        if (result.affectedRows !== 1) {
          throw new Error('No se pudo actualizar la cuenta ID 1.');
        }
        process.stdout.write(
          'Cuenta ID 1 configurada; superadmin de plataforma verificado mediante RBAC.\n',
        );
      } else if (existingByEmail) {
        if (!ifMissing) {
          throw new Error(
            `Ya existe un usuario con email ${email}. No se modificó ninguna cuenta.`,
          );
        }
        process.stdout.write('La cuenta inicial ya existe; no se modificó.\n');
      } else {
        if (!nombre) {
          throw new Error(
            'ADMIN_NAME es obligatorio para crear el Admin inicial.',
          );
        }
        if (await hasAnyAssignment()) {
          throw new Error(
            'No se puede crear el superadmin inicial porque ya existen asignaciones RBAC. Use una cuenta administradora autorizada.',
          );
        }
        if (await hasAnyUser()) {
          throw new Error(
            'Ya existen usuarios en la base de datos; el bootstrap inicial solo puede crear el primer usuario.',
          );
        }

        const superadmin = await getSuperadminAssignment();
        const passwordHash = await bcrypt.hash(password, 12);
        const user = users.create({
          nombre,
          email,
          password_hash: passwordHash,
        });
        await users.save(user);
        try {
          await assignSuperadmin(user.id, null, [superadmin]);
        } catch (error) {
          const cleanup = await users.delete({ id: user.id });
          if (cleanup.affected !== 1) {
            throw new AggregateError(
              [error, new Error('No se pudo retirar la cuenta incompleta.')],
              'Falló la asignación RBAC del Admin inicial y también su limpieza.',
            );
          }
          throw error;
        }
        process.stdout.write(`Superadmin inicial creado (id=${user.id}).\n`);
      }
    }
  } finally {
    await AppDataSource.destroy();
  }
}

await runBootstrap();

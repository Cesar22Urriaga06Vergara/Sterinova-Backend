import { In, type DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity.js';
import { Cotizacion } from '../cotizaciones/entities/cotizacion.entity.js';
import {
  Auditoria,
  AccionAuditoria,
} from '../auditoria/entities/auditoria.entity.js';
import { RbacScope, RbacScopeClosure } from './entities/scope.entity.js';
import { RbacRole } from './entities/role.entity.js';
import {
  RbacPlatformOwner,
  RbacUserRoleAssignment,
} from './entities/user-role-assignment.entity.js';

export type LocalRbacPilotPlan = {
  targetDatabase: string;
  owner: { userId: number; expectedEmail: string };
  departments: Array<{
    code: string;
    name: string;
    assignments: Array<{ userId: number; roles: string[] }>;
  }>;
  quotes: { ids: number[]; creatorUserId: number; scopeCode: string };
};

/** Explicit local data reconciliation, deliberately not registered as a general schema migration. */
export async function migrateLocalRbacPilot(
  source: DataSource,
  plan: LocalRbacPilotPlan,
) {
  if (
    source.options.type !== 'mariadb' ||
    process.env.NODE_ENV === 'production' ||
    !['localhost', '127.0.0.1', '::1'].includes(String(source.options.host)) ||
    source.options.database !== plan.targetDatabase
  )
    throw new Error('El plan no coincide con una base local de desarrollo.');
  const userIds = [
    ...new Set([
      plan.owner.userId,
      plan.quotes.creatorUserId,
      ...plan.departments.flatMap((d) => d.assignments.map((a) => a.userId)),
    ]),
  ].sort((a, b) => a - b);
  if (
    !plan.owner.expectedEmail ||
    userIds.some((id) => !Number.isSafeInteger(id) || id < 1) ||
    plan.quotes.ids.some((id) => !Number.isSafeInteger(id) || id < 1) ||
    new Set(plan.quotes.ids).size !== plan.quotes.ids.length ||
    !plan.departments.length ||
    new Set(plan.departments.map((d) => d.code)).size !==
      plan.departments.length ||
    plan.departments.some(
      (d) =>
        !/^[a-z][a-z0-9_-]{0,99}$/.test(d.code) ||
        !d.name.trim() ||
        d.name.length > 160,
    )
  ) {
    throw new Error('Plan local inválido o ambiguo.');
  }
  return source.transaction(async (manager) => {
    const users = await manager
      .getRepository(User)
      .find({ where: { id: In(userIds), activo: true } });
    if (
      users.length !== userIds.length ||
      users.find((u) => u.id === plan.owner.userId)?.email.toLowerCase() !==
        plan.owner.expectedEmail.toLowerCase()
    ) {
      throw new Error(
        'Las identidades del plan no coinciden con usuarios activos.',
      );
    }
    const scopes = manager.getRepository(RbacScope);
    const closure = manager.getRepository(RbacScopeClosure);
    const roles = manager.getRepository(RbacRole);
    const global = await scopes.findOne({
      where: { kind: 'GLOBAL', active: true },
      lock: { mode: 'pessimistic_write' },
    });
    const platformRole = await roles.findOneBy({
      code: 'superadmin',
      kind: 'PLATFORM',
      active: true,
    });
    if (!global || !platformRole)
      throw new Error('Faltan ámbito global o rol de plataforma.');
    const ownerRepository = manager.getRepository(RbacPlatformOwner);
    const existingOwner = await ownerRepository.findOneBy({ id: 1 });
    if (
      existingOwner &&
      (existingOwner.user_id !== plan.owner.userId ||
        existingOwner.role_id !== platformRole.id ||
        existingOwner.scope_id !== global.id)
    )
      throw new Error('Ya existe otra titularidad global; no se reemplaza.');
    if (!existingOwner)
      await ownerRepository.save(
        ownerRepository.create({
          id: 1,
          user_id: plan.owner.userId,
          role_id: platformRole.id,
          role_kind: 'PLATFORM',
          scope_id: global.id,
          scope_kind: 'GLOBAL',
        }),
      );

    const audit = manager.getRepository(Auditoria);
    const record = (
      entity: string,
      id: number,
      detail: Record<string, unknown>,
    ) =>
      audit.save(
        audit.create({
          usuario_id: plan.owner.userId,
          entidad: entity,
          entidad_id: id,
          accion: AccionAuditoria.EDITAR,
          detalle: { migracion_local_autorizada: true, ...detail },
        }),
      );
    if (!existingOwner)
      await record('rbac_platform_owner', 1, { user_id: plan.owner.userId });
    const departmentScopes = new Map<string, RbacScope>();
    for (const department of plan.departments) {
      let scope = await scopes.findOneBy({ code: department.code });
      if (
        scope &&
        (scope.kind !== 'DEPARTMENT' ||
          scope.parent_id !== global.id ||
          !scope.active)
      )
        throw new Error('El ámbito existente no coincide con el plan local.');
      if (!scope) {
        scope = await scopes.save(
          scopes.create({
            code: department.code,
            name: department.name,
            kind: 'DEPARTMENT',
            parent_id: global.id,
            active: true,
          }),
        );
        await record('rbac_scopes', scope.id, { code: scope.code });
      }
      departmentScopes.set(department.code, scope);
      for (const row of [
        { ancestor_id: global.id, descendant_id: scope.id, depth: 1 },
        { ancestor_id: scope.id, descendant_id: scope.id, depth: 0 },
      ]) {
        const prior = await closure.findOneBy({
          ancestor_id: row.ancestor_id,
          descendant_id: row.descendant_id,
        });
        if (prior && prior.depth !== row.depth)
          throw new Error('Cierre jerárquico inconsistente.');
        if (!prior) await closure.save(closure.create(row));
      }
      for (const assignment of department.assignments) {
        for (const code of new Set(assignment.roles)) {
          const role = await roles.findOneBy({
            code,
            kind: 'STANDARD',
            active: true,
          });
          if (!role) throw new Error('Rol local inexistente o no asignable.');
          const assignments = manager.getRepository(RbacUserRoleAssignment);
          const prior = await assignments.findOneBy({
            user_id: assignment.userId,
            role_id: role.id,
            scope_id: scope.id,
          });
          if (!prior || !prior.active) {
            const saved = await assignments.save(
              assignments.create({
                ...prior,
                user_id: assignment.userId,
                role_id: role.id,
                role_kind: 'STANDARD',
                scope_id: scope.id,
                scope_kind: 'DEPARTMENT',
                active: true,
              }),
            );
            await record('rbac_user_role_assignments', saved.id, {
              user_id: assignment.userId,
              role: code,
              scope_id: scope.id,
            });
          }
        }
      }
    }
    const quoteScope = departmentScopes.get(plan.quotes.scopeCode);
    if (!quoteScope)
      throw new Error('Falta el ámbito autorizado para las cotizaciones.');
    const quotes = manager.getRepository(Cotizacion);
    let reassigned = 0;
    for (const id of [...plan.quotes.ids].sort((a, b) => a - b)) {
      const quote = await quotes.findOne({
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (
        !quote ||
        (quote.creador_id !== null &&
          quote.creador_id !== plan.quotes.creatorUserId) ||
        (quote.scope_id !== null && quote.scope_id !== quoteScope.id)
      )
        throw new Error(
          'Cotización inexistente o ya atribuida a otro propietario/ámbito.',
        );
      if (quote.creador_id === null || quote.scope_id === null) {
        await quotes.update(
          { id },
          { creador_id: plan.quotes.creatorUserId, scope_id: quoteScope.id },
        );
        await record('cotizaciones', id, {
          atribucion_provisional: true,
          creador_id: plan.quotes.creatorUserId,
          scope_id: quoteScope.id,
        });
        reassigned++;
      }
    }
    return {
      platformOwnerUserId: plan.owner.userId,
      assignedUserIds: userIds,
      departments: [...departmentScopes].map(([code, scope]) => ({
        code,
        id: scope.id,
      })),
      provisionallyAttributedQuotes: reassigned,
    };
  });
}

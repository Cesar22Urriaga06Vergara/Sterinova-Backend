import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import type { EntityManager } from 'typeorm';
import type { PermissionContext } from '../rbac/rbac-authorization.service.js';
import type { MetricasQueryDto } from './dto/metricas-query.dto.js';
import { fechaHoyBogota } from '../common/fecha-bogota.js';

const DAY = 86400000;
/** Check every period boundary using the actual connection's date serialization.
 * DATETIME defaults and application dates must share the SQL session's clock.
 * This changes no session settings and rejects drift instead of guessing history.
 */
export async function verifyMetricTimezone(
  manager: Pick<EntityManager, 'query'>,
  instants: Date[],
) {
  const [row] = await manager.query(
    `SELECT ${instants.map((_, i) => `UNIX_TIMESTAMP(?) AS t${i}`).join(',')}`,
    instants,
  );
  if (
    !row ||
    instants.some(
      (instant, i) =>
        row[`t${i}`] == null ||
        Number(row[`t${i}`]) !== instant.getTime() / 1000,
    )
  )
    throw new ConflictException(
      'La zona horaria del driver y la sesión de base de datos no coincide; concilie la configuración antes de consultar métricas diarias',
    );
}

export function metricWindow(
  query: Pick<MetricasQueryDto, 'desde' | 'hasta'>,
  now = new Date(),
) {
  const today = fechaHoyBogota(now);
  const desde = query.desde ?? today;
  const hasta = query.hasta ?? today;
  const parse = (value: string) => {
    const stamp = Date.parse(`${value}T00:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      !Number.isFinite(stamp) ||
      new Date(stamp).toISOString().slice(0, 10) !== value
    )
      throw new BadRequestException(
        'La fecha debe ser un día válido YYYY-MM-DD',
      );
    return stamp;
  };
  const start = parse(desde),
    end = parse(hasta);
  if (end < start || end - start >= 366 * DAY)
    throw new BadRequestException(
      'El periodo debe estar ordenado y tener máximo 366 días',
    );
  const dias = Array.from({ length: (end - start) / DAY + 1 }, (_, i) =>
    new Date(start + i * DAY).toISOString().slice(0, 10),
  );
  return {
    desde,
    hasta,
    fin: new Date(end + DAY).toISOString().slice(0, 10),
    dias,
  };
}

export function metricScopeIds(access: PermissionContext, requested?: number) {
  if (
    access?.permission !== 'gerencia.metricas.ver' ||
    !Number.isSafeInteger(access.policy.userId) ||
    Number(access.policy.userId) < 1
  )
    throw new ForbiddenException('Falta permiso de consulta gerencial');
  // If user has GLOBAL scope (id=1) in their policy, treat it as "all accessible areas"
  const hasGlobal = access.policy.scopeIds.includes(1);
  const resourceIds = hasGlobal ? access.policy.scopeIds.filter((id) => id !== 1) : access.resourceScopeIds;
  const ids = [
    ...new Set(
      resourceIds.filter((id) => access.policy.scopeIds.includes(id)),
    ),
  ];
  // If requested is GLOBAL (1) and user has GLOBAL in policy, allow it (expand to all)
  if (requested === 1 && hasGlobal) {
    return ids;
  }
  if (!ids.length || (requested !== undefined && !ids.includes(requested)))
    throw new ForbiddenException('Área no autorizada para consulta gerencial');
  return requested === undefined ? ids : [requested];
}

export function sumMoney(values: readonly string[]) {
  const cents = values.reduce((total, value) => {
    if (!/^\d+(\.\d{1,2})?$/.test(value))
      throw new Error('Importe agregado inválido');
    const [integer, fraction = ''] = value.split('.');
    return total + BigInt(integer) * 100n + BigInt(fraction.padEnd(2, '0'));
  }, 0n);
  return `${cents / 100n}.${String(cents % 100n).padStart(2, '0')}`;
}

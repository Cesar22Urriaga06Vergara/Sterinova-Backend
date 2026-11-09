import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, type EntityManager } from 'typeorm';
import {
  Auditoria,
  AccionAuditoria,
} from '../auditoria/entities/auditoria.entity.js';
import type { PermissionContext } from '../rbac/rbac-authorization.service.js';

export type IvaVersion = {
  id: number;
  version: number;
  tasa: string;
  vigente_desde: string;
};
const projection =
  "id, version, tasa, DATE_FORMAT(vigente_desde, '%Y-%m-%dT%H:%i:%s.%fZ') AS vigente_desde";

export async function resolveCurrentIva(
  manager: Pick<EntityManager, 'query'>,
): Promise<IvaVersion> {
  const rows: IvaVersion[] =
    await manager.query(`SELECT ${projection} FROM tasas_fiscales
    WHERE impuesto = 'IVA' AND vigente_desde <= UTC_TIMESTAMP(6)
    ORDER BY vigente_desde DESC LIMIT 1`);
  if (!rows.length)
    throw new ServiceUnavailableException(
      'No existe una tasa de IVA vigente configurada',
    );
  return rows[0];
}

@Injectable()
export class TasasFiscalesService {
  constructor(@InjectDataSource() private readonly source: DataSource) {}
  current() {
    return resolveCurrentIva(this.source.manager);
  }
  private async requireGlobalAccess(access: PermissionContext) {
    const rows: { id: number }[] = await this.source.query(
      "SELECT id FROM rbac_scopes WHERE kind = 'GLOBAL' AND active = 1",
    );
    if (
      access.permission !== 'tasas_fiscales.gestionar' ||
      !access.policy.userId ||
      !rows.some(({ id }) => access.policy.scopeIds.includes(id))
    )
      throw new ForbiddenException(
        'La configuración fiscal requiere permiso de ámbito global',
      );
  }
  async history(access: PermissionContext): Promise<IvaVersion[]> {
    await this.requireGlobalAccess(access);
    return this.source.query(
      `SELECT ${projection}, motivo, creado_por FROM tasas_fiscales WHERE impuesto = 'IVA' ORDER BY version DESC`,
    );
  }
  async publish(
    dto: { tasa: string; vigente_desde: string; motivo: string },
    access: PermissionContext,
  ) {
    await this.requireGlobalAccess(access);
    const userId = access.policy.userId!;
    return this.source.transaction(async (manager) => {
      // The seeded first version provides a stable row to serialize publications.
      const rows: (IvaVersion & { now_utc: string })[] =
        await manager.query(`SELECT ${projection},
        DATE_FORMAT(UTC_TIMESTAMP(6), '%Y-%m-%dT%H:%i:%s.%fZ') AS now_utc
        FROM tasas_fiscales WHERE impuesto = 'IVA' ORDER BY version DESC LIMIT 1 FOR UPDATE`);
      const latest = rows[0];
      if (!latest)
        throw new ServiceUnavailableException(
          'Falta la configuración inicial de IVA',
        );
      const effective = new Date(dto.vigente_desde);
      if (effective.getTime() < new Date(latest.now_utc).getTime())
        throw new BadRequestException(
          'La vigencia nueva no puede ser retroactiva',
        );
      if (effective.getTime() <= new Date(latest.vigente_desde).getTime())
        throw new ConflictException(
          'La vigencia debe ser posterior a la última versión publicada',
        );
      const version = Number(latest.version) + 1;
      const result = await manager.query(
        `INSERT INTO tasas_fiscales
        (impuesto, version, tasa, vigente_desde, creado_por, motivo, creado_at)
        VALUES ('IVA', ?, ?, ?, ?, ?, UTC_TIMESTAMP(6))`,
        [
          version,
          dto.tasa,
          effective.toISOString().slice(0, 23).replace('T', ' '),
          userId,
          dto.motivo.trim(),
        ],
      );
      const repository = manager.getRepository(Auditoria);
      await repository.save(
        repository.create({
          usuario_id: userId,
          entidad: 'tasas_fiscales',
          entidad_id: result.insertId,
          accion: AccionAuditoria.CREAR,
          detalle: {
            version,
            tasa: dto.tasa,
            vigente_desde: effective.toISOString(),
            motivo: dto.motivo.trim(),
          },
        }),
      );
      return {
        id: Number(result.insertId),
        version,
        tasa: Number(dto.tasa).toFixed(6),
        vigente_desde: effective.toISOString(),
      };
    });
  }
}

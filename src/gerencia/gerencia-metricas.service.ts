import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import type { PermissionContext } from '../rbac/rbac-authorization.service.js';
import {
  INDICADORES,
  PENDIENTES,
  DETALLES,
  type Indicador,
  type Pendiente,
  type MetricasQueryDto,
  type DetalleMetricasQueryDto,
} from './dto/metricas-query.dto.js';
import {
  metricScopeIds,
  metricWindow,
  sumMoney,
  verifyMetricTimezone,
} from './metricas-policy.js';

// These projections also define exactly which date and scope each counter uses.
const SOURCES: Record<
  Indicador,
  {
    from: string;
    scope: string;
    fecha: string;
    civil?: boolean;
    money?: string;
    extra?: string;
    select: string;
    id: string;
  }
> = {
  cotizaciones_creadas: {
    from: 'cotizaciones c',
    scope: 'c.scope_id',
    fecha: 'c.fecha',
    money: 'c.total',
    select: 'c.id,c.consecutivo,c.estado,c.total AS importe',
    id: 'c.id',
  },
  cotizaciones_emitidas: {
    from: 'cotizaciones c',
    scope: 'c.scope_id',
    fecha: 'c.fecha_emision',
    money: 'c.total',
    select: 'c.id,c.consecutivo,c.estado,c.total AS importe',
    id: 'c.id',
  },
  ordenes_creadas: {
    from: 'ordenes_servicio o',
    scope: 'o.scope_id',
    fecha: 'o.created_at',
    select: 'o.id,o.consecutivo,o.estado',
    id: 'o.id',
  },
  ciclos_realizados: {
    from: 'ciclos_esterilizacion c',
    scope: 'c.scope_id',
    fecha: 'c.fecha_esterilizacion',
    civil: true,
    select: 'c.id,c.orden_id,c.equipo,c.metodo,c.estado',
    id: 'c.id',
  },
  ciclos_aprobados: {
    from: 'ciclos_esterilizacion c',
    scope: 'c.scope_id',
    fecha: 'c.revisado_en',
    extra: "c.estado='APROBADO'",
    select: 'c.id,c.orden_id,c.equipo,c.metodo,c.estado',
    id: 'c.id',
  },
  ciclos_rechazados: {
    from: 'ciclos_esterilizacion c',
    scope: 'c.scope_id',
    fecha: 'c.revisado_en',
    extra: "c.estado='RECHAZADO'",
    select: 'c.id,c.orden_id,c.equipo,c.metodo,c.estado',
    id: 'c.id',
  },
  certificados_emitidos: {
    from: 'certificados_esterilizacion ce JOIN ciclos_esterilizacion c ON c.id=ce.ciclo_id',
    scope: 'c.scope_id',
    fecha: 'ce.aprobado_at',
    select: 'ce.id,ce.consecutivo,ce.ciclo_id,ce.estado',
    id: 'ce.id',
  },
  entregas: {
    from: 'ordenes_servicio_eventos e JOIN ordenes_servicio o ON o.id=e.orden_id',
    scope: 'o.scope_id',
    fecha: 'e.ocurrido_at',
    extra: "e.tipo='ENTREGA_CLIENTE'",
    select: 'e.id,e.orden_id,o.consecutivo',
    id: 'e.id',
  },
};
const PENDING_SOURCES: Record<Pendiente, (typeof SOURCES)[Indicador]> = {
  cotizaciones_borrador: {
    ...SOURCES.cotizaciones_creadas,
    extra: "UPPER(c.estado)='BORRADOR'",
  },
  cotizaciones_por_emitir: {
    ...SOURCES.cotizaciones_creadas,
    extra: "c.estado='APROBADA' AND c.fecha_emision IS NULL",
  },
  ordenes_abiertas: {
    ...SOURCES.ordenes_creadas,
    extra: "o.estado NOT IN ('ENTREGADO','CANCELADO')",
  },
  calidad_por_revisar: {
    ...SOURCES.ciclos_realizados,
    extra: "c.estado='PENDIENTE_CALIDAD'",
  },
};
type Aggregate = {
  dia: string | null;
  indicador: Indicador | Pendiente;
  estado?: string;
  cantidad: string | number;
  importe: string | null;
};
type Value = { cantidad: number; importe: string };
const empty = () =>
  Object.fromEntries(
    INDICADORES.map((key) => [key, { cantidad: 0, importe: '0.00' }]),
  ) as Record<Indicador, Value>;
const instant = (day: string) => new Date(`${day}T00:00:00-05:00`);

@Injectable()
export class GerenciaMetricasService {
  constructor(@InjectDataSource() private readonly db: DataSource) {}

  async resumen(query: MetricasQueryDto, access: PermissionContext) {
    const scopes = metricScopeIds(access, query.scope_id);
    const window = metricWindow(query);
    // Bind actual instants through the same driver as domain writes. This avoids
    // depending on SQL timezone tables or assuming the SQL session is in UTC.
    const days = window.dias.map((dia) => ({
      dia,
      inicio: instant(dia),
      fin: new Date(instant(dia).getTime() + 86400000),
    }));
    const calendar = days
      .map(
        () =>
          'SELECT CAST(? AS CHAR(10)) AS dia, CAST(? AS DATETIME) AS inicio, CAST(? AS DATETIME) AS fin',
      )
      .join(' UNION ALL ');
    const placeholders = scopes.map(() => '?').join(',');
    const branches = INDICADORES.map((indicador) => {
      const s = SOURCES[indicador];
      const on = s.civil
        ? `${s.fecha}=d.dia`
        : `${s.fecha}>=d.inicio AND ${s.fecha}<d.fin`;
      const state =
        indicador === 'certificados_emitidos'
          ? 'ce.estado'
          : indicador === 'entregas'
            ? 'e.tipo'
            : `${s.id.split('.')[0]}.estado`;
      return `SELECT d.dia,'${indicador}' AS indicador,${state} AS estado,COUNT(*) AS cantidad,${s.money ? `CAST(SUM(${s.money}) AS CHAR)` : "'0.00'"} AS importe FROM ${s.from} JOIN dias d ON ${on} WHERE ${s.scope} IN (${placeholders}) ${s.extra ? `AND ${s.extra}` : ''} GROUP BY d.dia,${state}`;
    });
    for (const key of PENDIENTES) {
      const s = PENDING_SOURCES[key];
      branches.push(
        `SELECT NULL AS dia,'${key}' AS indicador,NULL AS estado,COUNT(*) AS cantidad,'0.00' AS importe FROM ${s.from} WHERE ${s.scope} IN (${placeholders}) AND ${s.extra}`,
      );
    }
    const rows = await this.db.transaction(
      'REPEATABLE READ',
      async (manager) => {
        await verifyMetricTimezone(manager, [
          ...days.map((d) => d.inicio),
          days.at(-1)!.fin,
        ]);
        return manager.query<Aggregate[]>(
          `WITH dias AS (${calendar}) ${branches.join(' UNION ALL ')}`,
          [
            ...days.flatMap((d) => [d.dia, d.inicio, d.fin]),
            ...DETALLES.flatMap(() => scopes),
          ],
        );
      },
    );
    const serie = window.dias.map((fecha) => ({ fecha, ...empty() }));
    const pendientes_actuales = Object.fromEntries(
      PENDIENTES.map((key) => [key, 0]),
    ) as Record<Pendiente, number>;
    const por_estado = Object.fromEntries(
      INDICADORES.map((key) => [key, Object.create(null)]),
    ) as Record<Indicador, Record<string, number>>;
    for (const row of rows) {
      if (PENDIENTES.includes(row.indicador as Pendiente)) {
        pendientes_actuales[row.indicador as Pendiente] = Number(row.cantidad);
        continue;
      }
      const key = row.indicador as Indicador;
      const day = serie.find((d) => d.fecha === row.dia);
      if (day && INDICADORES.includes(key)) {
        day[key] = {
          cantidad: day[key].cantidad + Number(row.cantidad),
          importe: sumMoney([day[key].importe, String(row.importe ?? '0.00')]),
        };
        if (row.estado)
          por_estado[key][row.estado] =
            (por_estado[key][row.estado] ?? 0) + Number(row.cantidad);
      }
    }
    const totales = empty();
    for (const key of INDICADORES)
      totales[key] = {
        cantidad: serie.reduce((count, day) => count + day[key].cantidad, 0),
        importe: sumMoney(serie.map((day) => day[key].importe)),
      };
    return {
      periodo: { desde: window.desde, hasta: window.hasta },
      zona_horaria: 'America/Bogota',
      scope_ids: scopes,
      generado_at: new Date().toISOString(),
      totales,
      serie,
      por_estado,
      pendientes_actuales,
      criterios: {
        ambitos:
          'Solo registros con ámbito autorizado; los históricos sin ámbito quedan excluidos.',
        importes:
          'Valores de cotizaciones; no son facturación ni recaudo. Se conservan las emitidas posteriormente anuladas.',
        ciclos_realizados:
          'Fecha de esterilización; los históricos sin fecha no se atribuyen a un día.',
        decisiones_calidad: 'Fecha de revisión y estado actual.',
        pendientes:
          'Pendientes actuales, independientes del periodo de actividad solicitado.',
      },
    };
  }

  async detalle(query: DetalleMetricasQueryDto, access: PermissionContext) {
    const scopes = metricScopeIds(access, query.scope_id);
    const window = metricWindow(query);
    if (!DETALLES.includes(query.indicador))
      throw new BadRequestException('Indicador inválido');
    const pending = PENDIENTES.includes(query.indicador as Pendiente);
    if (pending && (query.desde !== undefined || query.hasta !== undefined))
      throw new BadRequestException(
        'Los pendientes actuales no admiten filtro de periodo',
      );
    const page = query.page ?? 1,
      limit = query.limit ?? 25;
    if (
      !Number.isSafeInteger(page) ||
      page < 1 ||
      !Number.isSafeInteger(limit) ||
      limit < 1 ||
      limit > 100 ||
      !Number.isSafeInteger((page - 1) * limit)
    )
      throw new BadRequestException('Paginación inválida');
    const s = pending
      ? PENDING_SOURCES[query.indicador as Pendiente]
      : SOURCES[query.indicador as Indicador];
    const params = [
      ...scopes,
      ...(pending
        ? []
        : [
            s.civil ? window.desde : instant(window.desde),
            s.civil ? window.fin : instant(window.fin),
          ]),
    ];
    const where = `${s.scope} IN (${scopes.map(() => '?').join(',')}) ${pending ? '' : `AND ${s.fecha}>=? AND ${s.fecha}<?`} ${s.extra ? `AND ${s.extra}` : ''}`;
    return this.db.transaction('REPEATABLE READ', async (manager) => {
      if (!pending)
        await verifyMetricTimezone(manager, [
          ...window.dias.map(instant),
          instant(window.fin),
        ]);
      const [count] = await manager.query(
        `SELECT COUNT(*) AS total FROM ${s.from} WHERE ${where}`,
        params,
      );
      const data = await manager.query(
        `SELECT ${s.select},${s.scope} AS scope_id,${s.fecha} AS fecha FROM ${s.from} WHERE ${where} ORDER BY ${s.fecha} DESC,${s.id} DESC LIMIT ? OFFSET ?`,
        [...params, limit, (page - 1) * limit],
      );
      return { data, total: Number(count.total), page, limit };
    });
  }
}

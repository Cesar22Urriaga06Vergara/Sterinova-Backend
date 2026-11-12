import type { PermissionContext } from '../rbac/rbac-authorization.service.js';
import { resourceWhere, creationScope } from '../rbac/resource-access.js';
import { Cotizacion } from '../cotizaciones/entities/cotizacion.entity.js';
import { ProtocoloEsterilizacionVersion } from './entities/protocolo-esterilizacion-version.entity.js';
import { OrdenServicioMaterial } from '../ordenes-servicio/entities/orden-servicio-material.entity.js';
import { fechaVencimiento } from '../certificados/fecha-vencimiento.js';
import { metodoOrden } from '../logistica/materiales-orden.js';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EstadoOrdenServicio } from '../ordenes-servicio/entities/estado-orden.enum.js';
import { OrdenServicio } from '../ordenes-servicio/entities/orden-servicio.entity.js';
import { User } from '../users/entities/user.entity.js';
import {
  CicloEsterilizacion,
  EstadoCicloEsterilizacion,
} from './entities/ciclo-esterilizacion.entity.js';
import { CreateCicloDto } from './dto/create-ciclo.dto.js';

@Injectable()
export class PlantaService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  findOrdenesEnPlanta(access?: PermissionContext): Promise<OrdenServicio[]> {
    return this.dataSource.getRepository(OrdenServicio).find({
      where: access ? resourceWhere<OrdenServicio>(access, {estado: EstadoOrdenServicio.EN_PLANTA}) : { estado: EstadoOrdenServicio.EN_PLANTA },
      relations: ['cotizacion', 'cotizacion.cliente', 'materiales'],
      order: { id: 'DESC' },
    });
  }

  findCiclos(access?: PermissionContext): Promise<CicloEsterilizacion[]> {
    return this.dataSource.getRepository(CicloEsterilizacion).find({
      ...(access ? {where: resourceWhere<CicloEsterilizacion>(access, {}, 'operador_id')} : {}),
      relations: [
        'orden',
        'orden.cotizacion',
        'orden.cotizacion.cliente',
        'operador',
        'orden.materiales',
        'protocolo_version',
      ],
      order: { id: 'DESC' },
    });
  }

  findProtocolos() {
    return this.dataSource
      .getRepository(ProtocoloEsterilizacionVersion)
      .createQueryBuilder('p')
      .where(
        'p.version = (SELECT MAX(v.version) FROM protocolos_esterilizacion_versiones v WHERE v.metodo=p.metodo)',
      )
      .orderBy('p.metodo', 'ASC')
      .getMany();
  }

  createCiclo(
    dto: CreateCicloDto,
    operadorId: number, access?: PermissionContext): Promise<CicloEsterilizacion> {
    return this.dataSource.transaction(async (manager) => {
      const ordenesRepository = manager.getRepository(OrdenServicio);
      const usersRepository = manager.getRepository(User);
      const ciclosRepository = manager.getRepository(CicloEsterilizacion);
      const orden = await ordenesRepository.findOne({
        where: access ? resourceWhere<OrdenServicio>(access, {id: dto.orden_id}) : { id: dto.orden_id },
        lock: { mode: 'pessimistic_write' },
      });

      if (!orden) {
        throw new NotFoundException(`Orden #${dto.orden_id} no encontrada`);
      }
      if (orden.estado !== EstadoOrdenServicio.EN_PLANTA) {
        throw new BadRequestException(
          'Solo se pueden registrar ciclos para órdenes EN_PLANTA',
        );
      }

      const operador = await usersRepository.findOne({
        where: { id: operadorId },
      });
      if (!operador) {
        throw new NotFoundException('El operador autenticado ya no existe');
      }

      fechaVencimiento(dto.fecha_esterilizacion);
      const hoy = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Bogota',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date());
      if (dto.fecha_esterilizacion > hoy)
        throw new BadRequestException(
          'La esterilizacion no puede estar en el futuro',
        );
      const quote = await manager
        .getRepository(Cotizacion)
        .findOneByOrFail({ id: orden.cotizacion_id });
      const metodo =
        orden.metodo_esterilizacion ?? metodoOrden(quote.tipo_servicio);
      if (!metodo || metodo !== dto.metodo)
        throw new BadRequestException('El metodo no coincide con la orden');
      const materiales = await manager
        .getRepository(OrdenServicioMaterial)
        .find({ where: { orden_id: orden.id }, order: { posicion: 'ASC' } });
      if (!materiales.length)
        throw new BadRequestException(
          'Complete los materiales recibidos antes de registrar el ciclo',
        );
      const protocolo = await manager
        .getRepository(ProtocoloEsterilizacionVersion)
        .findOne({
          where: dto.protocolo_version_id
            ? { id: dto.protocolo_version_id, metodo: dto.metodo }
            : { metodo: dto.metodo },
          order: { version: 'DESC' },
        });
      if (!protocolo)
        throw new BadRequestException('No hay protocolo compatible');
      const filas = protocolo.especificaciones_json.filas as {
        parametro: string;
        aplicable: boolean;
      }[];
      for (const fila of filas) {
        const value = (dto as unknown as Record<string, unknown>)[
          fila.parametro
        ];
        if (
          fila.aplicable &&
          (value == null || !Number.isFinite(Number(value)))
        )
          throw new BadRequestException(
            `Parametro requerido: ${fila.parametro}`,
          );
      }
      if (dto.metodo === 'VAPOR' && dto.presion != null && dto.presion < 0)
        throw new BadRequestException(
          'La presion negativa solo corresponde a EtO',
        );
      const ciclo = ciclosRepository.create({
        ...dto,
        scope_id: access ? creationScope(access) : orden.scope_id,
        protocolo_version_id: protocolo.id,
        tiempo_secado:
          dto.tiempo_secado == null ? null : String(dto.tiempo_secado),
        humedad: dto.humedad ?? null,
        presion: dto.presion ?? null,
        tiempo_aireacion: dto.tiempo_aireacion ?? null,
        orden_id: orden.id,
        orden,
        operador_id: operador.id,
        operador,
        estado: EstadoCicloEsterilizacion.PENDIENTE_CALIDAD,
      });
      const saved = await ciclosRepository.save(ciclo);

      orden.estado = EstadoOrdenServicio.PROCESADO;
      await ordenesRepository.save(orden);

      const result = await ciclosRepository.findOne({
        where: { id: saved.id },
        relations: [
          'orden',
          'orden.cotizacion',
          'orden.cotizacion.cliente',
          'operador',
          'orden.materiales',
          'protocolo_version',
        ],
      });
      if (!result) {
        throw new NotFoundException(`Ciclo #${saved.id} no encontrado`);
      }
      return result;
    });
  }
}

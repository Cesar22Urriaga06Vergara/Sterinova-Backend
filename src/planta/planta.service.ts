import type { PermissionContext } from '../rbac/rbac-authorization.service.js';
import { resourceWhere, creationScope } from '../rbac/resource-access.js';
import { Cotizacion } from '../cotizaciones/entities/cotizacion.entity.js';
import { ProtocoloEsterilizacionVersion } from './entities/protocolo-esterilizacion-version.entity.js';
import { OrdenServicioMaterial } from '../ordenes-servicio/entities/orden-servicio-material.entity.js';
import { OrdenServicioEvento } from '../ordenes-servicio/entities/orden-servicio-evento.entity.js';
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
import { CicloMaterialProcesado } from './entities/ciclo-material-procesado.entity.js';
import { CreateCicloDto } from './dto/create-ciclo.dto.js';
import {
  CICLO_OPERATIVO,
  COTIZACION_CON_CLIENTE,
  MATERIAL_OPERATIVO,
  ORDEN_CON_COTIZACION,
  ORDEN_OPERATIVA,
  PROTOCOLO_OPERATIVO,
  USUARIO_OPERATIVO,
} from '../common/proyeccion-operativa.js';

@Injectable()
export class PlantaService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  findOrdenesEnPlanta(access?: PermissionContext): Promise<OrdenServicio[]> {
    return this.dataSource.getRepository(OrdenServicio).find({
      where: access ? resourceWhere<OrdenServicio>(access, {estado: EstadoOrdenServicio.EN_PLANTA}) : { estado: EstadoOrdenServicio.EN_PLANTA },
      relations: {
        cotizacion: { cliente: true },
        materiales: true,
      },
      select: {
        ...ORDEN_OPERATIVA,
        cotizacion: COTIZACION_CON_CLIENTE,
        materiales: MATERIAL_OPERATIVO,
      },
      // Quote items are eager and carry unit prices.
      loadEagerRelations: false,
      order: { id: 'DESC' },
    });
  }

  findCiclos(access?: PermissionContext): Promise<CicloEsterilizacion[]> {
    return this.dataSource.getRepository(CicloEsterilizacion).find({
      ...(access ? {where: resourceWhere<CicloEsterilizacion>(access, {}, 'operador_id')} : {}),
      relations: {
        orden: { cotizacion: { cliente: true }, materiales: true },
        operador: true,
        protocolo_version: true,
      },
      select: {
        ...CICLO_OPERATIVO,
        orden: ORDEN_CON_COTIZACION,
        operador: USUARIO_OPERATIVO,
        protocolo_version: PROTOCOLO_OPERATIVO,
      },
      loadEagerRelations: false,
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
      const cantidadesProcesadas = dto.materiales_procesados;
      if (!Array.isArray(cantidadesProcesadas) || !cantidadesProcesadas.length) {
        throw new BadRequestException(
          'Registre la cantidad procesada para cada material de la orden',
        );
      }
      const submittedMaterialIds = cantidadesProcesadas.map(
        ({ material_id }) => material_id,
      );
      const materialesPorId = new Map(
        materiales.map((material) => [material.id, material]),
      );
      if (
        submittedMaterialIds.length !== materialesPorId.size ||
        new Set(submittedMaterialIds).size !== submittedMaterialIds.length ||
        submittedMaterialIds.some(
          (materialId) => !materialesPorId.has(materialId),
        )
      ) {
        throw new BadRequestException(
          'Registre la cantidad procesada para cada material de la orden, sin repetir materiales',
        );
      }
      if (
        cantidadesProcesadas.some(
          ({ cantidad }) =>
            !Number.isFinite(cantidad) ||
            cantidad < 0 ||
            cantidad > 4294967295,
        )
      ) {
        throw new BadRequestException(
          'La cantidad procesada debe ser un entero no negativo válido',
        );
      }
      if (
        cantidadesProcesadas.some(
          ({ material_id, cantidad }) =>
            cantidad > (materialesPorId.get(material_id)?.cantidad ?? 0),
        )
      ) {
        throw new BadRequestException(
          'La cantidad procesada no puede superar la cantidad recibida',
        );
      }
      if (cantidadesProcesadas.every(({ cantidad }) => cantidad === 0)) {
        throw new BadRequestException(
          'El ciclo debe procesar al menos una unidad de material',
        );
      }
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
      // Rastreo del acumulado por material de orden: una orden puede
      // distribuirse en varios ciclos mientras quede cantidad pendiente.
      const ciclosPrevios = await manager
        .getRepository(CicloEsterilizacion)
        .find({ where: { orden_id: orden.id }, select: ['id'] });
      const idsCiclosPrevios = ciclosPrevios.map((c) => c.id);
      const acumuladoPorMaterial = new Map<number, number>();
      if (idsCiclosPrevios.length) {
        const filasAcumulado = await manager.query(
          `SELECT orden_servicio_material_id AS material_id,
                  SUM(cantidad_procesada) AS cantidad_procesada
             FROM ciclos_materiales_procesados
            WHERE ciclo_id IN (?)
            GROUP BY orden_servicio_material_id`,
          [idsCiclosPrevios],
        );
        for (const fila of filasAcumulado as Array<{
          material_id: number;
          cantidad_procesada: string;
        }>) {
          acumuladoPorMaterial.set(
            fila.material_id,
            Number(fila.cantidad_procesada),
          );
        }
      }
      for (const { material_id, cantidad } of cantidadesProcesadas) {
        const recibido = materialesPorId.get(material_id)?.cantidad ?? 0;
        const pendiente =
          recibido - (acumuladoPorMaterial.get(material_id) ?? 0);
        if (cantidad > pendiente) {
          throw new BadRequestException(
            `No queda cantidad pendiente para el material #${material_id} (recibido ${recibido}, pendiente ${pendiente})`,
          );
        }
      }
      const { materiales_procesados: _, ...cicloDto } = dto;
      const ciclo = ciclosRepository.create({
        ...cicloDto,
        scope_id: access ? creationScope(access, orden.scope_id) : orden.scope_id,
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

      // Registra el acumulado procesado por material de orden para el ciclo.
      await manager
        .getRepository(CicloMaterialProcesado)
        .insert(
          cantidadesProcesadas.map(({ material_id, cantidad }) => ({
            ciclo_id: saved.id,
            orden_servicio_material_id: material_id,
            cantidad_procesada: cantidad,
          })),
        );
      // La orden se cierra solo cuando todos sus materiales están completos.
      const completo = materiales.every((material) => {
        const previo = acumuladoPorMaterial.get(material.id) ?? 0;
        const nuevo = cantidadesProcesadas.find(
          (m) => m.material_id === material.id,
        )?.cantidad ?? 0;
        return previo + nuevo >= material.cantidad;
      });
      orden.estado = completo
        ? EstadoOrdenServicio.PROCESADO
        : EstadoOrdenServicio.EN_PLANTA;
      await ordenesRepository.save(orden);
      const eventosRepository = manager.getRepository(OrdenServicioEvento);
      await eventosRepository.save(
        eventosRepository.create({
          orden_id: orden.id,
          tipo: 'PROCESAMIENTO',
          ocurrido_at: new Date(),
          usuario_id: operador.id,
          datos_json: {
            responsable: [operador.nombre, operador.apellido]
              .filter(Boolean)
              .join(' '),
            ciclo_id: saved.id,
            fecha_esterilizacion: dto.fecha_esterilizacion,
            materiales: cantidadesProcesadas.map((material) => ({
              material_id: material.material_id,
              cantidad: material.cantidad,
            })),
          },
        }),
      );

      const result = await ciclosRepository.findOne({
        where: { id: saved.id },
        relations: {
          orden: { cotizacion: { cliente: true }, materiales: true },
          operador: true,
          protocolo_version: true,
        },
        select: {
          ...CICLO_OPERATIVO,
          orden: ORDEN_CON_COTIZACION,
          operador: USUARIO_OPERATIVO,
          protocolo_version: PROTOCOLO_OPERATIVO,
        },
        loadEagerRelations: false,
      });
      if (!result) {
        throw new NotFoundException(`Ciclo #${saved.id} no encontrado`);
      }
      return result;
    });
  }
}

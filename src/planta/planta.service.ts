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

  findOrdenesEnPlanta(): Promise<OrdenServicio[]> {
    return this.dataSource.getRepository(OrdenServicio).find({
      where: { estado: EstadoOrdenServicio.EN_PLANTA },
      relations: ['cotizacion', 'cotizacion.cliente'],
      order: { id: 'DESC' },
    });
  }

  findCiclos(): Promise<CicloEsterilizacion[]> {
    return this.dataSource.getRepository(CicloEsterilizacion).find({
      relations: ['orden', 'orden.cotizacion', 'orden.cotizacion.cliente', 'operador'],
      order: { id: 'DESC' },
    });
  }

  createCiclo(
    dto: CreateCicloDto,
    operadorId: number,
  ): Promise<CicloEsterilizacion> {
    return this.dataSource.transaction(async (manager) => {
      const ordenesRepository = manager.getRepository(OrdenServicio);
      const usersRepository = manager.getRepository(User);
      const ciclosRepository = manager.getRepository(CicloEsterilizacion);
      const orden = await ordenesRepository.findOne({
        where: { id: dto.orden_id },
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

      const ciclo = ciclosRepository.create({
        ...dto,
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
        relations: ['orden', 'orden.cotizacion', 'orden.cotizacion.cliente', 'operador'],
      });
      if (!result) {
        throw new NotFoundException(`Ciclo #${saved.id} no encontrado`);
      }
      return result;
    });
  }
}

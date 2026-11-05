import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, EntityManager } from 'typeorm';
import { FormatoAsignacionesCliente } from './entities/formato-asignaciones-cliente.entity.js';
import {
  EstadoVersionFormato,
  FormatoVersiones,
} from './entities/formato-versiones.entity.js';
import { FormatosDocumentales } from './entities/formatos-documentales.entity.js';
import { TipoServicioCotizacion } from '../cotizaciones/entities/tipo-servicio.enum.js';

export const CERTIFICATE_FORMAT_KEY = 'CERTIFICADO_ESTERILIZACION';

@Injectable()
export class FormatoResolverService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async resolve(
    formatKey: string,
    clientId?: number | null,
    manager?: EntityManager,
  ): Promise<FormatoVersiones> {
    const entityManager = manager ?? this.dataSource.manager;
    const formatsRepository = entityManager.getRepository(FormatosDocumentales);
    const versionsRepository = entityManager.getRepository(FormatoVersiones);
    const assignmentsRepository = entityManager.getRepository(
      FormatoAsignacionesCliente,
    );

    const format = await formatsRepository.findOne({
      where: { clave: formatKey },
    });
    if (!format) {
      throw new NotFoundException(`No existe el formato documental ${formatKey}`);
    }

    if (clientId !== undefined && clientId !== null) {
      const assignment = await assignmentsRepository.findOne({
        where: { cliente_id: clientId, formato_id: format.id, activa: true },
      });
      if (assignment) {
        const assignedVersion = await versionsRepository.findOne({
          where: {
            id: assignment.version_formato_id,
            formato_id: format.id,
            estado: EstadoVersionFormato.PUBLICADA,
          },
        });
        if (!assignedVersion) {
          throw new ConflictException(
            `La versión asignada al cliente para ${formatKey} no está publicada`,
          );
        }
        return assignedVersion;
      }
    }

    const currentVersion = await versionsRepository.findOne({
      where: {
        formato_id: format.id,
        estado: EstadoVersionFormato.PUBLICADA,
        es_vigente: true,
      },
    });
    if (!currentVersion) {
      throw new ConflictException(
        `El formato ${formatKey} no tiene una versión global publicada y vigente`,
      );
    }
    return currentVersion;
  }

  resolveCotizacion(
    tipoServicio: TipoServicioCotizacion,
    clientId: number,
    manager: EntityManager,
  ): Promise<FormatoVersiones> {
    return this.resolve(`COTIZACION_${tipoServicio}`, clientId, manager);
  }

  resolveCertificado(
    clientId: number | null,
    manager: EntityManager,
  ): Promise<FormatoVersiones> {
    return this.resolve(CERTIFICATE_FORMAT_KEY, clientId, manager);
  }
}

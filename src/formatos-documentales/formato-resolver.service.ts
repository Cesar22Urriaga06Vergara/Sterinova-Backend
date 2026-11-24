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
import {
  FormatosDocumentales,
  TipoDocumentoFormato,
} from './entities/formatos-documentales.entity.js';
import { TipoServicioCotizacion } from '../common/tipo-servicio-cotizacion.js';
import {
  canonicalFormatFor,
  LEGACY_SERVICES_BY_CANONICAL,
} from '../common/canonical-quote-format.js';

export const CERTIFICATE_FORMAT_KEY = 'CERTIFICADO_ESTERILIZACION';
export const ORDER_FORMAT_KEY = 'ORDEN_SERVICIO';
export const ACTA_FORMAT_KEY = 'ACTA_SERVICIO';

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
      throw new NotFoundException(
        `No existe el formato documental ${formatKey}`,
      );
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
    return this.resolveCotizacionWithClientFallback(
      tipoServicio,
      clientId,
      manager,
    );
  }

  private async resolveCotizacionWithClientFallback(
    tipoServicio: TipoServicioCotizacion,
    clientId: number,
    manager: EntityManager,
  ): Promise<FormatoVersiones> {
    const formats = manager.getRepository(FormatosDocumentales);
    const canonical = canonicalFormatFor(tipoServicio);
    const serviceAliases = [
      ...new Set([
        tipoServicio,
        ...LEGACY_SERVICES_BY_CANONICAL[canonical],
        canonical,
      ]),
    ];
    for (const service of serviceAliases) {
      const clientFormat = await formats.findOne({
        where: {
          tipo_documento: TipoDocumentoFormato.COTIZACION,
          tipo_servicio: service,
          cliente_id: clientId,
        },
      });
      if (clientFormat) {
        return this.resolve(clientFormat.clave, clientId, manager);
      }
    }
    const legacyKeys = [
      `COTIZACION_${tipoServicio}`,
      ...(tipoServicio === TipoServicioCotizacion.FABRICANTE ||
      tipoServicio === TipoServicioCotizacion.FARMACEUTICO
        ? ['COTIZACION_FARMACEUTICO_FABRICANTE']
        : []),
    ];
    const keys = [...new Set([`COTIZACION_${canonical}`, ...legacyKeys])];
    for (const key of keys) {
      try {
        return await this.resolve(key, clientId, manager);
      } catch (error) {
        if (!(error instanceof NotFoundException)) throw error;
      }
    }
    throw new NotFoundException(
      `No existe un formato documental de cotización para ${canonical}`,
    );
  }

  resolveCertificado(
    clientId: number | null,
    manager: EntityManager,
  ): Promise<FormatoVersiones> {
    return this.resolve(CERTIFICATE_FORMAT_KEY, clientId, manager);
  }

  resolveOrdenServicio(manager?: EntityManager): Promise<FormatoVersiones> {
    return this.resolve(ORDER_FORMAT_KEY, null, manager);
  }

  resolveActaServicio(manager?: EntityManager): Promise<FormatoVersiones> {
    return this.resolve(ACTA_FORMAT_KEY, null, manager);
  }

  async resolvePinnedVersion(
    versionId: number,
    manager?: EntityManager,
  ): Promise<FormatoVersiones> {
    const version = await (manager ?? this.dataSource.manager)
      .getRepository(FormatoVersiones)
      .findOne({ where: { id: versionId } });
    if (!version) {
      throw new NotFoundException(
        `No existe la versión documental vinculada #${versionId}`,
      );
    }
    return version;
  }
}

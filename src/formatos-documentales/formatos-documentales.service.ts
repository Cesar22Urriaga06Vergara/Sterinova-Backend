import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { In, type DataSource, type Repository } from 'typeorm';
import { AuditoriaService } from '../auditoria/auditoria.service.js';
import { AccionAuditoria } from '../auditoria/entities/auditoria.entity.js';
import { CertificadoEsterilizacion } from '../certificados/entities/certificado-esterilizacion.entity.js';
import { Cotizacion } from '../cotizaciones/entities/cotizacion.entity.js';
import {
  EstadoVersionFormato,
  FormatoVersiones,
} from './entities/formato-versiones.entity.js';
import {
  FormatosDocumentales,
  TipoDocumentoFormato,
} from './entities/formatos-documentales.entity.js';
import { FormatoAsignacionesCliente } from './entities/formato-asignaciones-cliente.entity.js';
import {
  canObsoleteFormatVersion,
  canTransitionFormatVersion,
} from './format-version-workflow.js';
import { CreateFormatoDocumentalDto } from './dto/create-formato-documental.dto.js';
import { CreateFormatoVersionDto } from './dto/create-formato-version.dto.js';
import { UpdateFormatoDocumentalDto } from './dto/update-formato-documental.dto.js';
import { UpdateFormatoVersionDto } from './dto/update-formato-version.dto.js';
import { UpdateFormatoVersionStateDto } from './dto/update-formato-version-state.dto.js';

type VersionEditorFields = {
  codigo?: string;
  nombre?: string;
  fecha_version?: string;
  responsable?: string;
  introduccion?: string;
  condiciones_comerciales?: string;
  firmas?: CreateFormatoDocumentalDto['firmas'];
};

function splitLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function createConfiguration(
  format: FormatosDocumentales,
  version: number,
  date: string,
  fields: VersionEditorFields,
  current: Record<string, unknown> = {},
): Record<string, unknown> {
  const paragraphs =
    fields.introduccion === undefined
      ? current.paragraphs
      : splitLines(fields.introduccion);
  const commercialTerms =
    fields.condiciones_comerciales === undefined
      ? current.commercial_terms
      : splitLines(fields.condiciones_comerciales);
  const signatures =
    fields.firmas === undefined ? current.signatures : fields.firmas;

  return {
    ...current,
    document_code: fields.codigo ?? format.codigo,
    title: fields.nombre ?? format.nombre,
    version_label: String(version).padStart(2, '0'),
    version_date: fields.fecha_version ?? date,
    ...(paragraphs === undefined ? {} : { paragraphs }),
    ...(commercialTerms === undefined
      ? {}
      : { commercial_terms: commercialTerms }),
    ...(signatures === undefined ? {} : { signatures }),
  };
}

@Injectable()
export class FormatosDocumentalesService {
  constructor(
    @InjectRepository(FormatosDocumentales)
    private readonly formatosRepository: Repository<FormatosDocumentales>,
    @InjectRepository(FormatoVersiones)
    private readonly versionesRepository: Repository<FormatoVersiones>,
    @InjectRepository(FormatoAsignacionesCliente)
    private readonly asignacionesRepository: Repository<FormatoAsignacionesCliente>,
    @InjectRepository(Cotizacion)
    private readonly cotizacionesRepository: Repository<Cotizacion>,
    @InjectRepository(CertificadoEsterilizacion)
    private readonly certificadosRepository: Repository<CertificadoEsterilizacion>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  findAll(): Promise<FormatosDocumentales[]> {
    return this.formatosRepository.find({
      relations: { versiones: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<FormatosDocumentales> {
    const format = await this.formatosRepository.findOne({
      where: { id },
      relations: { versiones: true },
    });
    if (!format) {
      throw new NotFoundException(`Formato documental #${id} no encontrado`);
    }
    return format;
  }

  async create(
    dto: CreateFormatoDocumentalDto,
    usuarioId: number,
  ): Promise<FormatosDocumentales> {
    if (
      dto.tipo_documento === TipoDocumentoFormato.COTIZACION &&
      !dto.tipo_servicio
    ) {
      throw new BadRequestException(
        'Las plantillas de cotización requieren un tipo de servicio',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const formats = manager.getRepository(FormatosDocumentales);
      const versions = manager.getRepository(FormatoVersiones);
      const format = await formats.save(
        formats.create({
          clave: dto.clave,
          tipo_documento: dto.tipo_documento,
          tipo_servicio: dto.tipo_servicio ?? null,
          codigo: dto.codigo,
          nombre: dto.nombre,
        }),
      );
      const configuration = createConfiguration(format, dto.version, dto.fecha_version, {
        codigo: dto.codigo,
        nombre: dto.nombre,
        fecha_version: dto.fecha_version,
        introduccion: dto.introduccion,
        condiciones_comerciales: dto.condiciones_comerciales,
        firmas: dto.firmas,
      });
      await versions.save(
        versions.create({
          formato_id: format.id,
          version: dto.version,
          estado: EstadoVersionFormato.BORRADOR,
          renderer_key: 'cotizacion_v1',
          configuracion_json: configuration,
          fecha_version: dto.fecha_version,
          responsable: dto.responsable,
          es_vigente: false,
        }),
      );
      await this.auditoriaService.create(
        {
          usuario_id: usuarioId,
          entidad: 'formatos_documentales',
          entidad_id: format.id,
          accion: AccionAuditoria.CREAR,
          detalle: { codigo: format.codigo, version: dto.version },
        },
        manager,
      );
      return formats.findOneOrFail({
        where: { id: format.id },
        relations: { versiones: true },
      });
    });
  }

  async update(
    id: number,
    dto: UpdateFormatoDocumentalDto,
    usuarioId: number,
  ): Promise<FormatosDocumentales> {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(FormatosDocumentales);
      const format = await repository.findOne({ where: { id } });
      if (!format) {
        throw new NotFoundException(`Formato documental #${id} no encontrado`);
      }
      Object.assign(format, dto);
      await repository.save(format);
      await this.auditoriaService.create(
        {
          usuario_id: usuarioId,
          entidad: 'formatos_documentales',
          entidad_id: id,
          accion: AccionAuditoria.EDITAR,
          detalle: { ...dto },
        },
        manager,
      );
      return repository.findOneOrFail({
        where: { id },
        relations: { versiones: true },
      });
    });
  }

  async remove(id: number, usuarioId: number): Promise<{ message: string }> {
    return this.dataSource.transaction(async (manager) => {
      const formats = manager.getRepository(FormatosDocumentales);
      const versions = manager.getRepository(FormatoVersiones);
      const format = await formats.findOne({ where: { id } });
      if (!format) {
        throw new NotFoundException(`Formato documental #${id} no encontrado`);
      }

      const versionRows = await versions.find({ where: { formato_id: id } });
      const versionIds = versionRows.map(({ id: versionId }) => versionId);
      const [assignments, quotes, certificates] = await Promise.all([
        manager.getRepository(FormatoAsignacionesCliente).countBy({ formato_id: id }),
        versionIds.length
          ? manager.getRepository(Cotizacion).countBy({
              version_formato_id: In(versionIds),
            })
          : 0,
        versionIds.length
          ? manager.getRepository(CertificadoEsterilizacion).countBy({
              version_formato_id: In(versionIds),
            })
          : 0,
      ]);
      if (assignments || quotes || certificates) {
        throw new ConflictException(
          'No se puede eliminar un formato usado por clientes o documentos emitidos',
        );
      }

      if (versionRows.length) await versions.remove(versionRows);
      await formats.remove(format);
      await this.auditoriaService.create(
        {
          usuario_id: usuarioId,
          entidad: 'formatos_documentales',
          entidad_id: id,
          accion: AccionAuditoria.ELIMINAR,
          detalle: { codigo: format.codigo },
        },
        manager,
      );
      return { message: `Formato ${format.codigo} eliminado` };
    });
  }

  async createVersion(
    id: number,
    dto: CreateFormatoVersionDto,
    usuarioId: number,
  ): Promise<FormatoVersiones> {
    return this.dataSource.transaction(async (manager) => {
      const formats = manager.getRepository(FormatosDocumentales);
      const versions = manager.getRepository(FormatoVersiones);
      const format = await formats.findOne({ where: { id } });
      if (!format) {
        throw new NotFoundException(`Formato documental #${id} no encontrado`);
      }
      const priorVersions = await versions.find({
        where: { formato_id: id },
        order: { version: 'DESC' },
        take: 1,
      });
      const latest = priorVersions[0];
      const version = (latest?.version ?? 0) + 1;
      const previousConfig = latest?.configuracion_json ?? {};
      const configuration = createConfiguration(format, version, dto.fecha_version, {
        codigo: format.codigo,
        nombre: format.nombre,
        fecha_version: dto.fecha_version,
      }, previousConfig);
      const saved = await versions.save(
        versions.create({
          formato_id: id,
          version,
          estado: EstadoVersionFormato.BORRADOR,
          renderer_key: latest?.renderer_key ?? 'cotizacion_v1',
          configuracion_json: configuration,
          fecha_version: dto.fecha_version,
          responsable: dto.responsable,
          es_vigente: false,
        }),
      );
      await this.auditoriaService.create(
        {
          usuario_id: usuarioId,
          entidad: 'formato_versiones',
          entidad_id: saved.id,
          accion: AccionAuditoria.CREAR,
          detalle: { formato_id: id, version },
        },
        manager,
      );
      return saved;
    });
  }

  async updateVersion(
    formatId: number,
    versionId: number,
    dto: UpdateFormatoVersionDto,
    usuarioId: number,
  ): Promise<FormatoVersiones> {
    return this.dataSource.transaction(async (manager) => {
      const formats = manager.getRepository(FormatosDocumentales);
      const versions = manager.getRepository(FormatoVersiones);
      const format = await formats.findOne({ where: { id: formatId } });
      if (!format) {
        throw new NotFoundException(`Formato documental #${formatId} no encontrado`);
      }
      const version = await versions.findOne({
        where: { id: versionId, formato_id: formatId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!version) {
        throw new NotFoundException(`Versión #${versionId} no encontrada`);
      }
      if (version.estado !== EstadoVersionFormato.BORRADOR) {
        throw new ConflictException(
          'Solo se pueden editar versiones en estado borrador',
        );
      }

      if (dto.codigo !== undefined) format.codigo = dto.codigo;
      if (dto.nombre !== undefined) format.nombre = dto.nombre;
      if (dto.codigo !== undefined || dto.nombre !== undefined) {
        await formats.save(format);
      }
      version.fecha_version = dto.fecha_version ?? version.fecha_version;
      version.responsable = dto.responsable ?? version.responsable;
      version.configuracion_json = createConfiguration(
        format,
        version.version,
        version.fecha_version ?? '',
        dto,
        version.configuracion_json,
      );
      await versions.save(version);
      await this.auditoriaService.create(
        {
          usuario_id: usuarioId,
          entidad: 'formato_versiones',
          entidad_id: version.id,
          accion: AccionAuditoria.EDITAR,
          detalle: { formato_id: formatId, cambios: dto },
        },
        manager,
      );
      return version;
    });
  }

  async updateVersionState(
    formatId: number,
    versionId: number,
    dto: UpdateFormatoVersionStateDto,
    usuarioId: number,
  ): Promise<FormatoVersiones> {
    return this.dataSource.transaction(async (manager) => {
      const versions = manager.getRepository(FormatoVersiones);
      const version = await versions.findOne({
        where: { id: versionId, formato_id: formatId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!version) {
        throw new NotFoundException(`Versión #${versionId} no encontrada`);
      }
      if (!canTransitionFormatVersion(version.estado, dto.estado)) {
        throw new ConflictException(
          `No se puede cambiar una versión de ${version.estado} a ${dto.estado}`,
        );
      }

      const previousState = version.estado;
      if (dto.estado === EstadoVersionFormato.OBSOLETA) {
        const activeAssignments = await manager
          .getRepository(FormatoAsignacionesCliente)
          .countBy({ version_formato_id: version.id, activa: true });
        if (!canObsoleteFormatVersion(version.es_vigente, activeAssignments > 0)) {
          throw new ConflictException(
            'No se puede obsoletar una versión vigente o asignada a un cliente',
          );
        }
      }
      if (dto.estado === EstadoVersionFormato.PUBLICADA) {
        await versions.update(
          { formato_id: formatId, es_vigente: true },
          { es_vigente: false },
        );
        version.es_vigente = true;
      } else if (version.es_vigente) {
        version.es_vigente = false;
      }
      version.estado = dto.estado;
      await versions.save(version);
      await this.auditoriaService.create(
        {
          usuario_id: usuarioId,
          entidad: 'formato_versiones',
          entidad_id: version.id,
          accion:
            dto.estado === EstadoVersionFormato.PUBLICADA
              ? AccionAuditoria.PUBLICAR
              : AccionAuditoria.EDITAR,
          detalle: {
            formato_id: formatId,
            estado_anterior: previousState,
            estado_nuevo: dto.estado,
          },
        },
        manager,
      );
      return version;
    });
  }
}

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
import { OrdenServicio } from '../ordenes-servicio/entities/orden-servicio.entity.js';
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
import type { PermissionContext } from '../rbac/rbac-authorization.service.js';

type VersionEditorFields = {
  codigo?: string;
  nombre?: string;
  fecha_version?: string;
  version_label?: string;
  responsable?: string;
  introduccion?: string;
  condiciones_comerciales?: string;
  firmas?: CreateFormatoDocumentalDto['firmas'];
  columnas?: string[];
  condiciones_etiquetas?: string[];
  pie_notas?: string;
  subtitulo?: string;
  titulo_detalle?: string;
  nota_precios?: string;
};

export type FormatoVersionResumen = {
  id: number;
  version: number;
  estado: string;
  responsable: string;
  fecha: string;
  aprobador: { id: number; nombre: string } | null;
  publicado_por: { id: number; nombre: string } | null;
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
  const detail = (current.detail ?? {}) as Record<string, unknown>;

  return {
    ...current,
    document_code:
      fields.codigo ??
      (typeof current.document_code === 'string'
        ? current.document_code
        : format.codigo),
    title:
      fields.nombre ??
      (typeof current.title === 'string' ? current.title : format.nombre),
    version_label:
      fields.version_label ??
      String(version).padStart(2, '0'),
    version_date: fields.fecha_version ?? date,
    ...(paragraphs === undefined ? {} : { paragraphs }),
    ...(commercialTerms === undefined
      ? {}
      : { commercial_terms: commercialTerms }),
    ...(signatures === undefined ? {} : { signatures }),
    ...(fields.subtitulo === undefined ? {} : { subtitle: fields.subtitulo }),
    ...(fields.columnas === undefined && fields.titulo_detalle === undefined && fields.nota_precios === undefined ? {} : {
      detail: {
        ...detail,
        ...(fields.columnas === undefined ? {} : { columns: fields.columnas }),
        ...(fields.titulo_detalle === undefined ? {} : { title: fields.titulo_detalle }),
        ...(fields.nota_precios === undefined ? {} : { pricing_note: fields.nota_precios }),
      },
    }),
    ...(fields.condiciones_etiquetas === undefined ? {} : { commercial_terms: fields.condiciones_etiquetas }),
    ...(fields.pie_notas === undefined ? {} : { footer_notes: fields.pie_notas }),
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

  async findAll(context: PermissionContext): Promise<FormatosDocumentales[]> {
    const qb = this.formatosRepository
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.versiones', 'v')
      .orderBy('f.id', 'ASC');
    if (context.policy.scopeIds.length > 0) {
      qb.where('v.scope_id IN (:...scopeIds)', {
        scopeIds: context.policy.scopeIds,
      });
    } else {
      qb.where('1 = 0');
    }
    return qb.getMany();
  }

  async findOne(
    id: number,
    context: PermissionContext,
  ): Promise<FormatosDocumentales> {
    const qb = this.formatosRepository
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.versiones', 'v')
      .where('f.id = :id', { id });
    if (context.policy.scopeIds.length > 0) {
      qb.andWhere('v.scope_id IN (:...scopeIds)', {
        scopeIds: context.policy.scopeIds,
      });
    } else {
      qb.andWhere('1 = 0');
    }
    const format = await qb.getOne();
    if (!format) {
      throw new NotFoundException(`Formato documental #${id} no encontrado`);
    }
    return format;
  }

  async findVersions(
    id: number,
    context: PermissionContext,
  ): Promise<FormatoVersionResumen[]> {
    await this.findOne(id, context);
    const versions = await this.versionesRepository.find({
      where: { formato_id: id, scope_id: In(context.policy.scopeIds) },
      relations: {
        rbac_aprobador_id_ref: true,
        rbac_publicado_por_id_ref: true,
      },
      order: { version: 'DESC' },
    });
    return versions.map((version) => ({
      id: version.id,
      version: version.version,
      estado: version.estado.toLowerCase(),
      responsable: version.responsable,
      fecha: version.fecha_version ?? version.created_at.toISOString(),
      aprobador: version.rbac_aprobador_id_ref
        ? { id: version.rbac_aprobador_id_ref.id, nombre: version.rbac_aprobador_id_ref.nombre }
        : null,
      publicado_por: version.rbac_publicado_por_id_ref
        ? { id: version.rbac_publicado_por_id_ref.id, nombre: version.rbac_publicado_por_id_ref.nombre }
        : null,
    }));
  }

  async create(
    dto: CreateFormatoDocumentalDto,
    usuarioId: number,
    _context: PermissionContext,
  ): Promise<FormatosDocumentales> {
    if (
      dto.tipo_documento === TipoDocumentoFormato.COTIZACION &&
      !dto.tipo_servicio
    ) {
      throw new BadRequestException(
        'Las plantillas de cotización requieren un tipo de servicio',
      );
    }
    if (
      dto.tipo_documento !== TipoDocumentoFormato.COTIZACION &&
      dto.tipo_servicio
    ) {
      throw new BadRequestException(
        'El tipo de servicio solo aplica a las plantillas de cotización',
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
          cliente_id: dto.cliente_id ?? null,
        }),
      );
      const configuration = createConfiguration(format, dto.version, dto.fecha_version, {
        codigo: dto.codigo,
        nombre: dto.nombre,
        fecha_version: dto.fecha_version,
        version_label: dto.version_label,
        introduccion: dto.introduccion,
        condiciones_comerciales: dto.condiciones_comerciales,
        firmas: dto.firmas,
        columnas: dto.columnas,
        condiciones_etiquetas: dto.condiciones_etiquetas,
        pie_notas: dto.pie_notas,
        subtitulo: dto.subtitulo,
        titulo_detalle: dto.titulo_detalle,
        nota_precios: dto.nota_precios,
      });
      await versions.save(
        versions.create({
          formato_id: format.id,
          version: dto.version,
          estado: EstadoVersionFormato.BORRADOR,
          renderer_key:
            dto.tipo_documento === TipoDocumentoFormato.ORDEN_SERVICIO ||
            dto.tipo_documento === TipoDocumentoFormato.ACTA_SERVICIO
              ? 'logistica_v1'
              : 'cotizacion_v1',
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
    _context: PermissionContext,
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

  async remove(
    id: number,
    usuarioId: number,
    _context: PermissionContext,
  ): Promise<{ message: string }> {
    return this.dataSource.transaction(async (manager) => {
      const formats = manager.getRepository(FormatosDocumentales);
      const versions = manager.getRepository(FormatoVersiones);
      const format = await formats.findOne({ where: { id } });
      if (!format) {
        throw new NotFoundException(`Formato documental #${id} no encontrado`);
      }

      const versionRows = await versions.find({ where: { formato_id: id } });
      const versionIds = versionRows.map(({ id: versionId }) => versionId);
      const [assignments, quotes, certificates, orders] = await Promise.all([
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
        versionIds.length
          ? manager.getRepository(OrdenServicio).count({
              where: [
                { formato_orden_version_id: In(versionIds) },
                { formato_acta_version_id: In(versionIds) },
              ],
            })
          : 0,
      ]);
      if (assignments || quotes || certificates || orders) {
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
    _context: PermissionContext,
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
        codigo: dto.codigo,
        nombre: dto.nombre,
        fecha_version: dto.fecha_version,
        version_label: dto.version_label,
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
    _context: PermissionContext,
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

      version.fecha_version = dto.fecha_version ?? version.fecha_version;
      version.responsable = dto.responsable ?? version.responsable;
      const currentVersionLabel = version.configuracion_json.version_label;
      version.configuracion_json = createConfiguration(
        format,
        version.version,
        version.fecha_version ?? '',
        {
          ...dto,
          version_label:
            dto.version_label ??
            (typeof currentVersionLabel === 'string'
              ? currentVersionLabel
              : undefined),
        },
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
    _context: PermissionContext,
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

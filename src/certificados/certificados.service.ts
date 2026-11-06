import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import type { DataSource, EntityManager, Repository } from 'typeorm';
import { CertificadoEsterilizacion } from './entities/certificado-esterilizacion.entity.js';
import { SecuenciaConsecutivos } from '../documentos/entities/secuencia-consecutivos.entity.js';
import { CicloEsterilizacion } from '../planta/entities/ciclo-esterilizacion.entity.js';
import { FormatoResolverService } from '../formatos-documentales/formato-resolver.service.js';
import { PDF_RENDERER_VERSION, PdfGeneratorService } from '../pdf/pdf-generator.service.js';
import { User } from '../users/entities/user.entity.js';

const SEQUENCE_NAME = 'certificado_esterilizacion';
const CERTIFICATE_RELATIONS = [
  'cicloEsterilizacion',
  'cicloEsterilizacion.orden',
  'cicloEsterilizacion.orden.cotizacion',
  'cicloEsterilizacion.orden.cotizacion.cliente',
  'cicloEsterilizacion.orden.cotizacion.items',
  'cicloEsterilizacion.operador',
  'aprobador',
];

@Injectable()
export class CertificadosService {
  constructor(
    @InjectRepository(CertificadoEsterilizacion)
    private readonly certificadoRepository: Repository<CertificadoEsterilizacion>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly formatoResolver: FormatoResolverService,
    private readonly pdfGenerator: PdfGeneratorService,
  ) {}

  async emitirDesdeCiclo(
    manager: EntityManager,
    ciclo: CicloEsterilizacion,
    aprobadorId: number,
    aprobadoAt: Date,
  ): Promise<CertificadoEsterilizacion> {
    const sequenceRepository = manager.getRepository(SecuenciaConsecutivos);
    const sequence = await sequenceRepository.findOne({
      where: { nombre: SEQUENCE_NAME },
      lock: { mode: 'pessimistic_write' },
    });

    if (!sequence) {
      throw new InternalServerErrorException(
        'No está inicializada la secuencia de certificados',
      );
    }
    const nextConsecutive = BigInt(sequence.ultimo_valor) + 1n;
    const consecutivo = nextConsecutive.toString().padStart(3, '0');
    sequence.ultimo_valor = nextConsecutive.toString();
    await sequenceRepository.save(sequence);

    const certificateRepository = manager.getRepository(CertificadoEsterilizacion);
    const certificado = certificateRepository.create({
      consecutivo,
      token_publico: randomBytes(32).toString('base64url'),
      ciclo_id: ciclo.id,
      cicloEsterilizacion: ciclo,
      orden_id: ciclo.orden_id,
      orden: ciclo.orden,
      equipo: ciclo.equipo,
      ciclo: String(ciclo.id),
      parametros_tecnicos: {
        metodo: ciclo.metodo,
        temperatura: ciclo.temperatura,
        humedad: ciclo.humedad,
        presion: ciclo.presion,
        tiempo_exposicion: ciclo.tiempo_exposicion,
        tiempo_aireacion: ciclo.tiempo_aireacion,
        control_biologico: ciclo.control_biologico,
        control_quimico: ciclo.control_quimico,
      },
      controles_biologicos: ciclo.control_biologico,
      estado: 'Aprobado',
      aprobador_id: aprobadorId,
      aprobador: { id: aprobadorId },
      aprobado_at: aprobadoAt,
      fecha_emision: aprobadoAt,
    });
    const client = ciclo.orden?.cotizacion?.cliente;
    const version = await this.formatoResolver.resolveCertificado(client?.id ?? null, manager);
    const aprobador = await manager.getRepository(User).findOne({
      where: { id: aprobadorId },
    });
    if (!aprobador) {
      throw new NotFoundException(`Aprobador #${aprobadorId} no encontrado`);
    }
    const formatConfig = version.configuracion_json;
    const snapshot: Record<string, any> = {
      documento: {
        tipo: 'CERTIFICADO',
        consecutivo,
        fecha_emision: aprobadoAt.toISOString(),
        fecha_vencimiento: new Date(new Date(aprobadoAt).setFullYear(aprobadoAt.getFullYear() + 3)).toISOString(),
      },
      formato: {
        id: version.id,
        version: version.version,
        codigo: formatConfig.document_code,
        fecha_version: version.fecha_version,
        renderer_key: version.renderer_key,
        configuracion_json: version.configuracion_json,
      },
      cliente: client ? {
        id: client.id,
        razon_social: client.razon_social,
        nit: client.nit,
        direccion: client.direccion,
        contacto: client.contacto,
        telefono: client.telefono,
        email: client.email,
      } : null,
      certificado: {
        consecutivo,
        equipo: ciclo.equipo,
        ciclo: String(ciclo.id),
        controles_biologicos: ciclo.control_biologico,
        token_publico: certificado.token_publico,
      },
      aprobador: {
        id: aprobador.id,
        nombre: aprobador.nombre,
        rol: aprobador.rol,
      },
      ciclo_esterilizacion: {
        id: ciclo.id,
        equipo: ciclo.equipo,
        fecha_proceso: ciclo.fecha_proceso?.toISOString() ?? null,
        metodo: ciclo.metodo,
        temperatura: ciclo.temperatura,
        humedad: ciclo.humedad,
        presion: ciclo.presion,
        tiempo_exposicion: ciclo.tiempo_exposicion,
        tiempo_aireacion: ciclo.tiempo_aireacion,
        control_biologico: ciclo.control_biologico,
        control_quimico: ciclo.control_quimico,
        orden: ciclo.orden ? {
          id: ciclo.orden.id,
          consecutivo: ciclo.orden.consecutivo,
          cotizacion: ciclo.orden.cotizacion ? {
            cliente: ciclo.orden.cotizacion.cliente ? {
              id: ciclo.orden.cotizacion.cliente.id,
              razon_social: ciclo.orden.cotizacion.cliente.razon_social,
              nit: ciclo.orden.cotizacion.cliente.nit,
            } : null,
            items: (ciclo.orden.cotizacion.items ?? []).map((item) => ({
              id: item.id,
              descripcion: item.descripcion,
              cantidad: item.cantidad,
            })),
          } : null,
        } : null,
      },
      reconstruido: false,
    };
    const storageKey = `certificados/${consecutivo}.pdf`;
    let generated = false;
    try {
      const result = await this.pdfGenerator.generate(snapshot, storageKey);
      generated = true;
      certificado.version_formato_id = version.id;
      certificado.snapshot_datos = snapshot;
      certificado.pdf_url = result.storageKey;
      certificado.hash_pdf = result.hash;
      certificado.pdf_renderer_version = PDF_RENDERER_VERSION;
      return await certificateRepository.save(certificado);
    } catch (error) {
      if (generated) await this.pdfGenerator.remove(storageKey);
      throw error;
    }
  }

  findAll(): Promise<CertificadoEsterilizacion[]> {
    return this.certificadoRepository.find({
      relations: [
        'cicloEsterilizacion',
        'cicloEsterilizacion.orden',
        'cicloEsterilizacion.orden.cotizacion',
        'cicloEsterilizacion.orden.cotizacion.cliente',
        'cicloEsterilizacion.orden.cotizacion.items',
        'cicloEsterilizacion.operador',
        'aprobador',
      ],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<CertificadoEsterilizacion> {
    const certificado = await this.certificadoRepository.findOne({
      where: { id },
      relations: CERTIFICATE_RELATIONS,
    });
    if (!certificado) {
      throw new NotFoundException(`Certificado #${id} no encontrado`);
    }
    return certificado;
  }

  async ensurePdfCurrent(id: number): Promise<CertificadoEsterilizacion> {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(CertificadoEsterilizacion);
      const certificate = await repository.findOne({
        where: { id },
        relations: CERTIFICATE_RELATIONS,
        lock: { mode: 'pessimistic_write' },
      });
      if (!certificate) {
        throw new NotFoundException(`Certificado #${id} no encontrado`);
      }
      if (certificate.pdf_url && certificate.hash_pdf &&
        certificate.pdf_renderer_version === PDF_RENDERER_VERSION) {
        try {
          await this.pdfGenerator.getFile(certificate.pdf_url, certificate.hash_pdf);
          return certificate;
        } catch {
          // A missing or altered object is rebuilt from the persisted snapshot below.
        }
      }
      if (!certificate.pdf_url && !certificate.snapshot_datos) {
        return certificate;
      }
      if (!certificate.snapshot_datos) {
        throw new ConflictException(
          'El certificado no tiene una copia de datos para regenerar su PDF',
        );
      }

      const previousKey = certificate.pdf_url ?? `certificados/${certificate.consecutivo}.pdf`;
      const storageKey = certificate.pdf_renderer_version === PDF_RENDERER_VERSION
        ? previousKey
        : previousKey.replace(/\.pdf$/, `-${PDF_RENDERER_VERSION}.pdf`);
      const result = await this.pdfGenerator.generate(
        certificate.snapshot_datos,
        storageKey,
      );
      certificate.pdf_url = result.storageKey;
      certificate.hash_pdf = result.hash;
      certificate.pdf_renderer_version = PDF_RENDERER_VERSION;
      try {
        return await repository.save(certificate);
      } catch (error) {
        await this.pdfGenerator.remove(result.storageKey);
        throw error;
      }
    });
  }

  async validarToken(token: string) {
    const certificado = await this.certificadoRepository.findOne({
      where: { token_publico: token, estado: 'Aprobado' },
    });
    if (!certificado) {
      throw new NotFoundException('No se encontró un certificado válido');
    }
    const fechaEmision = certificado.aprobado_at ?? certificado.created_at;
    const fechaVencimiento = new Date(fechaEmision);
    fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 3);
    return {
      valido: true,
      equipo: certificado.equipo,
      fecha_emision: fechaEmision,
      fecha_vencimiento: fechaVencimiento,
      estado: certificado.estado,
    };
  }

}

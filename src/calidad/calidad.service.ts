import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthService } from '../auth/auth.service.js';
import { CertificadosService } from '../certificados/certificados.service.js';
import { CicloEsterilizacion, EstadoCicloEsterilizacion } from '../planta/entities/ciclo-esterilizacion.entity.js';
import { ApproveCycleDto } from './dto/approve-cycle.dto.js';
import { RejectCycleDto } from './dto/reject-cycle.dto.js';
import { PdfGeneratorService } from '../pdf/pdf-generator.service.js';

@Injectable()
export class CalidadService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly authService: AuthService,
    private readonly certificadosService: CertificadosService,
    private readonly pdfGenerator: PdfGeneratorService,
  ) {}

  findPendientes(): Promise<CicloEsterilizacion[]> {
    return this.dataSource.getRepository(CicloEsterilizacion).find({
      where: { estado: EstadoCicloEsterilizacion.PENDIENTE_CALIDAD },
      relations: ['orden', 'orden.cotizacion', 'orden.cotizacion.cliente', 'operador'],
      order: { fecha_proceso: 'ASC', id: 'ASC' },
    });
  }

  async findCicloPendiente(id: number): Promise<CicloEsterilizacion> {
    const cycle = await this.dataSource.getRepository(CicloEsterilizacion).findOne({
      where: { id, estado: EstadoCicloEsterilizacion.PENDIENTE_CALIDAD },
      relations: ['orden', 'orden.cotizacion', 'orden.cotizacion.cliente', 'orden.cotizacion.items', 'operador'],
    });
    if (!cycle) {
      throw new NotFoundException(`Ciclo pendiente #${id} no encontrado`);
    }
    return cycle;
  }

  async aprobar(dto: ApproveCycleDto, aprobadorId: number) {
    const passwordValida = await this.authService.verifyPassword(
      aprobadorId,
      dto.password,
    );
    if (!passwordValida) {
      throw new ForbiddenException('La contraseña de Calidad no es válida');
    }

    let generatedPdfKey: string | null = null;
    try {
      return await this.dataSource.transaction(async (manager) => {
        const cycleRepository = manager.getRepository(CicloEsterilizacion);
        const cycle = await cycleRepository.findOne({
          where: { id: dto.ciclo_id },
          relations: ['orden', 'orden.cotizacion', 'orden.cotizacion.cliente', 'orden.cotizacion.items', 'operador'],
          lock: { mode: 'pessimistic_write' },
        });
        if (!cycle) {
          throw new NotFoundException(`Ciclo #${dto.ciclo_id} no encontrado`);
        }
        this.assertPending(cycle);

        const decidedAt = new Date();
        const certificate = await this.certificadosService.emitirDesdeCiclo(
          manager,
          cycle,
          aprobadorId,
          decidedAt,
        );
        generatedPdfKey = certificate.pdf_url;
        cycle.estado = EstadoCicloEsterilizacion.APROBADO;
        cycle.revisado_por = aprobadorId;
        cycle.revisado_en = decidedAt;
        cycle.motivo_rechazo = null;
        await cycleRepository.save(cycle);

        return certificate;
      });
    } catch (error) {
      if (generatedPdfKey) await this.pdfGenerator.remove(generatedPdfKey);
      throw error;
    }
  }

  rechazar(dto: RejectCycleDto, revisorId: number) {
    const motivo = dto.motivo.trim();
    if (!motivo) {
      throw new BadRequestException('El motivo de rechazo es obligatorio');
    }

    return this.dataSource.transaction(async (manager) => {
      const cycleRepository = manager.getRepository(CicloEsterilizacion);
      const cycle = await cycleRepository.findOne({
        where: { id: dto.ciclo_id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!cycle) {
        throw new NotFoundException(`Ciclo #${dto.ciclo_id} no encontrado`);
      }
      this.assertPending(cycle);

      cycle.estado = EstadoCicloEsterilizacion.RECHAZADO;
      cycle.revisado_por = revisorId;
      cycle.revisado_en = new Date();
      cycle.motivo_rechazo = motivo;
      return cycleRepository.save(cycle);
    });
  }

  private assertPending(cycle: CicloEsterilizacion): void {
    if (cycle.estado !== EstadoCicloEsterilizacion.PENDIENTE_CALIDAD) {
      throw new BadRequestException('El ciclo ya fue revisado');
    }
  }
}

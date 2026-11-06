import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { CertificadosModule } from '../certificados/certificados.module.js';
import { CicloEsterilizacion } from '../planta/entities/ciclo-esterilizacion.entity.js';
import { AuditoriaModule } from '../auditoria/auditoria.module.js';
import { CalidadController } from './calidad.controller.js';
import { CalidadService } from './calidad.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([CicloEsterilizacion]), AuthModule, CertificadosModule, AuditoriaModule],
  controllers: [CalidadController],
  providers: [CalidadService],
})
export class CalidadModule {}

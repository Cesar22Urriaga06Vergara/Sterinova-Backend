import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormatoAsignacionesCliente } from './entities/formato-asignaciones-cliente.entity.js';
import { FormatosDocumentales } from './entities/formatos-documentales.entity.js';
import { FormatoResolverService } from './formato-resolver.service.js';
import { FormatoVersiones } from './entities/formato-versiones.entity.js';
import { Cotizacion } from '../cotizaciones/entities/cotizacion.entity.js';
import { CertificadoEsterilizacion } from '../certificados/entities/certificado-esterilizacion.entity.js';
import { FormatosDocumentalesController } from './formatos-documentales.controller.js';
import { FormatosDocumentalesService } from './formatos-documentales.service.js';
import { AuditoriaModule } from '../auditoria/auditoria.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FormatosDocumentales,
      FormatoVersiones,
      FormatoAsignacionesCliente,
      Cotizacion,
      CertificadoEsterilizacion,
    ]),
    AuditoriaModule,
  ],
  controllers: [FormatosDocumentalesController],
  providers: [FormatoResolverService, FormatosDocumentalesService],
  exports: [FormatoResolverService, FormatosDocumentalesService],
})
export class FormatosDocumentalesModule {}

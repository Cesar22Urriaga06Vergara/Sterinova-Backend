import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenServicio } from '../ordenes-servicio/entities/orden-servicio.entity.js';
import { OrdenServicioEvento } from '../ordenes-servicio/entities/orden-servicio-evento.entity.js';
import { Cotizacion } from '../cotizaciones/entities/cotizacion.entity.js';
import { LogisticaController } from './logistica.controller.js';
import { LogisticaService } from './logistica.service.js';
import { AuditoriaModule } from '../auditoria/auditoria.module.js';
import { FormatosDocumentalesModule } from '../formatos-documentales/formatos-documentales.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdenServicio, OrdenServicioEvento, Cotizacion]),
    AuditoriaModule,
    FormatosDocumentalesModule,
  ],
  controllers: [LogisticaController],
  providers: [LogisticaService],
  exports: [LogisticaService],
})
export class LogisticaModule {}

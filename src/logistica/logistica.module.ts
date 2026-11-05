import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenServicio } from '../ordenes-servicio/entities/orden-servicio.entity.js';
import { Cotizacion } from '../cotizaciones/entities/cotizacion.entity.js';
import { LogisticaController } from './logistica.controller.js';
import { LogisticaService } from './logistica.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([OrdenServicio, Cotizacion])],
  controllers: [LogisticaController],
  providers: [LogisticaService],
  exports: [LogisticaService],
})
export class LogisticaModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenServicio } from '../ordenes-servicio/entities/orden-servicio.entity.js';
import { OrdenServicioEvento } from '../ordenes-servicio/entities/orden-servicio-evento.entity.js';
import { Cotizacion } from '../cotizaciones/entities/cotizacion.entity.js';
import { DocumentoEmitido } from './entities/documento-emitido.entity.js';
import { DocumentoEvento } from './entities/documento-evento.entity.js';
import { RecepcionLogistica } from './entities/recepcion-logistica.entity.js';
import { Conductor } from './entities/conductor.entity.js';
import { ConductoresController } from './conductores.controller.js';
import { ConductoresService } from './conductores.service.js';
import { LogisticaController } from './logistica.controller.js';
import { LogisticaService } from './logistica.service.js';
import { AuditoriaModule } from '../auditoria/auditoria.module.js';
import { FormatosDocumentalesModule } from '../formatos-documentales/formatos-documentales.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrdenServicio,
      OrdenServicioEvento,
      Cotizacion,
      DocumentoEmitido,
      DocumentoEvento,
      RecepcionLogistica,
      Conductor,
    ]),
    AuditoriaModule,
    FormatosDocumentalesModule,
  ],
  controllers: [LogisticaController, ConductoresController],
  providers: [LogisticaService, ConductoresService],
  exports: [LogisticaService],
})
export class LogisticaModule {}

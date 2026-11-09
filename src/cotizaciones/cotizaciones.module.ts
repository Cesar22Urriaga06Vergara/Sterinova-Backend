import { SelloSnapshotModule } from '../sellos/sello-snapshot.module.js';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cotizacion } from './entities/cotizacion.entity.js';
import { CotizacionItem } from './entities/cotizacion-item.entity.js';
import { CotizacionesController } from './cotizaciones.controller.js';
import { CotizacionesService } from './cotizaciones.service.js';
import { ClientesModule } from '../clientes/clientes.module.js';
import { SecuenciaConsecutivos } from '../documentos/entities/secuencia-consecutivos.entity.js';
import { FormatosDocumentalesModule } from '../formatos-documentales/formatos-documentales.module.js';
import { AuditoriaModule } from '../auditoria/auditoria.module.js';

@Module({
  imports: [
    SelloSnapshotModule,
    TypeOrmModule.forFeature([Cotizacion, CotizacionItem, SecuenciaConsecutivos]),
    ClientesModule,
    FormatosDocumentalesModule,
    AuditoriaModule,
  ],
  controllers: [CotizacionesController],
  providers: [CotizacionesService],
  exports: [CotizacionesService],
})
export class CotizacionesModule {}

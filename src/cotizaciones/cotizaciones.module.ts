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
import { RbacModule } from '../rbac/rbac.module.js';
import { SolicitudAnulacion } from './entities/solicitud-anulacion.entity.js';
import { SolicitudAnulacionService } from './solicitud-anulacion.service.js';
import { SolicitudAnulacionController } from './solicitud-anulacion.controller.js';

@Module({
  imports: [
    SelloSnapshotModule,
    RbacModule,
    TypeOrmModule.forFeature([
      Cotizacion,
      CotizacionItem,
      SecuenciaConsecutivos,
      SolicitudAnulacion,
    ]),
    ClientesModule,
    FormatosDocumentalesModule,
    AuditoriaModule,
  ],
  controllers: [CotizacionesController, SolicitudAnulacionController],
  providers: [CotizacionesService, SolicitudAnulacionService],
  exports: [CotizacionesService, SolicitudAnulacionService],
})
export class CotizacionesModule {}

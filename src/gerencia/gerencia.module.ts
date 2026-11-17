import { Module } from '@nestjs/common';
import { RbacModule } from '../rbac/rbac.module.js';
import { AuditoriaModule } from '../auditoria/auditoria.module.js';
import { GerenciaController } from './gerencia.controller.js';
import { GerenciaAdministradoresController } from './gerencia-administradores.controller.js';
import { GerenciaMetricasService } from './gerencia-metricas.service.js';
import { GerenciaAdministradoresService } from './gerencia-administradores.service.js';

@Module({
  imports: [RbacModule, AuditoriaModule],
  controllers: [GerenciaController, GerenciaAdministradoresController],
  providers: [GerenciaMetricasService, GerenciaAdministradoresService],
})
export class GerenciaModule {}

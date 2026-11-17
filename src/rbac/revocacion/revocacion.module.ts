import { Module } from '@nestjs/common';
import { RevocacionController } from './revocacion.controller.js';
import { RevocacionService } from '../revocacion.service.js';
import { AuditoriaModule } from '../../auditoria/auditoria.module.js';

@Module({
  imports: [AuditoriaModule],
  controllers: [RevocacionController],
  providers: [RevocacionService],
  exports: [RevocacionService],
})
export class RevocacionModule {}

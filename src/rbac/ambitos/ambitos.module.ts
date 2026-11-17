import { Module } from '@nestjs/common';
import { AmbitoController } from './ambitos.controller.js';
import { AmbitoService } from './ambito.service.js';
import { AuditoriaModule } from '../../auditoria/auditoria.module.js';

@Module({
  imports: [AuditoriaModule],
  controllers: [AmbitoController],
  providers: [AmbitoService],
  exports: [AmbitoService],
})
export class AmbitoModule {}

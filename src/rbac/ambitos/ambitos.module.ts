import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RbacScope } from '../entities/scope.entity.js';
import { AmbitoController } from './ambitos.controller.js';
import { AmbitoService } from './ambito.service.js';
import { AuditoriaModule } from '../../auditoria/auditoria.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([RbacScope]), AuditoriaModule],
  controllers: [AmbitoController],
  providers: [AmbitoService],
  exports: [AmbitoService],
})
export class AmbitoModule {}

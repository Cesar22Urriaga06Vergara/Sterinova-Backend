import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SelloCertificacion } from './entities/sello-certificacion.entity.js';
import { SellosController } from './sellos.controller.js';
import { SellosService } from './sellos.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([SelloCertificacion])],
  controllers: [SellosController],
  providers: [SellosService],
  exports: [SellosService],
})
export class SellosModule {}

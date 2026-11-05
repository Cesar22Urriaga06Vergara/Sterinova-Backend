import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenServicio } from '../ordenes-servicio/entities/orden-servicio.entity.js';
import { User } from '../users/entities/user.entity.js';
import { CicloEsterilizacion } from './entities/ciclo-esterilizacion.entity.js';
import { PlantaController } from './planta.controller.js';
import { PlantaService } from './planta.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([CicloEsterilizacion, OrdenServicio, User])],
  controllers: [PlantaController],
  providers: [PlantaService],
})
export class PlantaModule {}

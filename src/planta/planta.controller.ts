import {
  Body,
  Controller,
  Get,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { CreateCicloDto } from './dto/create-ciclo.dto.js';
import { PlantaService } from './planta.service.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { UserRole } from '../users/entities/user-role.enum.js';

interface AuthenticatedRequest extends Request {
  user: { id: number };
}

@Controller('planta')
@Roles(UserRole.ADMIN, UserRole.PLANTA)
export class PlantaController {
  constructor(private readonly plantaService: PlantaService) {}

  @Get('ordenes')
  findOrdenesEnPlanta() {
    return this.plantaService.findOrdenesEnPlanta();
  }

  @Get('ciclos')
  findCiclos() {
    return this.plantaService.findCiclos();
  }

  @Post('ciclos')
  createCiclo(
    @Body() createCicloDto: CreateCicloDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.plantaService.createCiclo(createCicloDto, request.user.id);
  }
}

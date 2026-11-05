import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { LogisticaService } from './logistica.service.js';
import { CreateOrdenDto } from './dto/create-orden.dto.js';
import { UpdateEstadoOrdenDto } from './dto/update-estado-orden.dto.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { UserRole } from '../users/entities/user-role.enum.js';

@Controller('logistica')
@Roles(UserRole.ADMIN, UserRole.LOGISTICA)
export class LogisticaController {
  constructor(private readonly logisticaService: LogisticaService) {}

  @Post('ordenes')
  createOrden(@Body() createOrdenDto: CreateOrdenDto) {
    return this.logisticaService.createOrden(createOrdenDto);
  }

  @Get('ordenes')
  findAllOrdenes() {
    return this.logisticaService.findAll();
  }

  @Get('cotizaciones-aprobadas')
  findCotizacionesAprobadas() {
    return this.logisticaService.findCotizacionesAprobadasSinOrden();
  }

  @Get('ordenes/:id')
  findOneOrden(@Param('id', ParseIntPipe) id: number) {
    return this.logisticaService.findOne(id);
  }

  @Put('ordenes/:id/estado')
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEstadoOrdenDto: UpdateEstadoOrdenDto,
  ) {
    return this.logisticaService.updateEstado(id, updateEstadoOrdenDto);
  }
}

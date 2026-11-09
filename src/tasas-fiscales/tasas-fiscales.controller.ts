import { Body, Controller, Get, Header, Post, Req } from '@nestjs/common';
import {
  IsISO8601,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import {
  RequirePermission,
  ScopedPermissions,
} from '../rbac/require-permission.decorator.js';
import type { RbacRequest } from '../rbac/authorization.guard.js';
import { TasasFiscalesService } from './tasas-fiscales.service.js';

export class PublishIvaDto {
  @ApiProperty({
    example: '0.190000',
    description: 'Fracción decimal entre 0 y 1, máximo seis decimales',
  })
  @IsString()
  @Matches(/^(?:0(?:\.\d{1,6})?|1(?:\.0{1,6})?)$/)
  tasa: string;

  @ApiProperty({ example: '2027-01-01T00:00:00-05:00' })
  @IsISO8601({ strict: true })
  @Matches(/T.*(?:Z|[+-]\d{2}:\d{2})$/)
  vigente_desde: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  @Matches(/\S.{3,}\S/)
  motivo: string;
}

@Controller('tasas-fiscales/iva')
@ApiTags('Tasas fiscales')
@ScopedPermissions()
export class TasasFiscalesController {
  constructor(private readonly service: TasasFiscalesService) {}
  @Get()
  @Header('Cache-Control', 'private, no-store')
  @RequirePermission('tasas_fiscales.gestionar')
  history(@Req() request: RbacRequest) {
    return this.service.history(request.rbac);
  }

  @Post()
  @RequirePermission('tasas_fiscales.gestionar')
  publish(@Body() dto: PublishIvaDto, @Req() request: RbacRequest) {
    return this.service.publish(dto, request.rbac);
  }
}

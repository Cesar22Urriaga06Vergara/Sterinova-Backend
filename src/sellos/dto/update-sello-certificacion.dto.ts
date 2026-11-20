import { Transform, Type } from 'class-transformer';
import { ArrayMaxSize, ArrayUnique, IsArray, IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateSelloCertificacionDto {
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(20)
  @IsIn(['COTIZACION:INDUSTRIAL_ETO','COTIZACION:INSTITUCIONAL_ETO','COTIZACION:INSTITUCIONAL_VAPOR','COTIZACION:INSUMOS','COTIZACION:LAVANDERIA','COTIZACION:FARMACEUTICO','COTIZACION:FABRICANTE','CERTIFICADO','ORDEN_SERVICIO','ACTA_SERVICIO'], { each: true })
  aplica_a?: string[];
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombre_norma?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  numero_licencia?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  orden?: number;
}

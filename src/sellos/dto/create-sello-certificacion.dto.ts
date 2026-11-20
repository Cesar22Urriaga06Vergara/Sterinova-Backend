import { ArrayMaxSize, ArrayUnique, IsArray, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateSelloCertificacionDto {
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(20)
  @IsIn(['COTIZACION:INDUSTRIAL_ETO','COTIZACION:INSTITUCIONAL_ETO','COTIZACION:INSTITUCIONAL_VAPOR','COTIZACION:INSUMOS','COTIZACION:LAVANDERIA','COTIZACION:FARMACEUTICO','COTIZACION:FABRICANTE','CERTIFICADO','ORDEN_SERVICIO','ACTA_SERVICIO'], { each: true })
  @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
  aplica_a?: string[];
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombre_norma: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  numero_licencia: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  orden?: number;
}

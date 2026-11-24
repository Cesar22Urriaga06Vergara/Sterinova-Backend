import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsString, Matches, MaxLength, MinLength } from 'class-validator';

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

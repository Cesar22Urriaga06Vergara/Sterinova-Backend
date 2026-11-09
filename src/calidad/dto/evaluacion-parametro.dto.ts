import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsString, MaxLength, Min } from 'class-validator';

export class EvaluacionParametroDto {
  @ApiProperty({ type: String, example: 'temperatura' })
  @IsString()
  @MaxLength(80)
  parametro: string;
  @ApiProperty({ enum: ['CUMPLE', 'NO_CUMPLE', 'NO_APLICA'] })
  @IsIn(['CUMPLE', 'NO_CUMPLE', 'NO_APLICA'])
  criterio: 'CUMPLE' | 'NO_CUMPLE' | 'NO_APLICA';
  /** Zero-based index in the immutable protocol options. */
  @ApiProperty({
    type: Number,
    minimum: 0,
    description: 'Indice cero-based de la alternativa del protocolo inmutable',
  })
  @IsInt()
  @Min(0)
  opcion: number;
}

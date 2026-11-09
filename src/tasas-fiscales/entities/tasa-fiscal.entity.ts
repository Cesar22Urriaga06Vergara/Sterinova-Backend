import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('tasas_fiscales')
@Index('UQ_tasa_fiscal_version', ['impuesto', 'version'], { unique: true })
@Index('UQ_tasa_fiscal_vigencia', ['impuesto', 'vigente_desde'], {
  unique: true,
})
export class TasaFiscal {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'varchar', length: 30 }) impuesto: string;
  @Column({ type: 'int', unsigned: true }) version: number;
  @Column({ type: 'decimal', precision: 7, scale: 6 }) tasa: string;
  /** Stored in UTC; the service projects ISO strings explicitly, independently of driver timezone. */
  @Column({ type: 'datetime', precision: 6 }) vigente_desde: Date;
  @Column({ type: 'int', nullable: true }) creado_por: number | null;
  @Column({ type: 'varchar', length: 500 }) motivo: string;
  @Column({ type: 'datetime', precision: 6 }) creado_at: Date;
}

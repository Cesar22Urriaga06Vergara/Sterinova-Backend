import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { FormatoVersiones } from './formato-versiones.entity.js';
import { FormatoAsignacionesCliente } from './formato-asignaciones-cliente.entity.js';

export enum TipoDocumentoFormato {
  COTIZACION = 'COTIZACION',
  CERTIFICADO = 'CERTIFICADO',
}

@Entity('formatos_documentales')
@Index('UQ_formatos_documentales_clave', ['clave'], { unique: true })
@Index('UQ_formatos_documentales_codigo', ['codigo'], { unique: true })
export class FormatosDocumentales {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  clave: string;

  @Column({ type: 'varchar', length: 32 })
  tipo_documento: TipoDocumentoFormato;

  @Column({ type: 'varchar', length: 80, nullable: true })
  tipo_servicio: string | null;

  @Column({ type: 'varchar', length: 80 })
  codigo: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  @OneToMany(() => FormatoVersiones, (version) => version.formato)
  versiones: Relation<FormatoVersiones[]>;

  @OneToMany(() => FormatoAsignacionesCliente, (asignacion) => asignacion.formato)
  asignaciones_cliente: Relation<FormatoAsignacionesCliente[]>;
}

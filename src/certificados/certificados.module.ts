import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificadoEsterilizacion } from './entities/certificado-esterilizacion.entity.js';
import { SecuenciaConsecutivos } from '../documentos/entities/secuencia-consecutivos.entity.js';
import { CertificadosService } from './certificados.service.js';
import { CertificadosController } from './certificados.controller.js';
import { FormatosDocumentalesModule } from '../formatos-documentales/formatos-documentales.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([CertificadoEsterilizacion, SecuenciaConsecutivos]),
    FormatosDocumentalesModule,
  ],
  controllers: [CertificadosController],
  providers: [CertificadosService],
  exports: [CertificadosService],
})
export class CertificadosModule {}

import 'dotenv/config';
import { DataSource } from 'typeorm';
import { STERINOVA_ENTITIES } from './entities.js';
import { InitialSchema1730750400000 } from './migrations/1730750400000-InitialSchema.js';
import { AddQualityCertificates1730750401000 } from './migrations/1730750401000-AddQualityCertificates.js';
import { AddCertificateValidationToken1730750402000 } from './migrations/1730750402000-AddCertificateValidationToken.js';
import { AddDocumentFormatVersioning1793750400000 } from './migrations/1793750400000-AddDocumentFormatVersioning.js';
import { ResetCertificateSequenceToThreeDigits1793754000000 } from './migrations/1793754000000-ResetCertificateSequenceToThreeDigits.js';
import { ExtendDocumentSequences1793757600000 } from './migrations/1793757600000-ExtendDocumentSequences.js';
import { AddClienteDocumentFields1793813200000 } from './migrations/1793813200000-AddClienteDocumentFields.js';
import { CreateAuditoria1793813300000 } from './migrations/1793813300000-CreateAuditoria.js';
import { AddTemplateResponsible1793813400000 } from './migrations/1793813400000-AddTemplateResponsible.js';
import { AddPdfRendererVersion1793813500000 } from './migrations/1793813500000-AddPdfRendererVersion.js';
import { AddUsersAndCertificationSeals1793813600000 } from './migrations/1793813600000-AddUsersAndCertificationSeals.js';
import { ExtendAuditoriaEvents1793813700000 } from './migrations/1793813700000-ExtendAuditoriaEvents.js';

export const AppDataSource = new DataSource({
  type: 'mariadb',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: STERINOVA_ENTITIES,
  migrations: [
    InitialSchema1730750400000,
    AddQualityCertificates1730750401000,
    AddCertificateValidationToken1730750402000,
    AddDocumentFormatVersioning1793750400000,
    ResetCertificateSequenceToThreeDigits1793754000000,
    ExtendDocumentSequences1793757600000,
    AddClienteDocumentFields1793813200000,
    CreateAuditoria1793813300000,
    AddTemplateResponsible1793813400000,
    AddPdfRendererVersion1793813500000,
    AddUsersAndCertificationSeals1793813600000,
    ExtendAuditoriaEvents1793813700000,
  ],
  migrationsTableName: 'typeorm_migrations',
  migrationsTransactionMode: 'each',
  synchronize: false,
});

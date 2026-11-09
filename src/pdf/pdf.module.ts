import { SelloSnapshotModule } from '../sellos/sello-snapshot.module.js';
import { Global, Module } from '@nestjs/common';
import { PdfGeneratorService } from './pdf-generator.service.js';
import { LocalStorageService, StorageService } from '../common/services/storage.service.js';

@Global()
@Module({
  imports:[SelloSnapshotModule],
  providers: [
    PdfGeneratorService,
    LocalStorageService,
    { provide: StorageService, useExisting: LocalStorageService },
  ],
  exports: [PdfGeneratorService, StorageService],
})
export class PdfModule {}

import { Global, Module } from '@nestjs/common';
import { PdfGeneratorService } from './pdf-generator.service.js';
import { LocalStorageService, StorageService } from '../common/services/storage.service.js';

@Global()
@Module({
  providers: [
    PdfGeneratorService,
    LocalStorageService,
    { provide: StorageService, useExisting: LocalStorageService },
  ],
  exports: [PdfGeneratorService, StorageService],
})
export class PdfModule {}

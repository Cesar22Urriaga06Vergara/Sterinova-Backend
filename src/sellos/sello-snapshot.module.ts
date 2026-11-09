import { Module } from '@nestjs/common';
import { SelloSnapshotService } from './sello-snapshot.service.js';

@Module({ providers: [SelloSnapshotService], exports: [SelloSnapshotService] })
export class SelloSnapshotModule {}

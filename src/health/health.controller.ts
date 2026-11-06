import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HealthIndicatorService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from '../auth/decorators/public.decorator.js';
import { StorageService } from '../common/services/storage.service.js';
import { PdfGeneratorService } from '../pdf/pdf-generator.service.js';

@Public()
@SkipThrottle()
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly database: TypeOrmHealthIndicator,
    private readonly indicators: HealthIndicatorService,
    private readonly storage: StorageService,
    private readonly renderer: PdfGeneratorService,
  ) {}

  @Get('live')
  live(): { status: 'ok' } {
    return { status: 'ok' };
  }

  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([
      () => this.database.pingCheck('database').withTimeout(1_500),
      () => this.indicators.check('storage')
        .attempt(async () => {
          try { await this.storage.healthCheck(); }
          catch { throw new Error('PDF storage is unavailable'); }
        })
        .withTimeout(1_500),
      () => this.indicators.check('pdf_renderer')
        .attempt(async () => {
          try { await this.renderer.healthCheck(); }
          catch { throw new Error('PDF renderer is unavailable'); }
        })
        .withTimeout(5_000),
    ]);
  }
}

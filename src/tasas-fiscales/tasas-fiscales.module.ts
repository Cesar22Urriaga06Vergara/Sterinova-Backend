import { Module } from '@nestjs/common';
import { TasasFiscalesController } from './tasas-fiscales.controller.js';
import { TasasFiscalesService } from './tasas-fiscales.service.js';

@Module({
  controllers: [TasasFiscalesController],
  providers: [TasasFiscalesService],
})
export class TasasFiscalesModule {}

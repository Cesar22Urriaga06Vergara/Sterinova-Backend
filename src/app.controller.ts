import { RequireSession } from './rbac/require-session.decorator.js';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @RequireSession()
  getHello(): string {
    return this.appService.getHello();
  }
}

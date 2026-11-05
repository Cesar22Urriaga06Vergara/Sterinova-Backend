import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import type { Response } from 'express';
import { Public } from '../auth/decorators/public.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { UserRole } from '../users/entities/user-role.enum.js';
import { CertificadosService } from './certificados.service.js';
import { PdfGeneratorService } from '../pdf/pdf-generator.service.js';

@Controller('certificados')
@Roles(UserRole.ADMIN, UserRole.CALIDAD)
export class CertificadosController {
  constructor(
    private readonly certificadosService: CertificadosService,
    private readonly pdfGenerator: PdfGeneratorService,
  ) {}

  @Get()
  findAll() {
    return this.certificadosService.findAll();
  }

  @Get('validar/:token')
  @Public()
  @Roles()
  validar(@Param('token') token: string) {
    return this.certificadosService.validarToken(token);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.certificadosService.findOne(id);
  }

  @Get(':id/descargar')
  async descargar(@Param('id', ParseIntPipe) id: number, @Res() response: Response) {
    const certificate = await this.certificadosService.ensurePdfCurrent(id);
    if (!certificate.pdf_url) return response.status(404).send({ message: 'El certificado aún no tiene PDF emitido' });
    const path = await this.pdfGenerator.getAbsolutePath(certificate.pdf_url);
    response.setHeader('Cache-Control', 'private, no-store, no-cache, must-revalidate');
    response.setHeader('Pragma', 'no-cache');
    return response.download(path, `certificado-${certificate.consecutivo}.pdf`);
  }
}

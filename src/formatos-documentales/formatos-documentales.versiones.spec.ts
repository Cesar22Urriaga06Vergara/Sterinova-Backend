import { NotFoundException } from '@nestjs/common';
import { In } from 'typeorm';
import type { PermissionContext } from '../rbac/rbac-authorization.service.js';
import { FormatosDocumentalesController } from './formatos-documentales.controller.js';
import { FormatosDocumentalesService } from './formatos-documentales.service.js';
import { EstadoVersionFormato, type FormatoVersiones } from './entities/formato-versiones.entity.js';
import type { FormatosDocumentales } from './entities/formatos-documentales.entity.js';

const context = {
  policy: { scopeIds: [4] },
} as PermissionContext;

function fixture() {
  const versionsRepository = { find: vi.fn() };
  const service = new FormatosDocumentalesService(
    {} as never,
    versionsRepository as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
  );
  const findOne = vi.spyOn(service, 'findOne').mockResolvedValue({ id: 7 } as FormatosDocumentales);
  return { service, versionsRepository, findOne };
}

describe('GET /formatos-documentales/:id/versiones', () => {
  it('returns frontend fields for versions visible in the requested scope', async () => {
    const { service, versionsRepository, findOne } = fixture();
    versionsRepository.find.mockResolvedValue([
      {
        id: 12,
        version: 2,
        estado: EstadoVersionFormato.PUBLICADA,
        responsable: 'Calidad',
        fecha_version: '2026-11-23',
        rbac_aprobador_id_ref: { id: 3, nombre: 'Ana' },
        rbac_publicado_por_id_ref: { id: 5, nombre: 'Luis' },
      },
      {
        id: 11,
        version: 1,
        estado: EstadoVersionFormato.BORRADOR,
        responsable: 'Calidad',
        fecha_version: null,
        created_at: new Date('2026-11-20T12:00:00.000Z'),
        rbac_aprobador_id_ref: null,
        rbac_publicado_por_id_ref: null,
      },
    ] as FormatoVersiones[]);

    await expect(service.findVersions(7, context)).resolves.toEqual([
      {
        id: 12, version: 2, estado: 'publicada', responsable: 'Calidad',
        fecha: '2026-11-23', aprobador: { id: 3, nombre: 'Ana' },
        publicado_por: { id: 5, nombre: 'Luis' },
      },
      {
        id: 11, version: 1, estado: 'borrador', responsable: 'Calidad',
        fecha: '2026-11-20T12:00:00.000Z', aprobador: null, publicado_por: null,
      },
    ]);
    expect(findOne).toHaveBeenCalledWith(7, context);
    expect(versionsRepository.find).toHaveBeenCalledWith({
      where: { formato_id: 7, scope_id: In([4]) },
      relations: { rbac_aprobador_id_ref: true, rbac_publicado_por_id_ref: true },
      order: { version: 'DESC' },
    });

    const controller = new FormatosDocumentalesController(service);
    await controller.findVersions(7, { rbac: context } as never);
    expect(findOne).toHaveBeenCalledTimes(2);
  });

  it('does not query versions when the format is outside the authorized scope', async () => {
    const { service, versionsRepository, findOne } = fixture();
    findOne.mockRejectedValue(new NotFoundException());

    await expect(service.findVersions(7, context)).rejects.toBeInstanceOf(NotFoundException);
    expect(versionsRepository.find).not.toHaveBeenCalled();
  });
});

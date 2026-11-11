import type { MigrationInterface, QueryRunner } from 'typeorm';
// Frozen phase-1 snapshot. Does not import the runtime catalog or alter legacy roles.
export const FUTURE_PERMISSIONS = [
  'usuarios.area.invitar',
  'usuarios.area.restablecimiento.iniciar',
  'clientes.activar',
  'clientes.inactivar',
  'cotizaciones.aprobar_interna',
  'cotizaciones.enviar',
  'cotizaciones.reasignar',
  'cotizaciones.exportar',
  'logistica.recepciones.registrar',
  'logistica.reempaque.autorizar',
  'logistica.despacho.ejecutar',
  'planta.protocolos.ver',
  'planta.equipos.gestionar',
  'planta.equipos.reactivar',
  'planta.retroactividad.autorizar',
  'planta.reprocesos.registrar',
  'calidad.protocolos.gestionar',
  'calidad.desviaciones.verificar',
  'calidad.desviaciones.aprobar',
  'calidad.liberacion_condicionada.autorizar',
  'calidad.liberacion_desviacion.autorizar',
  'certificados.elaborar',
  'certificados.verificar',
  'certificados.aprobar',
  'certificados.exportar',
  'certificados.restaurar',
  'certificados.anular',
  'formatos.versiones.aprobar',
  'formatos.excepcion.autorizar',
  'sellos.licencias.gestionar',
  'lavanderia.ordenes.ver',
  'lavanderia.proceso.registrar',
] as const;
type Grant = {
  permission: string;
  access: 'OWN' | 'SCOPE';
  descendants: boolean;
};
const grants = (
  codes: readonly string[],
  access: 'OWN' | 'SCOPE' = 'SCOPE',
  descendants = false,
): Grant[] => codes.map((permission) => ({ permission, access, descendants }));
const commercialRead = [
  'clientes.ver',
  'cotizaciones.ver',
  'cotizaciones.previsualizar',
  'cotizaciones.descargar',
  'solicitudes_anulacion.ver',
];
const logistics = [
  'logistica.cotizaciones_disponibles.ver',
  'logistica.ordenes.ver',
  'logistica.ordenes.crear',
  'logistica.ordenes.cambiar_estado',
  'logistica.recepciones.registrar',
  'logistica.despacho.ejecutar',
];
const plant = [
  'planta.ordenes.ver',
  'planta.ciclos.ver',
  'planta.ciclos.crear',
  'planta.protocolos.ver',
];
const qualityRead = [
  'calidad.ciclos.ver',
  'certificados.ver',
  'certificados.descargar',
];
const quality = [
  ...qualityRead,
  'calidad.aprobar',
  'calidad.rechazar',
  'calidad.desviaciones.verificar',
  'formatos.ver',
  'formatos.versiones.crear',
  'formatos.versiones.editar',
  'certificados.verificar',
];
const readAll = [
  ...commercialRead,
  'logistica.cotizaciones_disponibles.ver',
  'logistica.ordenes.ver',
  'planta.ordenes.ver',
  'planta.ciclos.ver',
  'planta.protocolos.ver',
  ...qualityRead,
  'formatos.ver',
  'sellos.ver',
  'auditoria.ver',
  'usuarios.ver',
];
export const BACKEND_ROLES = [
  {
    code: 'gerente_general',
    global: true,
    grants: grants([...readAll, 'formatos.versiones.aprobar'], 'SCOPE', true),
  },
  {
    code: 'admin_comercial',
    global: false,
    grants: grants(
      [
        ...commercialRead,
        'usuarios.ver',
        'asignaciones.gestionar',
        'usuarios.area.invitar',
        'usuarios.area.restablecimiento.iniciar',
        'clientes.crear',
        'clientes.editar',
        'clientes.importar',
        'clientes.activar',
        'clientes.inactivar',
        'cotizaciones.crear',
        'cotizaciones.editar',
        'cotizaciones.aprobar_interna',
        'cotizaciones.enviar',
        'cotizaciones.aceptar',
        'cotizaciones.emitir',
        'cotizaciones.reasignar',
        'solicitudes_anulacion.crear',
        'solicitudes_anulacion.aprobar',
      ],
      'SCOPE',
      true,
    ),
  },
  {
    code: 'asesor_comercial',
    global: false,
    grants: [
      ...grants([
        'clientes.ver',
        'clientes.crear',
        'clientes.editar',
        'clientes.importar',
        'clientes.activar',
        'clientes.inactivar',
        'cotizaciones.ver',
        'cotizaciones.crear',
        'cotizaciones.previsualizar',
        'cotizaciones.descargar',
      ]),
      ...grants(
        [
          'cotizaciones.editar',
          'cotizaciones.enviar',
          'cotizaciones.aceptar',
          'cotizaciones.emitir',
          'solicitudes_anulacion.crear',
          'solicitudes_anulacion.ver',
        ],
        'OWN',
      ),
    ],
  },
  {
    code: 'admin_logistica',
    global: false,
    grants: grants(
      [
        ...logistics,
        'logistica.reempaque.autorizar',
        'usuarios.ver',
        'asignaciones.gestionar',
        'usuarios.area.invitar',
        'usuarios.area.restablecimiento.iniciar',
      ],
      'SCOPE',
      true,
    ),
  },
  { code: 'operador_logistica', global: false, grants: grants(logistics) },
  {
    code: 'admin_planta',
    global: false,
    grants: grants(
      [
        ...plant,
        'planta.equipos.gestionar',
        'planta.equipos.reactivar',
        'usuarios.ver',
        'asignaciones.gestionar',
        'usuarios.area.invitar',
        'usuarios.area.restablecimiento.iniciar',
      ],
      'SCOPE',
      true,
    ),
  },
  {
    code: 'operario_planta',
    global: false,
    grants: grants([...plant, 'certificados.elaborar']),
  },
  {
    code: 'admin_calidad',
    global: false,
    grants: grants(
      [
        ...quality,
        'calidad.protocolos.gestionar',
        'calidad.desviaciones.aprobar',
        'planta.retroactividad.autorizar',
        'usuarios.ver',
        'asignaciones.gestionar',
        'usuarios.area.invitar',
        'usuarios.area.restablecimiento.iniciar',
      ],
      'SCOPE',
      true,
    ),
  },
  { code: 'analista_calidad', global: false, grants: grants(quality) },
  {
    code: 'director_tecnico',
    global: false,
    grants: grants([
      ...qualityRead,
      'formatos.ver',
      'calidad.protocolos.gestionar',
      'calidad.liberacion_condicionada.autorizar',
      'calidad.liberacion_desviacion.autorizar',
      'certificados.aprobar',
      'formatos.versiones.aprobar',
    ]),
  },
  { code: 'gerente_calidad', global: false, grants: grants(qualityRead) },
  {
    code: 'auditor',
    global: true,
    grants: grants(
      [...readAll, 'cotizaciones.exportar', 'certificados.exportar'],
      'SCOPE',
      true,
    ),
  },
  {
    code: 'admin_lavanderia',
    global: false,
    grants: grants(
      [
        'lavanderia.ordenes.ver',
        'lavanderia.proceso.registrar',
        'usuarios.ver',
        'asignaciones.gestionar',
        'usuarios.area.invitar',
        'usuarios.area.restablecimiento.iniciar',
      ],
      'SCOPE',
      true,
    ),
  },
  {
    code: 'operario_lavanderia',
    global: false,
    grants: grants(['lavanderia.ordenes.ver', 'lavanderia.proceso.registrar']),
  },
] as const;

export class SeedBackendRoles1794312001000 implements MigrationInterface {
  async up(runner: QueryRunner): Promise<void> {
    // Refuse collisions rather than overwrite a locally configured profile.
    for (const role of BACKEND_ROLES) {
      const rows = (await runner.query(
        'SELECT id FROM rbac_roles WHERE code = ?',
        [role.code],
      )) as unknown[];
      if (rows.length)
        throw new Error(
          `Perfil preexistente: ${role.code}; conciliar antes de sembrar.`,
        );
    }
    for (const code of FUTURE_PERMISSIONS) {
      await runner.query(
        'INSERT INTO rbac_permissions (code, module, label, active, is_dynamic) VALUES (?, ?, ?, 0, 0)',
        [code, code.split('.')[0], code],
      );
    }
    for (const role of BACKEND_ROLES) {
      await runner.query(
        "INSERT INTO rbac_roles (code, name, kind, active, global_assignable) VALUES (?, ?, 'STANDARD', 0, ?)",
        [role.code, role.code.replaceAll('_', ' '), role.global ? 1 : 0],
      );
      for (const grant of role.grants) {
        await runner.query(
          `INSERT INTO rbac_role_permissions (role_id, permission_code, resource_access, include_descendants)
          SELECT id, ?, ?, ? FROM rbac_roles WHERE code = ? AND kind = 'STANDARD' AND active = 0`,
          [
            grant.permission,
            grant.access,
            grant.descendants ? 1 : 0,
            role.code,
          ],
        );
      }
    }
  }
  async down(_runner: QueryRunner): Promise<void> {
    throw new Error(
      'No eliminar perfiles ni concesiones automaticamente; usar migracion correctiva.',
    );
  }
}

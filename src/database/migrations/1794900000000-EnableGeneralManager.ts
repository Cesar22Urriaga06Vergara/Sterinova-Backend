import type { MigrationInterface, QueryRunner } from 'typeorm';

/** Activates a role template; deliberately does not appoint any real account. */
export class EnableGeneralManager1794900000000 implements MigrationInterface {
  async up(runner: QueryRunner): Promise<void> {
    const [role] = await runner.query(
      "SELECT id,kind,global_assignable FROM rbac_roles WHERE code='gerente_general'",
    );
    if (
      !role ||
      role.kind !== 'STANDARD' ||
      Number(role.global_assignable) !== 1
    )
      throw new Error(
        'Conciliar el perfil gerente_general antes de habilitar Gerencia',
      );
    const capabilities = [
      ['gerencia.metricas.ver', 'Consultar métricas y actividad gerencial'],
      [
        'gerencia.administradores.gestionar',
        'Gestionar administradores de áreas',
      ],
    ];
    for (const [code, label] of capabilities) {
      await runner.query(
        "INSERT INTO rbac_permissions(code,module,label,active,is_dynamic) VALUES(?,'gerencia',?,1,0) ON DUPLICATE KEY UPDATE active=1",
        [code, label],
      );
    }
    // planta.protocolos.ver se siembra como permiso futuro inactivo; Gerencia
    // lo necesita activo para consultar protocolos (matriz §9).
    await runner.query(
      "UPDATE rbac_permissions SET active=1 WHERE code='planta.protocolos.ver'",
    );
    // The approved managerial role supervises and delegates; it does not approve
    // technical work or inherit platform privileges, including older grants.
    await runner.query('DELETE FROM rbac_role_permissions WHERE role_id=?', [
      role.id,
    ]);
    const permissions = [
      'gerencia.metricas.ver',
      'gerencia.administradores.gestionar',
      'usuarios.ver',
      'usuarios.identidad.gestionar',
      'asignaciones.gestionar',
      'clientes.ver',
      'cotizaciones.ver',
      'logistica.cotizaciones_disponibles.ver',
      'logistica.ordenes.ver',
      'planta.ordenes.ver',
      'planta.ciclos.ver',
      'planta.protocolos.ver',
      'calidad.ciclos.ver',
      'certificados.ver',
      'certificados.descargar',
      'auditoria.ver',
      'formatos.ver',
      'formatos.versiones.aprobar',
      'sellos.ver',
    ];
    for (const permission of permissions)
      await runner.query(
        "INSERT INTO rbac_role_permissions(role_id,permission_code,resource_access,include_descendants) VALUES(?,?,'SCOPE',1) ON DUPLICATE KEY UPDATE resource_access='SCOPE',include_descendants=1",
        [role.id, permission],
      );
    await runner.query('UPDATE rbac_roles SET name=?,active=1 WHERE id=?', [
      'Gerente General',
      role.id,
    ]);
    // Technical recovery retains explicit access without turning the manager
    // into a platform administrator or altering the other standard profiles.
    for (const [permission] of capabilities)
      await runner.query(
        "INSERT INTO rbac_role_permissions(role_id,permission_code,resource_access,include_descendants) SELECT id,?,'SCOPE',1 FROM rbac_roles WHERE code='superadmin' AND kind='PLATFORM' ON DUPLICATE KEY UPDATE resource_access='SCOPE',include_descendants=1",
        [permission],
      );
  }
  async down(): Promise<void> {
    throw new Error(
      'No retirar automáticamente concesiones gerenciales; usar una migración correctiva',
    );
  }
}

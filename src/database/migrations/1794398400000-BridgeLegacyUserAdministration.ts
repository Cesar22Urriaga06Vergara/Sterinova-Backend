import type { MigrationInterface, QueryRunner } from 'typeorm';

/** One-time explicit transition; never infer runtime privileges from usuarios.rol. */
export class BridgeLegacyUserAdministration1794398400000 implements MigrationInterface {
  async up(runner: QueryRunner): Promise<void> {
    await runner.query('UPDATE rbac_user_sync_lock SET version=version+1 WHERE id=1');
    const roots = await runner.query("SELECT id FROM rbac_scopes WHERE kind='GLOBAL' AND parent_id IS NULL AND active=1 FOR UPDATE");
    if (roots.length !== 1) throw new Error('Se requiere una raíz GLOBAL activa para la transición legacy');
    const permissions = ['usuarios.ver', 'usuarios.identidad.gestionar', 'asignaciones.gestionar', 'roles.gestionar'];
    const active = await runner.query(`SELECT code FROM rbac_permissions WHERE active=1 AND code IN (${permissions.map(() => '?').join(',')})`, permissions);
    if (active.length !== permissions.length) throw new Error('Permisos técnicos inactivos o ausentes; conciliar antes de la transición legacy');
    // Unique code collisions abort the transaction; never replace a configured local role.
    const role = await runner.query(`INSERT INTO rbac_roles(code,name,kind,active,global_assignable,legacy_role)
      VALUES('legacy_admin_transition','Administración legacy temporal','STANDARD',1,1,'Admin')`);
    for (const permission of permissions)
      await runner.query('INSERT INTO rbac_role_permissions(role_id,permission_code,resource_access,include_descendants) VALUES(?,?,\'SCOPE\',?)',
        [role.insertId, permission, permission === 'usuarios.ver' ? 1 : 0]);
    const users = await runner.query(`SELECT u.id FROM usuarios u WHERE u.activo=1 AND u.rol='Admin'
      AND NOT EXISTS(SELECT 1 FROM rbac_user_role_assignments a WHERE a.user_id=u.id)
      AND NOT EXISTS(SELECT 1 FROM rbac_platform_owner o WHERE o.user_id=u.id) FOR UPDATE`);
    try {
      for (const user of users) {
        await runner.query('SET @rbac_write_user=?', [user.id]);
        await runner.query(`INSERT INTO rbac_user_role_assignments
          (user_id,role_id,role_kind,scope_id,scope_kind,role_global_assignable,active)
          VALUES(?,?,'STANDARD',?,'GLOBAL',1,1)`, [user.id, role.insertId, roots[0].id]);
        await runner.query('UPDATE usuarios SET rbac_version=rbac_version+1 WHERE id=?', [user.id]);
        await runner.query(`INSERT INTO auditoria(usuario_id,entidad,entidad_id,accion,detalle,scope_id)
          VALUES(NULL,'rbac_user_role_assignments',?,'editar',?,?)`, [user.id,
          JSON.stringify({ migration: 'BridgeLegacyUserAdministration1794398400000', role: 'legacy_admin_transition', reason: 'Admin activo sin historial RBAC; transición explícita de administración de usuarios' }), roots[0].id]);
      }
    } finally {
      await runner.query('SET @rbac_write_user=NULL');
    }
  }

  async down(): Promise<void> {
    throw new Error('No revocar administración automáticamente; usar migración correctiva con revisión de asignaciones');
  }
}

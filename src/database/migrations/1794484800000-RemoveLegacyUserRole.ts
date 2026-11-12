import type { MigrationInterface, QueryRunner } from 'typeorm';
/** Corrective migration: historical migrations remain immutable. */
export class RemoveLegacyUserRole1794484800000 implements MigrationInterface {
 transaction = false;
 async up(r: QueryRunner): Promise<void> {
  await r.query('DROP PROCEDURE IF EXISTS rbac_set_user_roles');
  await r.query(`CREATE PROCEDURE rbac_set_user_roles(IN uid INT, IN desired LONGTEXT, IN actor INT, IN expected_version INT)
      SQL SECURITY DEFINER
      BEGIN
        DECLARE idx INT DEFAULT 0; DECLARE count_items INT; DECLARE current_version INT;
        DECLARE rid INT; DECLARE sid INT; DECLARE rkind VARCHAR(20); DECLARE skind VARCHAR(20); DECLARE eligible BOOLEAN;
        DECLARE valid BOOLEAN; DECLARE owner_uid INT; DECLARE owner_seen BOOLEAN DEFAULT FALSE; DECLARE bootstrap BOOLEAN DEFAULT FALSE;
        DECLARE before_roles LONGTEXT; DECLARE old_context BIGINT DEFAULT NULL;
        DECLARE EXIT HANDLER FOR SQLEXCEPTION
          BEGIN ROLLBACK; SET @rbac_write_user=old_context; RESIGNAL; END;
        SET old_context=@rbac_write_user;
        START TRANSACTION;
        UPDATE rbac_user_sync_lock SET version=version+1 WHERE id=1;
        SET current_version=(SELECT rbac_version FROM usuarios WHERE id=uid);
        IF current_version IS NULL THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Usuario inexistente'; END IF;
        SELECT rbac_version INTO current_version FROM usuarios WHERE id=uid FOR UPDATE;
        IF expected_version IS NOT NULL AND expected_version<>current_version THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Version RBAC obsoleta; recargue las asignaciones'; END IF;
        -- Bootstrap is possible only when no RBAC administrator has ever been assigned.
        SET bootstrap=(actor IS NULL AND NOT EXISTS(SELECT 1 FROM rbac_platform_owner) AND NOT EXISTS(SELECT 1 FROM rbac_user_role_assignments));
        IF NOT bootstrap AND (actor IS NULL OR NOT rbac_is_global_admin(actor)) THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Actor sin administracion RBAC global'; END IF;
        IF desired IS NULL OR JSON_VALID(desired)=0 THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Asignaciones JSON invalidas'; END IF;
        IF JSON_TYPE(desired)<>'ARRAY' THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Se requiere un array de asignaciones'; END IF;
        SET count_items=JSON_LENGTH(desired);
        IF count_items<1 OR count_items>100 THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Asigne entre 1 y 100 combinaciones de rol y ambito'; END IF;
        SET before_roles=(SELECT JSON_ARRAYAGG(JSON_OBJECT('role_id',role_id,'scope_id',scope_id)) FROM (
          SELECT role_id,scope_id FROM rbac_user_role_assignments WHERE user_id=uid AND active=1 UNION ALL SELECT role_id,scope_id FROM rbac_platform_owner WHERE user_id=uid
        ) current_roles);
        SET @rbac_write_user=uid;
        UPDATE rbac_user_role_assignments SET active=0 WHERE user_id=uid;
        WHILE idx<count_items DO
          IF JSON_TYPE(JSON_EXTRACT(desired,CONCAT('$[',idx,'].role_id')))<>'INTEGER' OR JSON_TYPE(JSON_EXTRACT(desired,CONCAT('$[',idx,'].scope_id')))<>'INTEGER' THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='role_id y scope_id deben ser enteros'; END IF;
          SET rid=JSON_VALUE(desired,CONCAT('$[',idx,'].role_id')); SET sid=JSON_VALUE(desired,CONCAT('$[',idx,'].scope_id'));
          SET rkind=NULL; SET skind=NULL;
          SELECT kind,global_assignable INTO rkind,eligible FROM rbac_roles WHERE id=rid AND active=1 FOR UPDATE;
          SELECT kind INTO skind FROM rbac_scopes WHERE id=sid AND active=1 FOR UPDATE;
          IF rkind IS NULL OR skind IS NULL THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Perfil o ambito inexistente o inactivo'; END IF;
          -- Walk the actual hierarchy: closure rows are not trusted for authorization.
          BEGIN
            DECLARE cursor_id INT DEFAULT sid; DECLARE parent_scope INT; DECLARE node_active BOOLEAN; DECLARE node_kind VARCHAR(20); DECLARE depth_count INT DEFAULT 0;
            SET valid=FALSE;
            WHILE cursor_id IS NOT NULL AND depth_count<100 DO
              SET node_kind=NULL;
              SELECT parent_id,active,kind INTO parent_scope,node_active,node_kind FROM rbac_scopes WHERE id=cursor_id FOR UPDATE;
              IF node_kind IS NULL OR node_active=0 THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Jerarquia de ambitos inactiva o invalida'; END IF;
              IF parent_scope IS NULL THEN SET valid=(node_kind='GLOBAL'); END IF;
              SET cursor_id=parent_scope; SET depth_count=depth_count+1;
            END WHILE;
            IF NOT valid OR cursor_id IS NOT NULL THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Jerarquia de ambitos invalida'; END IF;
          END;
          IF (rkind='PLATFORM' AND skind<>'GLOBAL') OR (rkind='STANDARD' AND skind='GLOBAL' AND eligible=0) THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='El perfil no admite este ambito'; END IF;
          IF rkind='PLATFORM' THEN
            SET owner_uid=(SELECT user_id FROM rbac_platform_owner WHERE id=1);
            IF owner_uid IS NOT NULL AND owner_uid<>uid THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Ya existe un titular de plataforma; transferencia explicita requerida'; END IF;
            IF owner_seen THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Asignacion duplicada'; END IF;
            INSERT INTO rbac_platform_owner (id,user_id,role_id,scope_id) VALUES (1,uid,rid,sid) ON DUPLICATE KEY UPDATE user_id=VALUES(user_id);
            SET owner_seen=TRUE;
          ELSE
            IF EXISTS(SELECT 1 FROM rbac_user_role_assignments WHERE user_id=uid AND role_id=rid AND scope_id=sid AND active=1) THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Asignacion duplicada'; END IF;
            INSERT INTO rbac_user_role_assignments (user_id,role_id,role_kind,scope_id,scope_kind,role_global_assignable,active)
              VALUES(uid,rid,'STANDARD',sid,skind,eligible,1) ON DUPLICATE KEY UPDATE active=1;
          END IF;
          SET idx=idx+1;
        END WHILE;
        IF NOT owner_seen THEN DELETE FROM rbac_platform_owner WHERE user_id=uid; END IF;
        UPDATE usuarios SET rbac_version=rbac_version+1 WHERE id=uid;
        IF NOT EXISTS(SELECT 1 FROM usuarios WHERE rbac_is_global_admin(id)=1) THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Debe permanecer al menos una cuenta administradora global activa'; END IF;
        INSERT INTO auditoria(usuario_id,entidad,entidad_id,accion,detalle) VALUES(actor,'rbac_user_role_assignments',uid,'editar',JSON_OBJECT('before',before_roles,'after',desired,'database_actor',USER(),'version',current_version+1));
        SET @rbac_write_user=old_context;
        COMMIT;
      END`);
  await r.query('DROP TRIGGER IF EXISTS usuarios_rbac_guard_update');
  await r.query(`CREATE TRIGGER usuarios_rbac_guard_update BEFORE UPDATE ON usuarios FOR EACH ROW BEGIN
    IF OLD.activo=1 AND NEW.activo=0 THEN
      UPDATE rbac_user_sync_lock SET version=version+1 WHERE id=1;
      IF rbac_is_global_admin(OLD.id)=1 AND NOT EXISTS(SELECT 1 FROM usuarios u WHERE u.id<>OLD.id AND rbac_is_global_admin(u.id)=1) THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='No se puede desactivar la ultima cuenta administradora global'; END IF;
    END IF;
  END`);
  await r.query('DROP FUNCTION IF EXISTS rbac_user_legacy_role');
  if (await r.hasColumn('usuarios','rol')) await r.query('ALTER TABLE usuarios DROP COLUMN rol');
  if (await r.hasColumn('rbac_roles','legacy_role')) await r.query('ALTER TABLE rbac_roles DROP COLUMN legacy_role');
  await r.query(`INSERT INTO rbac_roles(code,name,kind,active,global_assignable) VALUES('admin_general','Admin General','STANDARD',1,1)`);
  // Explicitly inherit the existing platform grants, never arbitrary future permissions.
  await r.query(`INSERT INTO rbac_role_permissions(role_id,permission_code,resource_access,include_descendants)
    SELECT target.id,g.permission_code,g.resource_access,g.include_descendants FROM rbac_roles source
    JOIN rbac_role_permissions g ON g.role_id=source.id JOIN rbac_roles target ON target.code='admin_general'
    WHERE source.code='superadmin'`);
  await r.query('UPDATE rbac_roles SET name=?,active=1 WHERE code=?', ["Admin Comercial","admin_comercial"]);
  await r.query('UPDATE rbac_roles SET name=?,active=1 WHERE code=?', ["Asesor Comercial","asesor_comercial"]);
  await r.query('UPDATE rbac_roles SET name=?,active=1 WHERE code=?', ["Admin Logística","admin_logistica"]);
  await r.query('UPDATE rbac_roles SET name=?,active=1 WHERE code=?', ["Asesor Logística","operador_logistica"]);
  await r.query('UPDATE rbac_roles SET name=?,active=1 WHERE code=?', ["Admin Planta","admin_planta"]);
  await r.query('UPDATE rbac_roles SET name=?,active=1 WHERE code=?', ["Asesor Planta","operario_planta"]);
  await r.query('UPDATE rbac_roles SET name=?,active=1 WHERE code=?', ["Admin Calidad","admin_calidad"]);
  await r.query('UPDATE rbac_roles SET name=?,active=1 WHERE code=?', ["Asesor Calidad","analista_calidad"]);
  await r.query('UPDATE rbac_roles SET name=?,active=1 WHERE code=?', ["Admin Lavandería","admin_lavanderia"]);
  await r.query('UPDATE rbac_roles SET name=?,active=1 WHERE code=?', ["Asesor Lavandería","operario_lavanderia"]);
  await r.query('UPDATE rbac_roles SET name=?,active=1 WHERE code=?', ["Director Técnico","director_tecnico"]);
  await r.query('UPDATE rbac_roles SET name=?,active=1 WHERE code=?', ["Auditor","auditor"]);
  await r.query('UPDATE rbac_roles SET name=?,active=1 WHERE code=?', ["Gestor Documental","gestor_documental"]);
  // These actions already have handlers and authorization checks in this release.
  await r.query("UPDATE rbac_permissions SET active=1 WHERE code IN ('logistica.recepciones.registrar','planta.protocolos.ver')");
  await r.query(`INSERT IGNORE INTO rbac_role_permissions(role_id,permission_code,resource_access,include_descendants)
    SELECT id,p.code,'SCOPE',1 FROM rbac_roles JOIN rbac_permissions p ON p.code IN ('logistica.recepciones.registrar','planta.protocolos.ver') WHERE rbac_roles.code='admin_general'`);
 }
 async down(): Promise<void> { throw new Error('No restaurar autorización legacy; utilizar una migración correctiva o respaldo verificado'); }
}

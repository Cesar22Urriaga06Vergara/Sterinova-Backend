import type { MigrationInterface, QueryRunner } from 'typeorm';

// Frozen migration snapshot: do not import the runtime catalog or change historical seeds.
export const INITIAL_RBAC_PERMISSIONS = [
  {
    code: 'usuarios.ver',
    module: 'accesos',
    label: 'Consultar usuarios del ámbito',
  },
  {
    code: 'usuarios.identidad.gestionar',
    module: 'accesos',
    label: 'Gestionar identidades globales',
  },
  {
    code: 'asignaciones.gestionar',
    module: 'accesos',
    label: 'Gestionar asignaciones delegadas',
  },
  {
    code: 'roles.gestionar',
    module: 'accesos',
    label: 'Configurar roles y sus permisos',
  },
  {
    code: 'ambitos.gestionar',
    module: 'accesos',
    label: 'Configurar estructura organizativa',
  },
  { code: 'clientes.ver', module: 'comercial', label: 'Consultar clientes' },
  { code: 'clientes.crear', module: 'comercial', label: 'Crear clientes' },
  { code: 'clientes.editar', module: 'comercial', label: 'Editar clientes' },
  {
    code: 'clientes.importar',
    module: 'comercial',
    label: 'Importar clientes',
  },
  {
    code: 'clientes.eliminar',
    module: 'comercial',
    label: 'Eliminar clientes sin referencias',
  },
  {
    code: 'cotizaciones.ver',
    module: 'comercial',
    label: 'Consultar cotizaciones comerciales',
  },
  {
    code: 'cotizaciones.crear',
    module: 'comercial',
    label: 'Crear borradores de cotización',
  },
  {
    code: 'cotizaciones.editar',
    module: 'comercial',
    label: 'Editar borradores de cotización',
  },
  {
    code: 'cotizaciones.eliminar',
    module: 'comercial',
    label: 'Eliminar borradores de cotización',
  },
  {
    code: 'cotizaciones.previsualizar',
    module: 'comercial',
    label: 'Previsualizar cotizaciones',
  },
  {
    code: 'cotizaciones.emitir',
    module: 'comercial',
    label: 'Emitir cotizaciones',
  },
  {
    code: 'cotizaciones.descargar',
    module: 'comercial',
    label: 'Descargar cotizaciones oficiales',
  },
  {
    code: 'cotizaciones.aceptar',
    module: 'comercial',
    label: 'Registrar aceptación del cliente',
  },
  {
    code: 'logistica.cotizaciones_disponibles.ver',
    module: 'logistica',
    label: 'Consultar expedientes disponibles para Logística',
  },
  {
    code: 'logistica.ordenes.ver',
    module: 'logistica',
    label: 'Consultar órdenes logísticas',
  },
  {
    code: 'logistica.ordenes.crear',
    module: 'logistica',
    label: 'Crear órdenes logísticas',
  },
  {
    code: 'logistica.ordenes.cambiar_estado',
    module: 'logistica',
    label: 'Avanzar órdenes logísticas',
  },
  {
    code: 'planta.ordenes.ver',
    module: 'planta',
    label: 'Consultar órdenes de Planta',
  },
  {
    code: 'planta.ciclos.ver',
    module: 'planta',
    label: 'Consultar ciclos de Planta',
  },
  {
    code: 'planta.ciclos.crear',
    module: 'planta',
    label: 'Registrar ciclos de Planta',
  },
  {
    code: 'calidad.ciclos.ver',
    module: 'calidad',
    label: 'Consultar ciclos para Calidad',
  },
  {
    code: 'calidad.aprobar',
    module: 'calidad',
    label: 'Aprobar ciclos de Calidad',
  },
  {
    code: 'calidad.rechazar',
    module: 'calidad',
    label: 'Rechazar ciclos de Calidad',
  },
  {
    code: 'certificados.ver',
    module: 'calidad',
    label: 'Consultar certificados',
  },
  {
    code: 'certificados.descargar',
    module: 'calidad',
    label: 'Descargar certificados oficiales',
  },
  {
    code: 'auditoria.ver',
    module: 'auditoria',
    label: 'Consultar eventos de auditoría',
  },
  {
    code: 'formatos.ver',
    module: 'documentos',
    label: 'Consultar formatos documentales',
  },
  {
    code: 'formatos.crear',
    module: 'documentos',
    label: 'Crear formatos documentales',
  },
  {
    code: 'formatos.editar',
    module: 'documentos',
    label: 'Editar formatos documentales',
  },
  {
    code: 'formatos.eliminar',
    module: 'documentos',
    label: 'Eliminar formatos sin referencias',
  },
  {
    code: 'formatos.versiones.crear',
    module: 'documentos',
    label: 'Crear versiones de formato',
  },
  {
    code: 'formatos.versiones.editar',
    module: 'documentos',
    label: 'Editar versiones borrador',
  },
  {
    code: 'formatos.versiones.publicar',
    module: 'documentos',
    label: 'Gestionar estados de versión',
  },
  {
    code: 'sellos.ver',
    module: 'documentos',
    label: 'Consultar sellos de certificación',
  },
  {
    code: 'sellos.crear',
    module: 'documentos',
    label: 'Crear sellos de certificación',
  },
  {
    code: 'sellos.editar',
    module: 'documentos',
    label: 'Editar sellos de certificación',
  },
  {
    code: 'sellos.desactivar',
    module: 'documentos',
    label: 'Desactivar sellos de certificación',
  },
] as const;

type InitialGrant = {
  permission: string;
  resourceAccess: 'OWN' | 'SCOPE';
  includeDescendants: boolean;
};
type InitialRole = {
  code: string;
  name: string;
  kind: 'STANDARD' | 'PLATFORM';
  grants: readonly InitialGrant[];
};

function grants(
  permissions: readonly string[],
  resourceAccess: 'OWN' | 'SCOPE' = 'SCOPE',
  includeDescendants = false,
): InitialGrant[] {
  return permissions.map((permission) => ({
    permission,
    resourceAccess,
    includeDescendants,
  }));
}

export const INITIAL_RBAC_ROLES: readonly InitialRole[] = [
  {
    code: 'superadmin',
    name: 'Titular de plataforma',
    kind: 'PLATFORM',
    grants: grants(
      INITIAL_RBAC_PERMISSIONS.map(({ code }) => code),
      'SCOPE',
      true,
    ),
  },
  {
    code: 'admin_area',
    name: 'Administración de área',
    kind: 'STANDARD',
    grants: grants(['usuarios.ver', 'asignaciones.gestionar'], 'SCOPE', true),
  },
  {
    code: 'comercial',
    name: 'Comercial',
    kind: 'STANDARD',
    grants: [
      ...grants([
        'clientes.ver',
        'clientes.crear',
        'clientes.editar',
        'clientes.importar',
        'cotizaciones.ver',
        'cotizaciones.crear',
        'cotizaciones.previsualizar',
        'cotizaciones.descargar',
        'cotizaciones.aceptar',
      ]),
      ...grants(['cotizaciones.editar', 'cotizaciones.eliminar'], 'OWN'),
    ],
  },
  {
    code: 'emisor_comercial',
    name: 'Emisión comercial',
    kind: 'STANDARD',
    grants: grants(['cotizaciones.emitir']),
  },
  {
    code: 'logistica',
    name: 'Logística',
    kind: 'STANDARD',
    grants: grants([
      'logistica.cotizaciones_disponibles.ver',
      'logistica.ordenes.ver',
      'logistica.ordenes.crear',
      'logistica.ordenes.cambiar_estado',
    ]),
  },
  {
    code: 'planta',
    name: 'Planta',
    kind: 'STANDARD',
    grants: grants([
      'planta.ordenes.ver',
      'planta.ciclos.ver',
      'planta.ciclos.crear',
    ]),
  },
  {
    code: 'calidad',
    name: 'Calidad',
    kind: 'STANDARD',
    grants: grants([
      'calidad.ciclos.ver',
      'calidad.aprobar',
      'calidad.rechazar',
      'certificados.ver',
      'certificados.descargar',
    ]),
  },
  {
    code: 'auditor_calidad',
    name: 'Auditoría de Calidad',
    kind: 'STANDARD',
    grants: grants(['calidad.ciclos.ver', 'certificados.ver', 'auditoria.ver']),
  },
  {
    code: 'gestor_documental',
    name: 'Gestión documental',
    kind: 'STANDARD',
    grants: grants([
      'formatos.ver',
      'formatos.crear',
      'formatos.editar',
      'formatos.eliminar',
      'formatos.versiones.crear',
      'formatos.versiones.editar',
      'formatos.versiones.publicar',
      'sellos.ver',
      'sellos.crear',
      'sellos.editar',
      'sellos.desactivar',
    ]),
  },
];

const TABLES = [
  'rbac_scopes',
  'rbac_scope_closure',
  'rbac_roles',
  'rbac_permissions',
  'rbac_role_permissions',
  'rbac_user_role_assignments',
  'rbac_platform_owner',
];

export class AddScopedRbac1794096000000 implements MigrationInterface {
  name = 'AddScopedRbac1794096000000';
  transaction = false;

  async up(queryRunner: QueryRunner): Promise<void> {
    const existing = await Promise.all(
      TABLES.map((name) => queryRunner.hasTable(name)),
    );
    if (existing.some(Boolean)) {
      throw new Error(
        'Esquema RBAC preexistente o parcial: revisar y conciliar antes de emitir DDL.',
      );
    }

    await queryRunner.query(`
      CREATE TABLE rbac_scopes (
        id INT NOT NULL AUTO_INCREMENT,
        code VARCHAR(100) NOT NULL,
        name VARCHAR(160) NOT NULL,
        kind ENUM('GLOBAL','DEPARTMENT','TEAM','PLANT') NOT NULL,
        parent_id INT NULL,
        active TINYINT(1) NOT NULL DEFAULT 1,
        global_slot TINYINT GENERATED ALWAYS AS (CASE WHEN kind = 'GLOBAL' THEN 1 ELSE NULL END) VIRTUAL,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        UNIQUE KEY UQ_rbac_scopes_code (code),
        UNIQUE KEY UQ_rbac_scopes_id_kind (id, kind),
        UNIQUE KEY UQ_rbac_scopes_global_slot (global_slot),
        KEY IDX_rbac_scopes_parent_active (parent_id, active),
        CONSTRAINT CHK_rbac_scopes_root CHECK (
          (kind = 'GLOBAL' AND parent_id IS NULL) OR (kind <> 'GLOBAL' AND parent_id IS NOT NULL)
        ),
        CONSTRAINT FK_rbac_scopes_parent FOREIGN KEY (parent_id) REFERENCES rbac_scopes(id) ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin
    `);
    await queryRunner.query(`
      CREATE TABLE rbac_scope_closure (
        ancestor_id INT NOT NULL,
        descendant_id INT NOT NULL,
        depth INT UNSIGNED NOT NULL,
        PRIMARY KEY (ancestor_id, descendant_id),
        KEY IDX_rbac_closure_descendant (descendant_id, ancestor_id),
        CONSTRAINT CHK_rbac_closure_depth CHECK (
          (ancestor_id = descendant_id AND depth = 0) OR (ancestor_id <> descendant_id AND depth > 0)
        ),
        CONSTRAINT FK_rbac_closure_ancestor FOREIGN KEY (ancestor_id) REFERENCES rbac_scopes(id) ON DELETE RESTRICT,
        CONSTRAINT FK_rbac_closure_descendant FOREIGN KEY (descendant_id) REFERENCES rbac_scopes(id) ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin
    `);
    await queryRunner.query(`
      CREATE TABLE rbac_roles (
        id INT NOT NULL AUTO_INCREMENT,
        code VARCHAR(100) NOT NULL,
        name VARCHAR(160) NOT NULL,
        kind ENUM('STANDARD','PLATFORM') NOT NULL DEFAULT 'STANDARD',
        active TINYINT(1) NOT NULL DEFAULT 1,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        UNIQUE KEY UQ_rbac_roles_code (code),
        UNIQUE KEY UQ_rbac_roles_id_kind (id, kind)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin
    `);
    await queryRunner.query(`
      CREATE TABLE rbac_permissions (
        code VARCHAR(100) NOT NULL,
        module VARCHAR(50) NOT NULL,
        label VARCHAR(160) NOT NULL,
        active TINYINT(1) NOT NULL DEFAULT 1,
        PRIMARY KEY (code)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin
    `);
    await queryRunner.query(`
      CREATE TABLE rbac_role_permissions (
        role_id INT NOT NULL,
        permission_code VARCHAR(100) NOT NULL,
        resource_access ENUM('OWN','SCOPE') NOT NULL DEFAULT 'SCOPE',
        include_descendants TINYINT(1) NOT NULL DEFAULT 0,
        PRIMARY KEY (role_id, permission_code),
        CONSTRAINT FK_rbac_grant_role FOREIGN KEY (role_id) REFERENCES rbac_roles(id) ON DELETE RESTRICT,
        CONSTRAINT FK_rbac_grant_permission FOREIGN KEY (permission_code) REFERENCES rbac_permissions(code) ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin
    `);
    await queryRunner.query(`
      CREATE TABLE rbac_user_role_assignments (
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        role_id INT NOT NULL,
        role_kind ENUM('STANDARD','PLATFORM') NOT NULL DEFAULT 'STANDARD',
        scope_id INT NOT NULL,
        scope_kind ENUM('GLOBAL','DEPARTMENT','TEAM','PLANT') NOT NULL,
        active TINYINT(1) NOT NULL DEFAULT 1,
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        UNIQUE KEY UQ_rbac_assignment_user_role_scope (user_id, role_id, scope_id),
        KEY IDX_rbac_assignment_user_active (user_id, active),
        KEY IDX_rbac_assignment_scope_active_role (scope_id, active, role_id),
        CONSTRAINT CHK_rbac_assignment_role CHECK (role_kind = 'STANDARD'),
        CONSTRAINT CHK_rbac_assignment_scope CHECK (scope_kind <> 'GLOBAL'),
        CONSTRAINT FK_rbac_assignment_user FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
        CONSTRAINT FK_rbac_assignment_role FOREIGN KEY (role_id, role_kind) REFERENCES rbac_roles(id, kind) ON DELETE RESTRICT,
        CONSTRAINT FK_rbac_assignment_scope FOREIGN KEY (scope_id, scope_kind) REFERENCES rbac_scopes(id, kind) ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin
    `);
    await queryRunner.query(`
      CREATE TABLE rbac_platform_owner (
        id TINYINT NOT NULL DEFAULT 1,
        user_id INT NOT NULL,
        role_id INT NOT NULL,
        role_kind ENUM('STANDARD','PLATFORM') NOT NULL DEFAULT 'PLATFORM',
        scope_id INT NOT NULL,
        scope_kind ENUM('GLOBAL','DEPARTMENT','TEAM','PLANT') NOT NULL DEFAULT 'GLOBAL',
        created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        UNIQUE KEY UQ_rbac_platform_owner_user (user_id),
        CONSTRAINT CHK_rbac_platform_owner_singleton CHECK (id = 1),
        CONSTRAINT CHK_rbac_platform_owner_role CHECK (role_kind = 'PLATFORM'),
        CONSTRAINT CHK_rbac_platform_owner_scope CHECK (scope_kind = 'GLOBAL'),
        CONSTRAINT FK_rbac_owner_user FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE RESTRICT,
        CONSTRAINT FK_rbac_owner_role FOREIGN KEY (role_id, role_kind) REFERENCES rbac_roles(id, kind) ON DELETE RESTRICT,
        CONSTRAINT FK_rbac_owner_scope FOREIGN KEY (scope_id, scope_kind) REFERENCES rbac_scopes(id, kind) ON DELETE RESTRICT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin
    `);

    await queryRunner.query(
      "INSERT INTO rbac_scopes (id, code, name, kind, parent_id) VALUES (1, 'global', 'Sterinova', 'GLOBAL', NULL)",
    );
    await queryRunner.query(
      'INSERT INTO rbac_scope_closure (ancestor_id, descendant_id, depth) VALUES (1, 1, 0)',
    );
    for (const permission of INITIAL_RBAC_PERMISSIONS) {
      await queryRunner.query(
        'INSERT INTO rbac_permissions (code, module, label) VALUES (?, ?, ?)',
        [permission.code, permission.module, permission.label],
      );
    }
    for (const [index, role] of INITIAL_RBAC_ROLES.entries()) {
      const roleId = index + 1;
      await queryRunner.query(
        'INSERT INTO rbac_roles (id, code, name, kind) VALUES (?, ?, ?, ?)',
        [roleId, role.code, role.name, role.kind],
      );
      for (const grant of role.grants) {
        await queryRunner.query(
          'INSERT INTO rbac_role_permissions (role_id, permission_code, resource_access, include_descendants) VALUES (?, ?, ?, ?)',
          [
            roleId,
            grant.permission,
            grant.resourceAccess,
            grant.includeDescendants ? 1 : 0,
          ],
        );
      }
    }
  }

  async down(_queryRunner: QueryRunner): Promise<void> {
    throw new Error(
      'No se permite eliminar estructura o concesiones RBAC mediante rollback automático. Usar respaldo o migración correctiva.',
    );
  }
}

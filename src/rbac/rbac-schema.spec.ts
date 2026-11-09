import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { STERINOVA_ENTITIES } from '../database/entities.js';
import { RbacScope, RbacScopeClosure } from './entities/scope.entity.js';
import {
  RbacRole,
  RbacPermission,
  RbacRolePermission,
} from './entities/role.entity.js';
import {
  RbacUserRoleAssignment,
  RbacPlatformOwner,
} from './entities/user-role-assignment.entity.js';

class MetadataDataSource extends DataSource {
  prepareMetadata() {
    return this.buildMetadatas();
  }
}

describe('RBAC relational boundaries', () => {
  const dataSource = new MetadataDataSource({
    type: 'mariadb',
    database: 'metadata_only',
    entities: STERINOVA_ENTITIES,
  });
  beforeAll(async () => {
    await dataSource.prepareMetadata();
  });

  it('registers the seven RBAC entities without requiring a database connection', () => {
    for (const entity of [
      RbacScope,
      RbacScopeClosure,
      RbacRole,
      RbacPermission,
      RbacRolePermission,
      RbacUserRoleAssignment,
      RbacPlatformOwner,
    ]) {
      expect(dataSource.hasMetadata(entity)).toBe(true);
    }
    expect(dataSource.isInitialized).toBe(false);
  });

  it('supports multiple scoped roles per user with a unique user-role-scope combination', () => {
    const metadata = dataSource.getMetadata(RbacUserRoleAssignment);
    expect(
      metadata.indices.some(
        (index) =>
          index.isUnique &&
          index.columns.map(({ propertyName }) => propertyName).join(',') ===
            'user_id,role_id,scope_id',
      ),
    ).toBe(true);
    expect(
      metadata.indices.some(
        (index) =>
          index.isUnique &&
          index.columns.length === 1 &&
          index.columns[0].propertyName === 'user_id',
      ),
    ).toBe(false);
    expect(
      metadata.foreignKeys.every((key) => key.onDelete === 'RESTRICT'),
    ).toBe(true);
  });

  it('protects ordinary assignments using composite role and scope references', () => {
    const metadata = dataSource.getMetadata(RbacUserRoleAssignment);
    const references = metadata.foreignKeys.map((key) =>
      key.columns.map(({ propertyName }) => propertyName).join(','),
    );
    expect(references).toContain('role_id,role_kind');
    expect(references).toContain('scope_id,scope_kind');
    expect(
      metadata.checks.map(({ expression }) => expression).join(' '),
    ).toContain("role_kind = 'STANDARD'");
    expect(
      metadata.checks.map(({ expression }) => expression).join(' '),
    ).toContain("scope_kind <> 'GLOBAL'");
  });

  it('limits platform ownership to one row and forbids ordinary roles or non-global scopes', () => {
    const metadata = dataSource.getMetadata(RbacPlatformOwner);
    const checks = metadata.checks
      .map(({ expression }) => expression)
      .join(' ');
    expect(checks).toContain('id = 1');
    expect(checks).toContain("role_kind = 'PLATFORM'");
    expect(checks).toContain("scope_kind = 'GLOBAL'");
    expect(
      metadata.primaryColumns.map(({ propertyName }) => propertyName),
    ).toEqual(['id']);
    expect(
      metadata.foreignKeys.every((key) => key.onDelete === 'RESTRICT'),
    ).toBe(true);
  });

  it('indexes both hierarchy directions and permits only one global root', () => {
    const closure = dataSource.getMetadata(RbacScopeClosure);
    expect(
      closure.primaryColumns.map(({ propertyName }) => propertyName),
    ).toEqual(['ancestor_id', 'descendant_id']);
    expect(
      closure.indices.some(
        (index) => index.columns[0]?.propertyName === 'descendant_id',
      ),
    ).toBe(true);
    const scope = dataSource.getMetadata(RbacScope);
    expect(
      scope.indices.some(
        (index) =>
          index.isUnique && index.columns[0]?.propertyName === 'global_slot',
      ),
    ).toBe(true);
    expect(
      scope.columns.find(({ propertyName }) => propertyName === 'global_slot')
        ?.asExpression,
    ).toContain("kind = 'GLOBAL'");
  });
});

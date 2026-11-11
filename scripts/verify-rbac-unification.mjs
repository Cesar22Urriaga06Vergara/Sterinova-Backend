import 'dotenv/config';
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import {DataSource} from 'typeorm';
import {AppDataSource} from '../dist/database/data-source.js';
import {STERINOVA_ENTITIES} from '../dist/database/entities.js';
import {UnifyUserRoleAssignments1794312002000} from '../dist/database/migrations/1794312002000-UnifyUserRoleAssignments.js';
import {RbacAuthorizationService} from '../dist/rbac/rbac-authorization.service.js';

const name=`sterinova_roles_check_${randomBytes(6).toString('hex')}`;
const tables=['usuarios','rbac_scopes','rbac_scope_closure','rbac_roles','rbac_permissions','rbac_role_permissions','rbac_user_role_assignments','rbac_platform_owner','auditoria'];
let isolated;let created=false;let passed=0;
async function check(label,work){await work();passed++;console.log('PASS',label)}
await AppDataSource.initialize();
try {
 assert.match(name,/^sterinova_roles_check_[a-f0-9]{12}$/);
 await AppDataSource.query(`CREATE DATABASE \`${name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`);created=true;
 isolated=await new DataSource({...AppDataSource.options,database:name,entities:STERINOVA_ENTITIES,migrations:[],synchronize:false}).initialize();
 const runner=isolated.createQueryRunner();await runner.connect();
 try {
  await runner.query('SET FOREIGN_KEY_CHECKS=0');
  for(const table of tables){let ddl=(await AppDataSource.query(`SHOW CREATE TABLE ${table}`))[0]['Create Table'];await runner.query(ddl);if(table!=='auditoria')await runner.query(`INSERT INTO ${table} SELECT * FROM \`${process.env.DB_DATABASE}\`.${table}`)}
  const [keeper]=await runner.query("SELECT MIN(user_id) AS id FROM rbac_user_role_assignments WHERE active=1 AND scope_kind='GLOBAL'");
  await runner.query('DELETE FROM rbac_platform_owner');
  await runner.query('DELETE FROM rbac_user_role_assignments WHERE user_id<>?',[keeper.id]);
  await runner.query('DELETE FROM usuarios WHERE id<>?',[keeper.id]);
  const userColumns=await runner.query('SHOW COLUMNS FROM usuarios');
  if(userColumns.some(c=>c.Field==='rbac_version'))await runner.query('ALTER TABLE usuarios DROP COLUMN rbac_version');
  const roleColumns=await runner.query('SHOW COLUMNS FROM rbac_roles');
  if(roleColumns.some(c=>c.Field==='legacy_role'))await runner.query('ALTER TABLE rbac_roles DROP COLUMN legacy_role');
  await runner.query('SET FOREIGN_KEY_CHECKS=1');
  await new UnifyUserRoleAssignments1794312002000().up(runner);
 }finally{await runner.release()}
 const db=isolated;const auth=new RbacAuthorizationService(db);
 const [admin]=await db.query('SELECT id FROM usuarios WHERE rbac_is_global_admin(id)=1 LIMIT 1');assert.ok(admin);
 const [commercial]=await db.query("SELECT id FROM rbac_scopes WHERE code='comercial'");assert.ok(commercial);
 const [advisor]=await db.query("SELECT id FROM rbac_roles WHERE code='asesor_comercial'");await db.query('UPDATE rbac_roles SET active=1 WHERE id=?',[advisor.id]);
 const result=await db.query("INSERT INTO usuarios(nombre,email,password_hash,rol,activo) VALUES('RBAC Check','rbac-check@example.test','not-a-login-hash','Calidad',1)");const uid=result.insertId;
 const set=(roles,version=null,actor=admin.id,target=uid)=>db.query('CALL rbac_set_user_roles(?,?,?,?)',[target,JSON.stringify(roles),actor,version]);
 const one=[{role_id:advisor.id,scope_id:commercial.id}];
 await check('procedure assigns profile and derives legacy role',async()=>{await set(one);assert.equal((await db.query('SELECT rol FROM usuarios WHERE id=?',[uid]))[0].rol,'Comercial');assert.ok((await auth.getSession(uid)).permissions.includes('cotizaciones.ver'))});
 await check('independent usuarios.rol change is rejected',async()=>{await assert.rejects(db.query("UPDATE usuarios SET rol='Admin' WHERE id=?",[uid]),/compatibilidad/);assert.equal((await db.query('SELECT rol FROM usuarios WHERE id=?',[uid]))[0].rol,'Comercial')});
 await check('direct assignment writes are rejected',async()=>{await assert.rejects(db.query('UPDATE rbac_user_role_assignments SET active=0 WHERE user_id=?',[uid]),/rbac_set_user_roles/)});
 await check('inactive and unknown profiles roll back every assignment',async()=>{await assert.rejects(set([...one,{role_id:999999,scope_id:commercial.id}]),/inexistente/);assert.ok((await auth.getSession(uid)).permissions.includes('cotizaciones.ver'))});
 await check('department role cannot be assigned globally',async()=>{await assert.rejects(set([{role_id:advisor.id,scope_id:1}]),/no admite/)});
 await check('unprivileged actor cannot change roles',async()=>{await assert.rejects(set(one,null,uid),/Actor sin/)});
 await check('read is allowed and ungranted delete is denied',async()=>{await auth.getContext(uid,'cotizaciones.ver');await assert.rejects(auth.getContext(uid,'cotizaciones.eliminar'),/Sin permiso/)});
 await check('multiple roles and scopes remain related rows',async()=>{
  const team=await db.query("INSERT INTO rbac_scopes(code,name,kind,parent_id) VALUES('check-team','Check Team','TEAM',?)",[commercial.id]);
  const [issuer]=await db.query("SELECT id FROM rbac_roles WHERE code='emisor_comercial'");
  await set([...one,{role_id:issuer.id,scope_id:team.insertId}]);
  const rows=await db.query('SELECT * FROM rbac_user_role_assignments WHERE user_id=? AND active=1',[uid]);assert.equal(rows.length,2);
  assert.equal((await db.query('SELECT rol FROM usuarios WHERE id=?',[uid]))[0].rol,'Comercial');
  const issue=await auth.getContext(uid,'cotizaciones.emitir');assert.ok(issue.policy.scopeIds.includes(team.insertId));assert.ok(!issue.policy.scopeIds.includes(commercial.id));
 });
 await check('stale revisions reject lost updates',async()=>{const [{rbac_version:v}]=await db.query('SELECT rbac_version FROM usuarios WHERE id=?',[uid]);await set(one,v);await assert.rejects(set(one,v),/obsoleta/)});
 await check('duplicate assignments roll back',async()=>{await assert.rejects(set([...one,...one]),/duplicada/)});
 await check('last global administrator cannot lose assignment',async()=>{await assert.rejects(set(one,null,admin.id,admin.id),/administradora global/);assert.equal(Number((await db.query('SELECT rbac_is_global_admin(?) AS ok',[admin.id]))[0].ok),1)});
 await check('last global administrator cannot be deactivated',async()=>{await assert.rejects(db.query('UPDATE usuarios SET activo=0 WHERE id=?',[admin.id]),/ultima cuenta/)});
 await check('last global administrator cannot be deleted',async()=>{await assert.rejects(db.query('DELETE FROM usuarios WHERE id=?',[admin.id]),/ultima cuenta/)});
 await check('concurrent replacements have one winner',async()=>{const [{rbac_version:v}]=await db.query('SELECT rbac_version FROM usuarios WHERE id=?',[uid]);const results=await Promise.allSettled([set(one,v),set(one,v)]);assert.equal(results.filter(r=>r.status==='fulfilled').length,1);assert.equal(results.filter(r=>r.status==='rejected').length,1)});
 console.log(`Verified ${passed} checks in isolated database; local application data unchanged.`);
}finally{
 if(isolated?.isInitialized)await isolated.destroy();
 if(created){assert.match(name,/^sterinova_roles_check_[a-f0-9]{12}$/);await AppDataSource.query(`DROP DATABASE \`${name}\``)}
 await AppDataSource.destroy();
}

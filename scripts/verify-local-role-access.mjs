import 'dotenv/config';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
import {AppDataSource as db} from '../dist/database/data-source.js';
import {RbacAuthorizationService} from '../dist/rbac/rbac-authorization.service.js';
import {readLocalRoleCredentials} from './local-role-credentials.mjs';
const saved=await readLocalRoleCredentials();
const jwt=new JwtService({secret:process.env.JWT_SECRET});
let passed=0;const evidence=[];
async function check(label,work){await work();passed++;evidence.push(label);console.log('PASS',label)}
await db.initialize();
try{
 const auth=new RbacAuthorizationService(db);
 const [admin]=await db.query('SELECT id,rol FROM usuarios WHERE email=?',[process.env.ADMIN_EMAIL]);
 const [advisor]=await db.query("SELECT id,rol FROM usuarios WHERE email='asesor_comercial@sterinova.local'");
 const [logistics]=await db.query("SELECT id,rol FROM usuarios WHERE email='operador_logistica@sterinova.local'");
 const [qualityRole]=await db.query("SELECT id FROM rbac_roles WHERE code='analista_calidad'");const [qualityScope]=await db.query("SELECT id FROM rbac_scopes WHERE code='calidad'");
 const token=user=>jwt.sign({sub:user.id,email:user.email,rol:user.rol},{expiresIn:'5m'});
 async function request(user,path,method='GET',body,scope){return fetch(`http://localhost:3001${path}`,{method,headers:{Authorization:`Bearer ${token(user)}`,...(body?{'Content-Type':'application/json'}:{}),...(scope?{'x-scope-id':String(scope)}:{})},body:body?JSON.stringify(body):undefined})}
 await check('all documented fictional accounts authenticate and have RBAC sessions',async()=>{
  const users=[];
  for(const [email,credential] of Object.entries(saved)){
   const [user]=await db.query('SELECT id,email,password_hash,activo FROM usuarios WHERE id=? AND email=?',[credential.id,email]);
   assert.ok(user);assert.notEqual(Number(user.id),1);users.push(user);
  }
  for(const u of users){assert.equal(u.activo,1);const password=u.id===admin.id?process.env.ADMIN_PASSWORD:saved[u.email]?.password;assert.ok(password);assert.ok(await bcrypt.compare(password,u.password_hash));const session=await auth.getSession(u.id);assert.ok(session.user.id===u.id)}
 });
 await check('ERP API exposes all 23 profiles',async()=>{const res=await request(admin,'/users/role-catalog');assert.equal(res.status,200);assert.equal((await res.json()).roles.length,23)});
 await check('advisor may read quotes but may not manage roles',async()=>{assert.equal((await request(advisor,'/cotizaciones')).status,200);assert.equal((await request(advisor,'/users/role-catalog')).status,403)});
 await check('logistics denied quotes even with forged legacy Admin token claim',async()=>{assert.equal((await request({...logistics,rol:'Admin'},'/cotizaciones')).status,403)});
 const before=await db.query('SELECT role_id,scope_id FROM rbac_user_role_assignments WHERE user_id=? AND active=1',[advisor.id]);
 try {
  await check('ERP API adds role and scope through common procedure',async()=>{const r=await request(admin,`/users/${advisor.id}/role-assignments`,'POST',{role_id:qualityRole.id,scope_id:qualityScope.id});assert.equal(r.status,201);const session=await (await request(advisor,'/auth/me')).json();assert.ok(session.permissions.includes('cotizaciones.ver'));assert.ok(session.permissions.includes('calidad.aprobar'));assert.equal(session.available_scopes.length,2)});
  await check('wrong selected scope is denied after a multi-role assignment',async()=>{assert.equal((await request(advisor,'/cotizaciones','GET',undefined,qualityScope.id)).status,403)});
  await check('ERP API removes only the selected assignment',async()=>{const [a]=await db.query('SELECT id FROM rbac_user_role_assignments WHERE user_id=? AND role_id=? AND active=1',[advisor.id,qualityRole.id]);assert.equal((await request(admin,`/users/${advisor.id}/role-assignments/${a.id}`,'DELETE')).status,200);assert.ok(!(await auth.getSession(advisor.id)).permissions.includes('calidad.aprobar'))});
  await check('HeidiSQL CALL applies the same multi-role replacement',async()=>{const [{rbac_version}]=await db.query('SELECT rbac_version FROM usuarios WHERE id=?',[advisor.id]);await db.query('CALL rbac_set_user_roles(?,?,?,?)',[advisor.id,JSON.stringify([...before,{role_id:qualityRole.id,scope_id:qualityScope.id}]),admin.id,rbac_version]);assert.ok((await (await request(advisor,'/auth/me')).json()).permissions.includes('calidad.aprobar'));assert.equal((await db.query('SELECT rol FROM usuarios WHERE id=?',[advisor.id]))[0].rol,'Comercial')});
  await check('legacy role edit and direct assignment edit are rejected locally',async()=>{await assert.rejects(db.query("UPDATE usuarios SET rol='Admin' WHERE id=?",[advisor.id]),/compatibilidad/);await assert.rejects(db.query('UPDATE rbac_user_role_assignments SET active=0 WHERE user_id=?',[advisor.id]),/rbac_set_user_roles/)});
 }finally{const [{rbac_version}]=await db.query('SELECT rbac_version FROM usuarios WHERE id=?',[advisor.id]);await db.query('CALL rbac_set_user_roles(?,?,?,?)',[advisor.id,JSON.stringify(before),admin.id,rbac_version]);}
 await check('original Gerente General retains 46 permissions and quote access',async()=>{assert.equal((await auth.getSession(admin.id)).permissions.length,46);assert.equal((await request(admin,'/cotizaciones')).status,200)});
 await check('future permission codes remain inactive',async()=>{const [{n}]=await db.query("SELECT COUNT(*) AS n FROM rbac_permissions WHERE code LIKE 'lavanderia.%' AND active=1");assert.equal(Number(n),0)});
 await writeFile('tmp/rbac-local-verification.json',JSON.stringify({passed,evidence,accounts:Object.keys(saved).length},null,2));console.log(`Verified ${passed} local checks; advisor restored to original profile.`);
}finally{await db.destroy()}

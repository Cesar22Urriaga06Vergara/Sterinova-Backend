import 'dotenv/config';
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import {writeFile,mkdir} from 'node:fs/promises';
import bcrypt from 'bcrypt';
import {AppDataSource as db} from '../dist/database/data-source.js';
import {RbacAuthorizationService} from '../dist/rbac/rbac-authorization.service.js';
import {LOCAL_ROLE_CREDENTIALS_PATH,readLocalRoleCredentials} from './local-role-credentials.mjs';

if(process.env.NODE_ENV==='production'||!['localhost','127.0.0.1','::1'].includes(process.env.DB_HOST??'localhost'))throw Error('Only an explicitly local development database is supported.');
await mkdir('docs/local',{recursive:true});
const saved=await readLocalRoleCredentials();
async function persistCredentials(){
 const rows=Object.entries(saved).map(([email,entry])=>`| ${entry.id} | ${entry.code} | ${email} | ${entry.password} | ${entry.scope} |`);
 await writeFile(LOCAL_ROLE_CREDENTIALS_PATH,['# Credenciales ficticias para pruebas locales','','No usar en producción. Las cuentas de esta lista son de prueba; las credenciales se mantienen únicamente en este archivo, excluido de Git.','', '| ID | Perfil | Correo | Contraseña | Ámbito |','|---:|---|---|---|---|',...rows,''].join('\n'));
}
await db.initialize();
try{
 const [admin]=await db.query('SELECT id,email,password_hash FROM usuarios WHERE email=?',[process.env.ADMIN_EMAIL]);assert.ok(admin);assert.equal(Number((await db.query('SELECT rbac_is_global_admin(?) AS ok',[admin.id]))[0].ok),1);
 assert.ok(await bcrypt.compare(process.env.ADMIN_PASSWORD,admin.password_hash));
 const [root]=await db.query("SELECT id FROM rbac_scopes WHERE kind='GLOBAL' AND active=1");
 for(const [code,name]of [['comercial','Comercial'],['logistica','Logística'],['planta','Planta'],['calidad','Calidad'],['lavanderia','Lavandería']]){
  await db.query("INSERT INTO rbac_scopes(code,name,kind,parent_id,active) VALUES(?,?,'DEPARTMENT',?,1) ON DUPLICATE KEY UPDATE code=VALUES(code)",[code,name,root.id]);
 }
 const scopes=await db.query('SELECT id,code,name FROM rbac_scopes WHERE active=1');const scopeByCode=new Map(scopes.map(s=>[s.code,s]));
 for(const s of scopes){await db.query('INSERT IGNORE INTO rbac_scope_closure(ancestor_id,descendant_id,depth) VALUES(?,?,0)',[s.id,s.id]);if(s.id!==root.id)await db.query('INSERT IGNORE INTO rbac_scope_closure(ancestor_id,descendant_id,depth) VALUES(?,?,1)',[root.id,s.id])}
 // This explicit local fixture activates profiles, never future permission codes.
 await db.query('UPDATE rbac_roles SET active=1 WHERE active=0');
 const roles=await db.query('SELECT id,code,name,kind,global_assignable FROM rbac_roles ORDER BY id');
 const entries=[];const missingCredentials=[];let created=0;
 for(const role of roles){
  const scopeCode=role.kind==='PLATFORM'||role.global_assignable?'global':role.code.includes('logistica')?'logistica':role.code.includes('lavanderia')?'lavanderia':role.code.includes('planta')?'planta':role.code.includes('comercial')||role.code==='admin_area'?'comercial':'calidad';
  const scope=scopeByCode.get(scopeCode);assert.ok(scope);
  if(role.code==='gerente_general'){
   const session=await new RbacAuthorizationService(db).getSession(admin.id);
   entries.push({code:role.code,name:'Gerente General',email:admin.email,password:process.env.ADMIN_PASSWORD,id:admin.id,scope:'global + comercial (administración de área)',permissions:session.permissions.length,legacy:session.user.rol});continue;
  }
  const email=`${role.code}@sterinova.local`;let [user]=await db.query('SELECT id,rol,activo FROM usuarios WHERE email=?',[email]);
  let password=saved[email]?.password;
  if(!user){
   password=`Stn!${randomBytes(15).toString('base64url')}`;
   const hash=await bcrypt.hash(password,12);
   const result=await db.query("INSERT INTO usuarios(nombre,email,password_hash,rol,cargo,activo) VALUES(?,?,?,'Calidad',?,0)",[`Prueba ${role.name}`,email,hash,role.name]);
   user={id:result.insertId};
   // Persist credentials before any subsequent operation can fail.
   saved[email]={password,id:user.id,code:role.code,scope:scope.code};await persistCredentials();
   await db.query('CALL rbac_set_user_roles(?,?,?,?)',[user.id,JSON.stringify([{role_id:role.id,scope_id:scope.id}]),admin.id,0]);
   await db.query('UPDATE usuarios SET activo=1 WHERE id=?',[user.id]);created++;
  }
  const [persisted]=await db.query('SELECT password_hash FROM usuarios WHERE id=?',[user.id]);
  if(!password||!await bcrypt.compare(password,persisted.password_hash)){missingCredentials.push(role.code);continue;}
  const session=await new RbacAuthorizationService(db).getSession(user.id);
  entries.push({code:role.code,name:role.name,email,password,id:user.id,scope:scope.code,permissions:session.permissions.length,legacy:session.user.rol});
 }
 const adminEntryIndex=entries.findIndex((entry)=>entry.id===admin.id);
 if(adminEntryIndex>=0)entries.splice(adminEntryIndex,1);
 const markdown=['# Credenciales ficticias de Sterinova','', 'Solo para pruebas en el entorno local. No usar en producción. La cuenta administrativa existente no se incluye.','', 'Acceso ERP: http://localhost:3000/login','', '| ID | Perfil | Correo | Contraseña | Ámbito |','|---:|---|---|---|---|',...entries.map(e=>`| ${e.id} | ${e.code} | ${e.email} | ${e.password} | ${e.scope} |`),''];
 await writeFile(LOCAL_ROLE_CREDENTIALS_PATH,markdown.join('\n'));
 console.log(JSON.stringify({created,totalProfiles:roles.length,totalAccounts:entries.length,profilesWithoutVerifiedCredentials:missingCredentials,credentialsFile:LOCAL_ROLE_CREDENTIALS_PATH}));
}finally{await db.destroy()}

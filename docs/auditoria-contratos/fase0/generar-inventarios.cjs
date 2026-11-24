// Inventario estático: no inicia la aplicación ni consulta la base de datos.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('../../../node_modules/typescript');

const backend = path.resolve(__dirname, '../../..');
const frontend = path.resolve(backend, '../SterinovaFrontend');
const out = __dirname;
const rel = (root, file) => path.relative(root, file).replaceAll('\\', '/');
const read = (file) => fs.readFileSync(file, 'utf8');
const source = (file) => ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true, /\.tsx$/.test(file) ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
const line = (sf, node) => sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
const quote = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const csv = (name, headers, rows) => fs.writeFileSync(path.join(out, name), [headers, ...rows].map((row) => row.map(quote).join(',')).join('\n') + '\n', 'utf8');
function files(dir, filter) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? files(file, filter) : filter(file) ? [file] : [];
  });
}
function visit(node, fn) { fn(node); ts.forEachChild(node, (child) => visit(child, fn)); }
function prop(obj, name) {
  if (!ts.isObjectLiteralExpression(obj)) return undefined;
  return obj.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText() === name)?.initializer;
}
function literal(node) {
  if (!node) return undefined;
  if (ts.isStringLiteralLike(node)) return node.text;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  return undefined;
}
function decorators(node) {
  return ts.canHaveDecorators(node) ? ts.getDecorators(node) ?? [] : [];
}
function deco(node, name) {
  return decorators(node).find((d) => ts.isCallExpression(d.expression) && d.expression.expression.getText() === name)?.expression;
}
function route(prefix, suffix) {
  return '/' + [prefix, suffix].filter(Boolean).join('/').replace(/^\/+|\/+$/g, '').replace(/\/{2,}/g, '/');
}

const backendEndpoints = [];
for (const file of files(path.join(backend, 'src'), (f) => f.endsWith('.controller.ts'))) {
  const sf = source(file);
  for (const cls of sf.statements.filter(ts.isClassDeclaration)) {
    const prefix = literal(deco(cls, 'Controller')?.arguments[0]) ?? '';
    if (!deco(cls, 'Controller')) continue;
    for (const method of cls.members.filter(ts.isMethodDeclaration)) {
      for (const verb of ['Get', 'Post', 'Put', 'Patch', 'Delete']) {
        const d = deco(method, verb);
        if (!d) continue;
        const suffix = literal(d.arguments[0]) ?? '';
        const permission = literal(deco(method, 'RequirePermission')?.arguments[0]) ?? literal(deco(cls, 'RequirePermission')?.arguments[0]) ?? (deco(method, 'RequireSession') || deco(cls, 'RequireSession') ? 'SESSION' : 'NO_DECLARADO');
        const isPublic = Boolean(deco(method, 'Public') || deco(cls, 'Public'));
        backendEndpoints.push([rel(backend, file).split('/')[1], verb.toUpperCase(), route(prefix, suffix), rel(backend, file), line(sf, d), permission, isPublic]);
      }
    }
  }
}
backendEndpoints.sort((a, b) => a[2].localeCompare(b[2]) || a[1].localeCompare(b[1]));
csv('endpoints-backend.csv', ['modulo', 'metodo', 'ruta_completa', 'archivo', 'linea', 'permiso', 'publico'], backendEndpoints);

const catalogFile = path.join(backend, 'src/rbac/permission-catalog.ts');
const catalogSf = source(catalogFile);
const catalogNode = catalogSf.statements.filter(ts.isVariableStatement).flatMap((s) => [...s.declarationList.declarations]).find((d) => d.name.getText() === 'PERMISSION_CATALOG');
const catalogArray = ts.isAsExpression(catalogNode.initializer) ? catalogNode.initializer.expression : catalogNode.initializer;
const futureFile = path.join(backend, 'src/database/migrations/1794312001000-SeedBackendRoles.ts');
const futureSf = source(futureFile);
const variables = new Map();
for (const stmt of futureSf.statements.filter(ts.isVariableStatement)) for (const decl of stmt.declarationList.declarations) variables.set(decl.name.getText(), decl.initializer);
function arrayCodes(node, depth = 0) {
  if (!node || depth > 12) return [];
  if (ts.isAsExpression(node) || ts.isParenthesizedExpression(node)) return arrayCodes(node.expression, depth + 1);
  if (ts.isIdentifier(node)) return arrayCodes(variables.get(node.text), depth + 1);
  if (ts.isCallExpression(node) && node.expression.getText() === 'grants') return arrayCodes(node.arguments[0], depth + 1);
  if (ts.isArrayLiteralExpression(node)) return node.elements.flatMap((el) => ts.isSpreadElement(el) ? arrayCodes(el.expression, depth + 1) : literal(el) ? [literal(el)] : arrayCodes(el, depth + 1));
  return [];
}
const rolesByCode = new Map();
const rolesNode = variables.get('BACKEND_ROLES');
const rolesArray = ts.isAsExpression(rolesNode) ? rolesNode.expression : rolesNode;
for (const role of rolesArray.elements) {
  const roleCode = literal(prop(role, 'code'));
  for (const code of arrayCodes(prop(role, 'grants'))) {
    if (!rolesByCode.has(code)) rolesByCode.set(code, new Set());
    rolesByCode.get(code).add(roleCode);
  }
}
const future = new Set(arrayCodes(variables.get('FUTURE_PERMISSIONS')));
const backendPermissions = catalogArray.elements.map((el) => {
  const code = literal(prop(el, 'code'));
  const module = literal(prop(el, 'module'));
  const dynamic = literal(prop(el, 'isDynamic')) === true;
  return [code, module, future.has(code) ? 'INACTIVO_EN_SEED' : 'NO_VERIFICADO_DB', dynamic, [...(rolesByCode.get(code) ?? [])].sort().join('|')];
});
backendPermissions.sort((a, b) => a[0].localeCompare(b[0]));
csv('permisos-backend.csv', ['codigo', 'modulo', 'activo', 'dinamico', 'roles_que_lo_tienen'], backendPermissions);

function normalizeTemplate(raw) {
  return raw.replace(/\?.*$/, '').replace(/\$\{[^}]+\}/g, ':id').replace(/\/{2,}/g, '/');
}
function valueOf(node, sf) {
  if (!node) return { value: 'SIN_ARGUMENTO', dynamic: 'NO_RESUELTA' };
  if (ts.isStringLiteral(node)) return { value: normalizeTemplate(node.text), dynamic: 'NO' };
  if (ts.isNoSubstitutionTemplateLiteral(node)) return { value: normalizeTemplate(node.text), dynamic: 'NO' };
  if (ts.isTemplateExpression(node)) {
    let value = node.head.text;
    for (const span of node.templateSpans) {
      const expression = span.expression.getText(sf);
      const likelyQuery = !value.endsWith('/') && /^(params|query|searchParams)(\.toString\(\))?$/.test(expression) && !span.literal.text;
      value += (likelyQuery ? '' : ':id') + span.literal.text;
    }
    return { value: normalizeTemplate(value), dynamic: 'SI' };
  }
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const l = valueOf(node.left, sf), r = valueOf(node.right, sf);
    if (l.dynamic === 'NO_RESUELTA' || r.dynamic === 'NO_RESUELTA') return { value: node.getText(sf).replace(/\s+/g, ' ').slice(0, 160), dynamic: 'NO_RESUELTA' };
    return { value: normalizeTemplate(l.value + r.value), dynamic: 'SI' };
  }
  return { value: node.getText(sf).replace(/\s+/g, ' ').slice(0, 160), dynamic: 'NO_RESUELTA' };
}
const frontendCalls = [], frontendPermissions = [];
for (const file of files(path.join(frontend, 'src'), (f) => /\.(ts|tsx)$/.test(f) && !/\.d\.ts$/.test(f))) {
  const sf = source(file), filename = rel(frontend, file);
  visit(sf, (node) => {
    if (ts.isCallExpression(node)) {
      const callee = node.expression.getText(sf);
      const apiMatch = /^(api|axios)\.(get|post|put|patch|delete)$/.exec(callee);
      const isDownload = callee === 'downloadPdfFromBackend';
      const isFetch = callee === 'fetch' || callee === 'window.fetch';
      if (apiMatch || isDownload || isFetch) {
        const pathValue = valueOf(node.arguments[0], sf);
        const normalized = callee.startsWith('axios.') ? pathValue.value.replace(/^:id(?=\/)/, '') : pathValue.value;
        frontendCalls.push([filename, line(sf, node), apiMatch ? apiMatch[2].toUpperCase() : isDownload ? 'GET' : 'FETCH', normalized, pathValue.dynamic]);
      }
      if (callee === 'can' || callee === 'canManageGlobal') {
        const p = literal(node.arguments[0]);
        if (typeof p === 'string') frontendPermissions.push([filename, line(sf, node), p, callee]);
        else {
          const options = [];
          if (node.arguments[0]) visit(node.arguments[0], (child) => { if (ts.isStringLiteral(child) && /^[a-z_]+(\.[a-z_]+)+$/.test(child.text)) options.push(child.text); });
          if (options.length) for (const option of options) frontendPermissions.push([filename, line(sf, node), option, `${callee}:condicional`]);
          else frontendPermissions.push([filename, line(sf, node), node.arguments[0]?.getText(sf).replace(/\s+/g, ' ').slice(0, 100) ?? 'SIN_ARGUMENTO', `${callee}:NO_RESUELTO`]);
        }
      }
    }
    if (ts.isPropertyAssignment(node) && ['permission', 'permissions', 'globalPermissions'].includes(node.name.getText(sf))) {
      const values = ts.isArrayLiteralExpression(node.initializer) ? node.initializer.elements : [node.initializer];
      for (const v of values) if (typeof literal(v) === 'string') frontendPermissions.push([filename, line(sf, v), literal(v), `propiedad:${node.name.getText(sf)}`]);
    }
  });
}
frontendCalls.sort((a, b) => a[0].localeCompare(b[0]) || a[1] - b[1]);
frontendPermissions.sort((a, b) => a[0].localeCompare(b[0]) || a[1] - b[1]);
csv('endpoints-frontend.csv', ['archivo', 'linea', 'metodo', 'ruta_usada', 'es_dinamica'], frontendCalls);
csv('permisos-frontend.csv', ['archivo', 'linea', 'permiso', 'contexto'], frontendPermissions);

const backendPkg = JSON.parse(read(path.join(backend, 'package.json')));
const frontendPkg = JSON.parse(read(path.join(frontend, 'package.json')));
const backendLock = JSON.parse(read(path.join(backend, 'package-lock.json')));
const frontendLock = JSON.parse(read(path.join(frontend, 'package-lock.json')));
const wanted = { Backend: ['@nestjs/common', '@nestjs/core', 'typeorm', 'mysql2', 'playwright', 'vitest', 'typescript'], Frontend: ['next', 'react', 'react-dom', 'axios', 'tailwindcss', '@playwright/test', 'typescript'] };
let versions = '# Versiones declaradas y fijadas\n\n| Proyecto | Paquete | Declarada | Lockfile |\n|---|---|---|---|\n';
for (const [project, pkg, lock] of [['Backend', backendPkg, backendLock], ['Frontend', frontendPkg, frontendLock]]) {
  versions += `| ${project} | node | ${pkg.engines?.node ?? ''} | no aplica |\n| ${project} | npm | ${pkg.engines?.npm ?? ''} | no aplica |\n`;
  for (const name of wanted[project]) versions += `| ${project} | ${name} | ${pkg.dependencies?.[name] ?? pkg.devDependencies?.[name] ?? 'NO_DECLARADO'} | ${lock.packages?.[`node_modules/${name}`]?.version ?? 'NO_FIJADO'} |\n`;
}
versions += '\nLa columna Lockfile refleja la versión resuelta en package-lock.json; no confirma los binarios instalados.\n';
fs.writeFileSync(path.join(out, 'versiones.md'), versions, 'utf8');

const spec = JSON.parse(read(path.join(backend, 'docs/arquitectura/openapi.json')));
const specEndpoints = Object.entries(spec.paths ?? {}).flatMap(([route, methods]) => Object.keys(methods).filter((m) => ['get', 'post', 'put', 'patch', 'delete'].includes(m)).map((m) => `${m.toUpperCase()} ${route}`));
const staticEndpoints = new Set(backendEndpoints.map((r) => `${r[1]} ${r[2]}`));
const openapiEndpoints = new Set(specEndpoints.map((x) => x.replace(/\{([^}]+)\}/g, ':$1')));
const missingSpec = [...staticEndpoints].filter((x) => !openapiEndpoints.has(x));
const extraSpec = [...openapiEndpoints].filter((x) => !staticEndpoints.has(x));
const count = { backend_endpoints: backendEndpoints.length, frontend_calls: frontendCalls.length, backend_permissions: backendPermissions.length, frontend_permissions: frontendPermissions.length, openapi_endpoints: specEndpoints.length, missing_openapi: missingSpec, extra_openapi: extraSpec };
fs.writeFileSync(path.join(out, 'conteos.json'), JSON.stringify(count, null, 2) + '\n');
console.log(JSON.stringify({ ...count, missing_openapi: missingSpec.length, extra_openapi: extraSpec.length }));

// Fase 0 (ronda 2) — inventario estático en dos bases: árbol de trabajo (WT) y HEAD.
// Solo lectura: no inicia NestJS/Next, no toca base de datos, no modifica archivos fuera de esta carpeta.
// HEAD se lee con `git ls-tree` / `git show HEAD:<ruta>` (sin checkout ni archivos temporales).
// Uso (desde la raíz de Sterinova-Backend):  node docs/auditoria-contratos/ronda2/fase0/generar-fase0.cjs
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const OUT = __dirname;
const BACKEND = path.resolve(OUT, '../../../..');
const FRONTEND = path.resolve(BACKEND, '../SterinovaFrontend');
const ts = require(path.join(BACKEND, 'node_modules/typescript'));

// ---------------------------------------------------------------- utilidades
const git = (root, args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
const q = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;
const writeCsv = (name, headers, rows) =>
  fs.writeFileSync(path.join(OUT, name), [headers, ...rows].map((r) => r.map(q).join(',')).join('\n') + '\n', 'utf8');

/** Vista de archivos de un repo en una base ('WT' o 'HEAD'). Rutas relativas con '/'. */
function makeRepo(root, base) {
  const cache = new Map();
  let headList = null;
  const list = (dir, filter) => {
    if (base === 'HEAD') {
      headList ??= git(root, ['ls-tree', '-r', '--name-only', 'HEAD']).split('\n').filter(Boolean);
      return headList.filter((f) => f.startsWith(dir + '/') && filter(f));
    }
    const walk = (d) => {
      const abs = path.join(root, d);
      if (!fs.existsSync(abs)) return [];
      return fs.readdirSync(abs, { withFileTypes: true }).flatMap((e) => {
        const r = `${d}/${e.name}`;
        if (e.isDirectory()) return e.name === 'node_modules' ? [] : walk(r);
        return filter(r) ? [r] : [];
      });
    };
    return walk(dir);
  };
  const read = (rel) => {
    if (cache.has(rel)) return cache.get(rel);
    let text = null;
    try {
      text = base === 'HEAD' ? git(root, ['show', `HEAD:${rel}`]) : fs.readFileSync(path.join(root, rel), 'utf8');
    } catch { text = null; }
    cache.set(rel, text);
    return text;
  };
  return { root, base, list, read };
}

const parse = (rel, text) =>
  ts.createSourceFile(rel, text, ts.ScriptTarget.Latest, true, rel.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
const lineOf = (sf, node) => sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
function visit(node, fn) { fn(node); ts.forEachChild(node, (c) => visit(c, fn)); }
const lit = (n) => {
  if (!n) return undefined;
  if (ts.isStringLiteralLike(n)) return n.text;
  if (n.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (n.kind === ts.SyntaxKind.FalseKeyword) return false;
  return undefined;
};
const decos = (n) => (ts.canHaveDecorators(n) ? ts.getDecorators(n) ?? [] : []);
const deco = (n, name) =>
  decos(n).find((d) => ts.isCallExpression(d.expression) && d.expression.expression.getText() === name)?.expression;
const prop = (obj, name) =>
  obj && ts.isObjectLiteralExpression(obj)
    ? obj.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText() === name)?.initializer
    : undefined;
const joinRoute = (a, b) => '/' + [a, b].filter(Boolean).join('/').replace(/^\/+|\/+$/g, '').replace(/\/{2,}/g, '/');
const pathArgs = (arg) => {
  if (!arg) return [''];
  if (ts.isArrayLiteralExpression(arg)) return arg.elements.map((e) => lit(e) ?? `NO_RESUELTO(${e.getText()})`);
  if (ts.isObjectLiteralExpression(arg)) return pathArgs(prop(arg, 'path'));
  const v = lit(arg);
  return [typeof v === 'string' ? v : `NO_RESUELTO(${arg.getText()})`];
};

// ---------------------------------------------------------------- backend: endpoints
const VERBS = ['Get', 'Post', 'Put', 'Patch', 'Delete', 'All', 'Head', 'Options'];
function backendEndpoints(repo) {
  const rows = [];
  for (const rel of repo.list('src', (f) => f.endsWith('.controller.ts'))) {
    const sf = parse(rel, repo.read(rel));
    for (const cls of sf.statements.filter(ts.isClassDeclaration)) {
      const c = deco(cls, 'Controller');
      if (!c) continue;
      const prefixes = pathArgs(c.arguments[0]);
      const clsScoped = Boolean(deco(cls, 'ScopedPermissions'));
      const clsPublic = Boolean(deco(cls, 'Public'));
      const clsSession = Boolean(deco(cls, 'RequireSession'));
      for (const m of cls.members.filter(ts.isMethodDeclaration)) {
        for (const verb of VERBS) {
          const d = deco(m, verb);
          if (!d) continue;
          const permNode = deco(m, 'RequirePermission');
          const perm = permNode ? lit(permNode.arguments[0]) ?? `NO_RESUELTO(${permNode.arguments[0]?.getText()})` : '';
          const mPublic = Boolean(deco(m, 'Public'));
          const scoped = Boolean(deco(m, 'ScopedPermissions')) || clsScoped;
          const session = Boolean(deco(m, 'RequireSession')) || clsSession;
          // Réplica estática de AuthorizationGuard (src/rbac/authorization.guard.ts:60-89) y PermissionGuard (:33-49).
          let politica;
          if (mPublic) politica = 'PUBLICO';
          else if (scoped) politica = perm ? 'PERMISO' : 'DENEGADO_SCOPED_SIN_PERMISO';
          else if (perm) politica = 'DENEGADO_PERMISO_SIN_SCOPED';
          else if (clsPublic) politica = 'PUBLICO';
          else if (session) politica = 'SESION';
          else politica = 'DENEGADO_SIN_POLITICA';
          for (const pre of prefixes)
            for (const suf of pathArgs(d.arguments[0]))
              rows.push({
                modulo: rel.split('/')[1],
                metodo: verb.toUpperCase(),
                ruta: joinRoute(pre, suf),
                archivo: rel,
                linea: lineOf(sf, d),
                permiso: perm,
                publico: mPublic || (clsPublic && !scoped),
                politica,
                handler: `${cls.name?.text ?? '?'}.${m.name.getText(sf)}`,
              });
        }
      }
    }
  }
  return rows.sort((a, b) => a.ruta.localeCompare(b.ruta) || a.metodo.localeCompare(b.metodo));
}

/** Controladores alcanzables desde AppModule por `imports` (estático; ignora módulos dinámicos con forRoot salvo por nombre). */
function mountedControllers(repo) {
  const modules = new Map();
  for (const rel of repo.list('src', (f) => f.endsWith('.module.ts'))) {
    const sf = parse(rel, repo.read(rel));
    for (const cls of sf.statements.filter(ts.isClassDeclaration)) {
      const m = deco(cls, 'Module');
      if (!m) continue;
      const ids = (n) => (n && ts.isArrayLiteralExpression(n) ? n.elements.map((e) => e.getText(sf).split(/[.(]/)[0].trim()) : []);
      modules.set(cls.name.text, { controllers: ids(prop(m.arguments[0], 'controllers')), imports: ids(prop(m.arguments[0], 'imports')) });
    }
  }
  const seen = new Set(), ctrls = new Set(), stack = ['AppModule'];
  while (stack.length) {
    const name = stack.pop();
    if (seen.has(name) || !modules.has(name)) continue;
    seen.add(name);
    modules.get(name).controllers.forEach((c) => ctrls.add(c));
    stack.push(...modules.get(name).imports);
  }
  return ctrls;
}

function openapiEndpoints(repo) {
  const text = repo.read('docs/arquitectura/openapi.json');
  if (!text) return null;
  const spec = JSON.parse(text);
  const out = new Map();
  for (const [route, methods] of Object.entries(spec.paths ?? {}))
    for (const [m, op] of Object.entries(methods))
      if (['get', 'post', 'put', 'patch', 'delete', 'head', 'options'].includes(m))
        out.set(`${m.toUpperCase()} ${route.replace(/\{([^}]+)\}/g, ':$1')}`, op?.['x-required-permission'] ?? '');
  return out;
}

// ---------------------------------------------------------------- backend: permisos
function backendPermissions(repo, endpoints) {
  const catRel = 'src/rbac/permission-catalog.ts';
  const sf = parse(catRel, repo.read(catRel));
  const decl = sf.statements.filter(ts.isVariableStatement).flatMap((s) => [...s.declarationList.declarations])
    .find((d) => d.name.getText() === 'PERMISSION_CATALOG');
  let arr = decl.initializer;
  while (ts.isAsExpression(arr) || ts.isSatisfiesExpression?.(arr) || ts.isParenthesizedExpression(arr)) arr = arr.expression;
  const catalog = arr.elements.map((el) => ({
    code: lit(prop(el, 'code')), module: lit(prop(el, 'module')), dynamic: lit(prop(el, 'isDynamic')) === true, line: lineOf(sf, el),
  }));

  // Roles del snapshot SeedBackendRoles.
  const seedRel = 'src/database/migrations/1794312001000-SeedBackendRoles.ts';
  const seed = parse(seedRel, repo.read(seedRel));
  const vars = new Map();
  for (const st of seed.statements.filter(ts.isVariableStatement)) for (const d of st.declarationList.declarations) vars.set(d.name.getText(), d.initializer);
  const codes = (n, depth = 0) => {
    if (!n || depth > 15) return [];
    if (ts.isAsExpression(n) || ts.isParenthesizedExpression(n)) return codes(n.expression, depth + 1);
    if (ts.isIdentifier(n)) return codes(vars.get(n.text), depth + 1);
    if (ts.isCallExpression(n) && n.expression.getText() === 'grants') return codes(n.arguments[0], depth + 1);
    if (ts.isArrayLiteralExpression(n))
      return n.elements.flatMap((e) => (ts.isSpreadElement(e) ? codes(e.expression, depth + 1) : typeof lit(e) === 'string' ? [lit(e)] : codes(e, depth + 1)));
    return [];
  };
  const roles = new Map();
  let rolesNode = vars.get('BACKEND_ROLES');
  while (ts.isAsExpression(rolesNode)) rolesNode = rolesNode.expression;
  for (const r of rolesNode.elements) for (const c of codes(prop(r, 'grants'))) {
    if (!roles.has(c)) roles.set(c, new Set());
    roles.get(c).add(lit(prop(r, 'code')));
  }
  const future = new Set(codes(vars.get('FUTURE_PERMISSIONS')));

  // Menciones literales en migraciones (no specs).
  const migs = repo.list('src/database/migrations', (f) => f.endsWith('.ts') && !f.endsWith('.spec.ts'));
  const mentions = new Map();
  const migLiterals = new Map(); // literales con forma de permiso en migraciones
  for (const rel of migs) {
    const msf = parse(rel, repo.read(rel));
    visit(msf, (n) => {
      if (ts.isStringLiteralLike(n) && /^[a-z_]+(\.[a-z_]+)+$/.test(n.text)) {
        if (!migLiterals.has(n.text)) migLiterals.set(n.text, new Set());
        migLiterals.get(n.text).add(path.basename(rel).split('-')[0]);
      }
    });
  }
  for (const [code, set] of migLiterals) mentions.set(code, set);
  const useCount = new Map();
  for (const e of endpoints) if (e.permiso) useCount.set(e.permiso, (useCount.get(e.permiso) ?? 0) + 1);

  const rows = catalog.map((c) => ({
    codigo: c.code, modulo: c.module,
    activo: future.has(c.code) ? 'INACTIVO_EN_SEED' : 'NO_VERIFICADO_DB',
    dinamico: c.dynamic,
    roles: [...(roles.get(c.code) ?? [])].sort().join('|'),
    migraciones: [...(mentions.get(c.code) ?? [])].sort().join('|'),
    endpoints: useCount.get(c.code) ?? 0,
    linea: c.line,
  })).sort((a, b) => a.codigo.localeCompare(b.codigo));
  const catSet = new Set(catalog.map((c) => c.code));
  const migOnly = [...migLiterals.keys()].filter((k) => !catSet.has(k) && !/\.(ts|js|json|sql)$/.test(k)).sort()
    .map((k) => ({ codigo: k, migraciones: [...migLiterals.get(k)].sort().join('|') }));
  const endpointNotInCatalog = [...useCount.keys()].filter((k) => !catSet.has(k));
  return { rows, migOnly, endpointNotInCatalog };
}

// ---------------------------------------------------------------- frontend: llamadas HTTP y permisos
// Variables de URL base; se aceptan también llamadas encadenadas como `API_BASE_URL.replace(...)`.
const BASE_VARS = /^(API_BASE_URL|API_URL|baseURL|baseUrl|apiUrl|process\.env\.NEXT_PUBLIC_API_URL)(\.|$)/;
function localConst(sf, name) {
  let found;
  visit(sf, (n) => { if (!found && ts.isVariableDeclaration(n) && n.name.getText(sf) === name && n.initializer) found = n.initializer; });
  return found;
}
function resolvePath(node, sf, depth = 0) {
  if (!node) return { v: 'SIN_ARGUMENTO', d: 'NO_RESUELTA' };
  if (depth > 4) return { v: node.getText(sf).replace(/\s+/g, ' ').slice(0, 160), d: 'NO_RESUELTA' };
  const norm = (s) => s.replace(/\?.*$/, '').replace(/\/{2,}/g, '/');
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return { v: norm(node.text), d: 'NO' };
  if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node)) return resolvePath(node.expression, sf, depth + 1);
  if (ts.isTemplateExpression(node)) {
    let v = node.head.text;
    node.templateSpans.forEach((span, i) => {
      const expr = span.expression.getText(sf);
      if (i === 0 && v === '' && BASE_VARS.test(expr)) { v += span.literal.text; return; }
      const isQuery = !v.endsWith('/') && /^(params|query|qs|search|searchParams|queryString)(\.toString\(\))?$/.test(expr) && !span.literal.text;
      const isQuerySuffix = v.includes('?');
      v += (isQuery || isQuerySuffix ? '' : ':id') + span.literal.text;
    });
    return { v: norm(v), d: 'SI' };
  }
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const l = resolvePath(node.left, sf, depth + 1), r = resolvePath(node.right, sf, depth + 1);
    if (l.d === 'NO_RESUELTA' || r.d === 'NO_RESUELTA') return { v: node.getText(sf).replace(/\s+/g, ' ').slice(0, 160), d: 'NO_RESUELTA' };
    return { v: norm(l.v + r.v), d: 'SI' };
  }
  if (ts.isIdentifier(node)) {
    const init = localConst(sf, node.text);
    if (init) {
      const r = resolvePath(init, sf, depth + 1);
      if (r.d !== 'NO_RESUELTA') return { v: r.v, d: 'VIA_CONSTANTE' };
    }
  }
  return { v: node.getText(sf).replace(/\s+/g, ' ').slice(0, 160), d: 'NO_RESUELTA' };
}

const PERM_SHAPE = /^[a-z][a-z_]*(\.[a-z_]+)+$/;
const NOT_PERM = /\.(pdf|xlsx|xlsm|xls|csv|png|jpe?g|svg|json|ts|tsx|js|mjs|css|html|md|txt|docx?)$/;
const PERM_CALLS = new Set(['can', 'canManageGlobal', 'hasRequiredPermission', 'canAccessPath', 'hasPermission', 'canAny', 'canAll']);
const PERM_PROPS = /^(permission|permissions|globalPermissions|requiredPermission|requiredPermissions|anyPermission|anyPermissions)$/;

function frontendScan(repo, catalogCodes) {
  const calls = [], perms = [];
  const files = repo.list('src', (f) => /\.(ts|tsx)$/.test(f) && !f.endsWith('.d.ts'));
  for (const rel of files) {
    const text = repo.read(rel);
    if (text == null) continue;
    const sf = parse(rel, text);
    const seen = new Set();
    const addPerm = (node, value, ctx) => {
      const k = `${node.pos}:${value}`;
      if (seen.has(k)) return;
      seen.add(k);
      perms.push({ archivo: rel, linea: lineOf(sf, node), permiso: value, contexto: ctx });
    };
    visit(sf, (n) => {
      if (ts.isCallExpression(n)) {
        const callee = n.expression.getText(sf);
        const m = /^(api|axios|http|client)\.(get|post|put|patch|delete)$/.exec(callee);
        const isDl = callee === 'downloadPdfFromBackend';
        const isFetch = callee === 'fetch' || callee === 'window.fetch';
        if (m || isDl || isFetch) {
          const r = resolvePath(n.arguments[0], sf);
          let metodo = m ? m[2].toUpperCase() : isDl ? 'GET' : 'FETCH';
          if (isFetch) {
            const meth = lit(prop(n.arguments[1], 'method'));
            if (typeof meth === 'string') metodo = `FETCH_${meth.toUpperCase()}`;
          }
          calls.push({ archivo: rel, linea: lineOf(sf, n), metodo, ruta: r.v, dinamica: r.d, via: m ? m[1] : isDl ? 'downloadPdfFromBackend' : 'fetch' });
        }
        const short = callee.split('.').pop();
        // hasRequiredPermission(permisosDelUsuario, requerido): el permiso exigido es el 2.º argumento.
        const argIdx = short === 'hasRequiredPermission' ? 1 : 0;
        const arg = n.arguments[argIdx];
        if (PERM_CALLS.has(short) && arg && short !== 'canAccessPath') {
          const v = lit(arg);
          if (typeof v === 'string') addPerm(arg, v, `llamada:${short}`);
          else {
            let any = false;
            visit(arg, (c) => { if (ts.isStringLiteralLike(c) && PERM_SHAPE.test(c.text)) { any = true; addPerm(c, c.text, `llamada:${short}:condicional`); } });
            if (!any) addPerm(arg, arg.getText(sf).replace(/\s+/g, ' ').slice(0, 100), `llamada:${short}:NO_RESUELTO`);
          }
        }
      }
      if (ts.isPropertyAssignment(n) && PERM_PROPS.test(n.name.getText(sf).replace(/['"]/g, ''))) {
        visit(n.initializer, (c) => { if (ts.isStringLiteralLike(c) && PERM_SHAPE.test(c.text)) addPerm(c, c.text, `propiedad:${n.name.getText(sf)}`); });
      }
      if (ts.isBinaryExpression(n) && [ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.EqualsEqualsToken].includes(n.operatorToken.kind)) {
        const [a, b] = [n.left, n.right];
        for (const [x, y] of [[a, b], [b, a]])
          if (ts.isStringLiteralLike(y) && PERM_SHAPE.test(y.text) && /permission/i.test(x.getText(sf))) addPerm(y, y.text, 'comparacion');
      }
    });
    // Segunda pasada: literales que coinciden exactamente con el catálogo y no se capturaron por contexto.
    visit(sf, (n) => {
      if (ts.isStringLiteralLike(n) && catalogCodes.has(n.text)) addPerm(n, n.text, 'literal_en_catalogo');
    });
    // Tercera pasada (navegación y cabecera): literales con forma de permiso fuera del catálogo.
    if (/(navigation\.ts|Sidebar\.tsx|Header\.tsx|dashboard\.ts)$/.test(rel))
      visit(sf, (n) => {
        if (ts.isStringLiteralLike(n) && PERM_SHAPE.test(n.text) && !NOT_PERM.test(n.text) && !catalogCodes.has(n.text)) addPerm(n, n.text, 'literal_forma_permiso');
      });
  }
  const order = (a, b) => a.archivo.localeCompare(b.archivo) || a.linea - b.linea;
  return { calls: calls.sort(order), perms: perms.sort(order), files: files.length };
}

// ---------------------------------------------------------------- comparación WT vs HEAD
function multisetBase(wtRows, headRows, keyFn) {
  const headBuckets = new Map();
  for (const r of headRows) { const k = keyFn(r); if (!headBuckets.has(k)) headBuckets.set(k, []); headBuckets.get(k).push(r); }
  const wtOut = wtRows.map((r) => {
    const b = headBuckets.get(keyFn(r));
    if (b?.length) { const h = b.shift(); return { ...r, base: 'AMBOS', head: h }; }
    return { ...r, base: 'SOLO_EN_WORKTREE', head: null };
  });
  const headOnly = [...headBuckets.values()].flat().map((h) => ({ ...h, base: 'SOLO_EN_HEAD', head: h }));
  return [...wtOut, ...headOnly];
}

// ---------------------------------------------------------------- ejecución
const t0 = Date.now();
const repos = {
  bWT: makeRepo(BACKEND, 'WT'), bHEAD: makeRepo(BACKEND, 'HEAD'),
  fWT: makeRepo(FRONTEND, 'WT'), fHEAD: makeRepo(FRONTEND, 'HEAD'),
};
const commit = (root) => git(root, ['rev-parse', '--short', 'HEAD']).trim();
const meta = { backend_head: commit(BACKEND), frontend_head: commit(FRONTEND), generado: new Date().toISOString() };

// 1. Endpoints backend
const epWT = backendEndpoints(repos.bWT), epHEAD = backendEndpoints(repos.bHEAD);
const epKey = (r) => `${r.metodo} ${r.ruta}`;
const epAll = multisetBase(epWT, epHEAD, epKey).map((r) => {
  let dif = '';
  if (r.base === 'AMBOS') {
    const d = [];
    if (r.head.permiso !== r.permiso) d.push(`permiso HEAD=${r.head.permiso || '(ninguno)'}`);
    if (r.head.politica !== r.politica) d.push(`politica HEAD=${r.head.politica}`);
    if (r.head.archivo !== r.archivo) d.push(`archivo HEAD=${r.head.archivo}`);
    dif = d.join('; ');
  }
  return { ...r, dif };
});
const oaWT = openapiEndpoints(repos.bWT), oaHEAD = openapiEndpoints(repos.bHEAD);
const mountWT = mountedControllers(repos.bWT), mountHEAD = mountedControllers(repos.bHEAD);
const isMounted = (r) => (r.base === 'SOLO_EN_HEAD' ? mountHEAD : mountWT).has(r.handler.split('.')[0]);
writeCsv('endpoints-backend.csv',
  ['modulo', 'metodo', 'ruta_completa', 'archivo', 'linea', 'permiso', 'publico', 'politica_efectiva', 'handler', 'montado_desde_appmodule', 'base', 'linea_head', 'diferencia_vs_head', 'en_openapi_wt'],
  epAll.map((r) => [r.modulo, r.metodo, r.ruta, r.archivo, r.base === 'SOLO_EN_HEAD' ? '' : r.linea, r.permiso, r.publico, r.politica, r.handler, isMounted(r), r.base,
    r.head?.linea ?? '', r.dif, r.base === 'SOLO_EN_HEAD' ? '' : oaWT ? oaWT.has(epKey(r)) : 'SIN_OPENAPI']));
const dupKeys = (rows) => { const c = new Map(); rows.forEach((r) => c.set(epKey(r), (c.get(epKey(r)) ?? 0) + 1)); return [...c].filter(([, n]) => n > 1).map(([k]) => k); };
const oaDiff = (oa, eps) => {
  if (!oa) return null;
  const s = new Set(eps.map(epKey));
  return {
    total: oa.size,
    en_codigo_no_en_openapi: [...s].filter((k) => !oa.has(k)),
    en_openapi_no_en_codigo: [...oa.keys()].filter((k) => !s.has(k)),
    permiso_distinto: eps.filter((e) => oa.has(epKey(e)) && (oa.get(epKey(e)) || '') !== e.permiso).map((e) => `${epKey(e)} codigo=${e.permiso || '-'} openapi=${oa.get(epKey(e)) || '-'}`),
  };
};

// 2. Permisos backend
const pWT = backendPermissions(repos.bWT, epWT), pHEAD = backendPermissions(repos.bHEAD, epHEAD);
const pAll = multisetBase(pWT.rows, pHEAD.rows, (r) => r.codigo).map((r) => {
  const d = [];
  if (r.base === 'AMBOS') {
    for (const f of ['modulo', 'activo', 'dinamico', 'roles', 'endpoints']) if (String(r.head[f]) !== String(r[f])) d.push(`${f} HEAD=${r.head[f]}`);
  }
  return { ...r, dif: d.join('; ') };
});
writeCsv('permisos-backend.csv',
  ['codigo', 'modulo', 'activo', 'dinamico', 'roles_que_lo_tienen', 'migraciones_que_lo_mencionan', 'endpoints_que_lo_exigen', 'linea_catalogo', 'base', 'diferencia_vs_head'],
  pAll.map((r) => [r.codigo, r.modulo, r.activo, r.dinamico, r.roles, r.migraciones, r.endpoints, r.base === 'SOLO_EN_HEAD' ? '' : r.linea, r.base, r.dif]));

// 3-4. Frontend
const catalogCodes = new Set(pWT.rows.map((r) => r.codigo));
const fWT = frontendScan(repos.fWT, catalogCodes), fHEAD = frontendScan(repos.fHEAD, catalogCodes);
const callKey = (r) => `${r.archivo}|${r.metodo}|${r.ruta}`;
const callLooseKey = (r) => `${r.metodo}|${r.ruta}`;
const callsAll = multisetBase(fWT.calls, fHEAD.calls, callKey);
// Para filas SOLO_* comprobar si el mismo método+ruta existe en la otra base en otro archivo (movimiento de archivo).
const wtLoose = new Set(fWT.calls.map(callLooseKey)), headLoose = new Set(fHEAD.calls.map(callLooseKey));
writeCsv('endpoints-frontend.csv',
  ['archivo', 'linea', 'metodo', 'ruta_usada', 'es_dinamica', 'via', 'base', 'linea_head', 'nota_base'],
  callsAll.map((r) => [r.archivo, r.base === 'SOLO_EN_HEAD' ? '' : r.linea, r.metodo, r.ruta, r.dinamica, r.via, r.base, r.head?.linea ?? '',
    r.base === 'SOLO_EN_WORKTREE' ? (headLoose.has(callLooseKey(r)) ? 'ruta existe en HEAD en otro archivo (archivo movido/refactor)' : 'ruta nueva en worktree')
      : r.base === 'SOLO_EN_HEAD' ? (wtLoose.has(callLooseKey(r)) ? 'ruta sigue en worktree en otro archivo' : 'ruta eliminada en worktree') : '']));
const permKey = (r) => `${r.archivo}|${r.permiso}|${r.contexto}`;
const permsAll = multisetBase(fWT.perms, fHEAD.perms, permKey);
const wtPermCodes = new Set(fWT.perms.map((p) => p.permiso)), headPermCodes = new Set(fHEAD.perms.map((p) => p.permiso));
writeCsv('permisos-frontend.csv',
  ['archivo', 'linea', 'permiso', 'contexto', 'en_catalogo_backend_wt', 'base', 'linea_head', 'nota_base'],
  permsAll.map((r) => [r.archivo, r.base === 'SOLO_EN_HEAD' ? '' : r.linea, r.permiso, r.contexto, catalogCodes.has(r.permiso), r.base, r.head?.linea ?? '',
    r.base === 'SOLO_EN_WORKTREE' ? (headPermCodes.has(r.permiso) ? 'código ya usado en HEAD en otro archivo' : 'código nuevo en worktree')
      : r.base === 'SOLO_EN_HEAD' ? (wtPermCodes.has(r.permiso) ? 'código sigue usado en worktree' : 'código ya no se usa en worktree') : '']));

// 5. Versiones
function versions() {
  const rows = [];
  const pkgAt = (repo) => JSON.parse(repo.read('package.json'));
  const lockAt = (repo) => { const t = repo.read('package-lock.json'); return t ? JSON.parse(t) : {}; };
  const installed = (root, name) => {
    try { return JSON.parse(fs.readFileSync(path.join(root, 'node_modules', name, 'package.json'), 'utf8')).version; } catch { return 'NO_INSTALADO'; }
  };
  for (const [proj, wt, head] of [['Backend', repos.bWT, repos.bHEAD], ['Frontend', repos.fWT, repos.fHEAD]]) {
    const p = pkgAt(wt), ph = pkgAt(head), l = lockAt(wt);
    const all = { ...Object.fromEntries(Object.entries(p.dependencies ?? {}).map(([k, v]) => [k, ['dep', v]])), ...Object.fromEntries(Object.entries(p.devDependencies ?? {}).map(([k, v]) => [k, ['dev', v]])) };
    const headAll = { ...(ph.dependencies ?? {}), ...(ph.devDependencies ?? {}) };
    for (const k of Object.keys(headAll)) if (!all[k]) all[k] = ['(eliminada)', ''];
    for (const [name, [kind, decl]] of Object.entries(all).sort(([a], [b]) => a.localeCompare(b))) {
      const hv = headAll[name] ?? '';
      const base = !hv ? 'SOLO_EN_WORKTREE' : !decl ? 'SOLO_EN_HEAD' : hv === decl ? 'AMBOS' : 'AMBOS_DIFIERE';
      rows.push([proj, name, kind, decl, hv, l.packages?.[`node_modules/${name}`]?.version ?? 'NO_FIJADO', installed(wt.root, name), base]);
    }
    rows.push([proj, '(name)', 'meta', p.name, ph.name, '', '', p.name === ph.name ? 'AMBOS' : 'AMBOS_DIFIERE']);
    rows.push([proj, '(engines.node)', 'meta', p.engines?.node ?? '', ph.engines?.node ?? '', '', process.version, '']);
    rows.push([proj, '(engines.npm)', 'meta', p.engines?.npm ?? '', ph.engines?.npm ?? '', '', 'ver README', '']);
  }
  return rows;
}
const verRows = versions();

// conteos
const count = (rows, base) => rows.filter((r) => r.base === base).length;
const summary = {
  ...meta,
  backend_endpoints: { worktree: epWT.length, head: epHEAD.length, ambos: count(epAll, 'AMBOS'), solo_worktree: count(epAll, 'SOLO_EN_WORKTREE'), solo_head: count(epAll, 'SOLO_EN_HEAD'), ambos_con_diferencia: epAll.filter((r) => r.dif).length, duplicados_wt: dupKeys(epWT), duplicados_head: dupKeys(epHEAD) },
  politica_efectiva_wt: epWT.reduce((a, r) => ((a[r.politica] = (a[r.politica] ?? 0) + 1), a), {}),
  controladores: { worktree: new Set(epWT.map((r) => r.archivo)).size, head: new Set(epHEAD.map((r) => r.archivo)).size },
  openapi: { worktree: oaDiff(oaWT, epWT), head: oaDiff(oaHEAD, epHEAD) },
  backend_permisos: { worktree: pWT.rows.length, head: pHEAD.rows.length, solo_worktree: count(pAll, 'SOLO_EN_WORKTREE'), solo_head: count(pAll, 'SOLO_EN_HEAD'), ambos_con_diferencia: pAll.filter((r) => r.dif).length, sin_endpoint_wt: pWT.rows.filter((r) => !r.endpoints).length, permisos_endpoint_fuera_catalogo_wt: pWT.endpointNotInCatalog, literales_migracion_fuera_catalogo_wt: pWT.migOnly },
  frontend_llamadas: { archivos_ts_wt: fWT.files, archivos_ts_head: fHEAD.files, worktree: fWT.calls.length, head: fHEAD.calls.length, solo_worktree: count(callsAll, 'SOLO_EN_WORKTREE'), solo_head: count(callsAll, 'SOLO_EN_HEAD'), no_resueltas_wt: fWT.calls.filter((c) => c.dinamica === 'NO_RESUELTA').length, rutas_unicas_wt: wtLoose.size, rutas_unicas_head: headLoose.size, rutas_solo_wt: [...wtLoose].filter((k) => !headLoose.has(k)), rutas_solo_head: [...headLoose].filter((k) => !wtLoose.has(k)) },
  backend_no_montados: { worktree: epWT.filter((r) => !mountWT.has(r.handler.split('.')[0])).map(epKey), head: epHEAD.filter((r) => !mountHEAD.has(r.handler.split('.')[0])).map(epKey) },
  frontend_permisos: { worktree: fWT.perms.length, head: fHEAD.perms.length, solo_worktree: count(permsAll, 'SOLO_EN_WORKTREE'), solo_head: count(permsAll, 'SOLO_EN_HEAD'), codigos_unicos_wt: wtPermCodes.size, codigos_unicos_head: headPermCodes.size, codigos_solo_wt: [...wtPermCodes].filter((c) => !headPermCodes.has(c)), codigos_solo_head: [...headPermCodes].filter((c) => !wtPermCodes.has(c)), no_resueltos_wt: fWT.perms.filter((p) => p.contexto.endsWith('NO_RESUELTO')).length, codigos_fuera_catalogo_wt: [...new Set(fWT.perms.filter((p) => !p.contexto.endsWith('NO_RESUELTO')).map((p) => p.permiso))].filter((c) => !catalogCodes.has(c)).sort() },
  duracion_ms: 0,
};
writeCsv('versiones.csv', ['proyecto', 'paquete', 'tipo', 'declarada_wt', 'declarada_head', 'lockfile_wt', 'instalada_node_modules', 'base'], verRows);
summary.duracion_ms = Date.now() - t0;

// 6. Cambios sin commitear (git status), agrupados por carpeta.
function changes(root, label) {
  const collapsed = git(root, ['status', '--porcelain=v1']).split('\n').filter(Boolean);
  const expanded = git(root, ['status', '--porcelain=v1', '-uall']).split('\n').filter(Boolean);
  const numstat = new Map();
  for (const l of git(root, ['diff', 'HEAD', '--numstat']).split('\n').filter(Boolean)) {
    const [a, d, f] = l.split('\t');
    numstat.set(f, `+${a}/-${d}`);
  }
  const STATUS = { M: 'modificado', D: 'eliminado', A: 'añadido', R: 'renombrado', '??': 'sin seguimiento' };
  const groupOf = (f) => { const p = f.replace(/\/$/, '').split('/'); return p.length <= 1 ? '(raíz)' : p.slice(0, Math.min(p.length - 1, 3)).join('/') + '/'; };
  const isAudit = (f) => f.startsWith('docs/auditoria-contratos/');
  const entries = collapsed.map((l) => {
    const code = l.slice(0, 2).trim(), file = l.slice(3).replace(/^"|"$/g, '');
    const inner = code === '??' && file.endsWith('/') ? expanded.filter((e) => e.slice(3).startsWith(file)).length : 0;
    return { code, file, inner };
  });
  const groups = new Map();
  for (const e of entries) { const g = groupOf(e.file); if (!groups.has(g)) groups.set(g, []); groups.get(g).push(e); }
  const byCode = entries.reduce((a, e) => ((a[e.code] = (a[e.code] ?? 0) + 1), a), {});
  let md = `## ${label}\n\n- HEAD: \`${git(root, ['rev-parse', '--short', 'HEAD']).trim()}\` en rama \`${git(root, ['rev-parse', '--abbrev-ref', 'HEAD']).trim()}\`\n`;
  md += `- Entradas de \`git status --porcelain\` (carpetas sin seguimiento colapsadas): **${collapsed.length}** — ${Object.entries(byCode).map(([k, v]) => `${STATUS[k] ?? k}: ${v}`).join(', ')}\n`;
  md += `- Archivos individuales (\`-uall\`): **${expanded.length}**\n\n`;
  md += '| Carpeta | Estado | Archivo | Líneas (+/-) vs HEAD | Nota |\n|---|---|---|---|---|\n';
  for (const [g, list] of [...groups].sort(([a], [b]) => a.localeCompare(b)))
    for (const e of list.sort((a, b) => a.file.localeCompare(b.file)))
      md += `| \`${g}\` | ${STATUS[e.code] ?? e.code} | \`${e.file}\` | ${numstat.get(e.file) ?? (e.inner ? `${e.inner} archivos` : '')} | ${isAudit(e.file) ? '**salida de auditoría** (ronda previa + esta ronda)' : ''} |\n`;
  return { md, collapsed: collapsed.length, expanded: expanded.length, byCode };
}
const chB = changes(BACKEND, 'Backend (`Sterinova-Backend`)'), chF = changes(FRONTEND, 'Frontend (`SterinovaFrontend`)');
const auditFiles = git(BACKEND, ['status', '--porcelain=v1', '-uall', '--', 'docs/auditoria-contratos']).split('\n').filter(Boolean).map((l) => l.slice(3));
let chMd = `# Cambios sin commitear — base de la auditoría\n\nGenerado por \`generar-fase0.cjs\` (${meta.generado}). Comandos: \`git status --porcelain=v1\`, \`git status --porcelain=v1 -uall\`, \`git diff HEAD --numstat\`.\n\n`;
chMd += `> La carpeta \`docs/auditoria-contratos/\` es salida de auditoría, no trabajo previo del producto. Contiene ${auditFiles.length} archivos: los de \`fase0..fase3/\` existían antes de esta ronda; los de \`ronda2/\` los crea esta ronda.\n\n`;
chMd += chB.md + '\n' + chF.md + '\n## Archivos de salida de auditoría (excluir del trabajo previo)\n\n' + auditFiles.map((f) => `- \`${f}\``).join('\n') + '\n';
fs.writeFileSync(path.join(OUT, 'cambios-sin-commitear.md'), chMd, 'utf8');
summary.cambios = { backend: { colapsado: chB.collapsed, uall: chB.expanded, ...chB.byCode }, frontend: { colapsado: chF.collapsed, uall: chF.expanded, ...chF.byCode }, salida_auditoria: auditFiles.length };
fs.writeFileSync(path.join(OUT, 'conteos.json'), JSON.stringify(summary, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ be: summary.backend_endpoints, oa: { wt: summary.openapi.worktree && { total: summary.openapi.worktree.total, falta: summary.openapi.worktree.en_codigo_no_en_openapi.length, sobra: summary.openapi.worktree.en_openapi_no_en_codigo.length, perm: summary.openapi.worktree.permiso_distinto.length } }, pol: summary.politica_efectiva_wt, bp: { wt: summary.backend_permisos.worktree, head: summary.backend_permisos.head }, fl: summary.frontend_llamadas, fp: { wt: summary.frontend_permisos.worktree, head: summary.frontend_permisos.head, fuera: summary.frontend_permisos.codigos_fuera_catalogo_wt.length }, ms: summary.duracion_ms }));

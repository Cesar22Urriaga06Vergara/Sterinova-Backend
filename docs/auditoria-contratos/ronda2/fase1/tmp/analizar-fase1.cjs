// Fase 1 (ronda 2) — Verificación independiente de Fase 0 (V1, V2, V4) y cruce de contratos/permisos.
// Solo lectura sobre ambos repos. Escribe únicamente en ronda2/fase1/tmp/.
// Uso (desde raíz de Sterinova-Backend): node docs/auditoria-contratos/ronda2/fase1/tmp/analizar-fase1.cjs
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const TMP = __dirname;
const FASE1 = path.resolve(TMP, '..');
const FASE0 = path.resolve(FASE1, '../fase0');
const BACKEND = path.resolve(FASE1, '../../../..');
const FRONTEND = path.resolve(BACKEND, '../SterinovaFrontend');

const git = (root, args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });

function parseCsv(file) {
  const text = fs.readFileSync(file, 'utf8').trim();
  const lines = text.split(/\r?\n/);
  const parseLine = (line) => {
    const out = [];
    let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQ) {
        if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') inQ = false;
        else cur += ch;
      } else {
        if (ch === '"') inQ = true;
        else if (ch === ',') { out.push(cur); cur = ''; }
        else cur += ch;
      }
    }
    out.push(cur);
    return out;
  };
  const headers = parseLine(lines[0]);
  return lines.slice(1).map((l) => {
    const vals = parseLine(l);
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']));
  });
}

function walk(dir, filter, excl = new Set(['node_modules', '.next', 'dist', 'build', 'coverage', '.turbo', 'storage'])) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (excl.has(e.name)) continue;
      out.push(...walk(path.join(dir, e.name), filter, excl));
    } else {
      const full = path.join(dir, e.name);
      if (filter(full)) out.push(full);
    }
  }
  return out;
}

// ---------------------------------------------------------------- V1: recuento independiente (regex) de endpoints backend
function independentBackendScan(base) {
  const files = base === 'HEAD'
    ? git(BACKEND, ['ls-tree', '-r', '--name-only', 'HEAD', 'src']).split('\n').filter((f) => f.endsWith('.controller.ts'))
    : walk(path.join(BACKEND, 'src'), (f) => f.endsWith('.controller.ts')).map((f) => path.relative(BACKEND, f).replaceAll('\\', '/'));
  const routes = [];
  const noPrefix = [];
  for (const rel of files) {
    const text = base === 'HEAD' ? git(BACKEND, ['show', `HEAD:${rel}`]) : fs.readFileSync(path.join(BACKEND, rel), 'utf8');
    const ctrlMatch = text.match(/@Controller\(\s*(?:['"`]([^'"`]*)['"`])?\s*\)/);
    if (!ctrlMatch) { noPrefix.push({ rel, reason: 'Sin @Controller' }); continue; }
    const prefix = ctrlMatch[1] ?? '';
    if (prefix === '' && rel !== 'src/app.controller.ts') noPrefix.push({ rel, reason: '@Controller() vacío' });
    const lines = text.split(/\r?\n/);
    lines.forEach((l, idx) => {
      const m = l.match(/^\s*@(Get|Post|Put|Patch|Delete)\(\s*(?:['"`]([^'"`]*)['"`])?\s*\)/);
      if (m) {
        const method = m[1].toUpperCase();
        const suffix = m[2] ?? '';
        const full = '/' + [prefix, suffix].filter(Boolean).join('/').replace(/^\/+|\/+$/g, '').replace(/\/{2,}/g, '/');
        routes.push({ rel, line: idx + 1, method, route: full });
      }
    });
  }
  return { controllers: files.length, routes, noPrefix };
}

// ---------------------------------------------------------------- V2: recuento independiente (regex) de llamadas frontend
function independentFrontendScan(base) {
  const files = base === 'HEAD'
    ? git(FRONTEND, ['ls-tree', '-r', '--name-only', 'HEAD', 'src']).split('\n').filter((f) => /\.(ts|tsx)$/.test(f) && !f.endsWith('.d.ts'))
    : walk(path.join(FRONTEND, 'src'), (f) => /\.(ts|tsx)$/.test(f) && !f.endsWith('.d.ts')).map((f) => path.relative(FRONTEND, f).replaceAll('\\', '/'));
  const calls = [];
  const rx = /\b(?:(api|axios|http|client)\.(get|post|put|patch|delete)|(downloadPdfFromBackend)|(fetch|window\.fetch))\s*(?:<[^>]*>)?\s*\(/g;
  for (const rel of files) {
    const text = base === 'HEAD' ? git(FRONTEND, ['show', `HEAD:${rel}`]) : fs.readFileSync(path.join(FRONTEND, rel), 'utf8');
    const lines = text.split(/\r?\n/);
    lines.forEach((l, idx) => {
      if (/^\s*\/\//.test(l) || /^\s*\*/.test(l) || /^\s*export\s+(async\s+)?function\s+downloadPdfFromBackend/.test(l)) return;
      let m;
      rx.lastIndex = 0;
      while ((m = rx.exec(l)) !== null) {
        calls.push({ rel, line: idx + 1, match: m[0].trim() });
      }
    });
  }
  return { files: files.length, calls };
}

// ---------------------------------------------------------------- Normalización de rutas para cruce
function normRoute(r) {
  return r
    .replace(/\?.*$/, '')
    .replace(/\/+$/, '')
    .replace(/:[^/]+/g, ':param') || '/';
}

// ---------------------------------------------------------------- Ejecución
const epBackend = parseCsv(path.join(FASE0, 'endpoints-backend.csv'));
const epFrontend = parseCsv(path.join(FASE0, 'endpoints-frontend.csv'));
const permBackend = parseCsv(path.join(FASE0, 'permisos-backend.csv'));
const permFrontend = parseCsv(path.join(FASE0, 'permisos-frontend.csv'));

const v1WT = independentBackendScan('WT');
const v1HEAD = independentBackendScan('HEAD');
const v2WT = independentFrontendScan('WT');
const v2HEAD = independentFrontendScan('HEAD');

// Mapas de backend por base
const beWTMap = new Map();
const beHEADMap = new Map();
for (const r of epBackend) {
  const k = `${r.metodo} ${normRoute(r.ruta_completa)}`;
  if (r.base === 'AMBOS' || r.base === 'SOLO_EN_WORKTREE') beWTMap.set(k, r);
  if (r.base === 'AMBOS' || r.base === 'SOLO_EN_HEAD') beHEADMap.set(k, r);
}

// Cruce Paso 1: llamadas frontend -> backend
const matchedBeKeys = new Set();
const crossRows = epFrontend.map((f) => {
  const isUnresolved = f.es_dinamica === 'NO_RESUELTA';
  const k = `${f.metodo} ${normRoute(f.ruta_usada)}`;
  const inWT = !isUnresolved && beWTMap.has(k);
  const inHEAD = !isUnresolved && beHEADMap.has(k);
  if (inWT || inHEAD) matchedBeKeys.add(k);

  let categoria, estado, severidad, notas = '', be = null;
  if (isUnresolved) {
    categoria = 'NO_RESUELTO';
    estado = 'NO_RESUELTO';
    // Si es el wrapper genérico downloadPdfFromBackend en client.ts, sus invocaciones concretas ya están resueltas
    if (f.archivo === 'src/lib/api/client.ts' || f.archivo === 'src/lib/api.ts') {
      severidad = 'BAJA';
      notas = 'Wrapper genérico `downloadPdfFromBackend(endpoint)`; sus 5 invocaciones concretas sí están resueltas y coinciden.';
    } else {
      severidad = 'MEDIA';
      notas = 'Ruta dinámica no resuelta estáticamente.';
    }
  } else if (f.base === 'AMBOS') {
    if (inWT && inHEAD) {
      be = beWTMap.get(k);
      categoria = 'COINCIDE'; estado = 'CONFIRMADO'; severidad = '—';
    } else if (inWT && !inHEAD) {
      be = beWTMap.get(k);
      categoria = 'COINCIDE_EN_OTRA_BASE'; estado = 'CONFIRMADO'; severidad = 'MEDIA';
      notas = 'CORREGIDA_EN_WT: el frontend ya la llamaba en HEAD, pero el backend solo la expone en WT.';
    } else if (!inWT && inHEAD) {
      be = beHEADMap.get(k);
      categoria = 'COINCIDE_EN_OTRA_BASE'; estado = 'CONTRADICE'; severidad = 'ALTA';
      notas = 'Eliminada en backend WT aunque el frontend sigue llamándola.';
    } else {
      categoria = 'AUSENTE_EN_BACKEND'; estado = 'CONTRADICE'; severidad = 'ALTA';
      notas = 'Sin equivalente exacto por método+ruta normalizada.';
    }
  } else if (f.base === 'SOLO_EN_WORKTREE') {
    if (inWT) {
      be = beWTMap.get(k);
      categoria = 'COINCIDE'; estado = 'CONFIRMADO'; severidad = '—';
      if (be.base === 'SOLO_EN_WORKTREE') notas = 'Ambos extremos son SOLO_EN_WORKTREE (trabajo en curso coherente).';
    } else if (inHEAD) {
      be = beHEADMap.get(k);
      categoria = 'COINCIDE_EN_OTRA_BASE'; estado = 'CONTRADICE'; severidad = 'ALTA';
      notas = 'Frontend WT llama a ruta que solo existe en backend HEAD.';
    } else {
      categoria = 'AUSENTE_EN_BACKEND'; estado = 'CONTRADICE'; severidad = 'ALTA';
      notas = 'Ruta en frontend WT sin equivalente en backend.';
    }
  } else { // SOLO_EN_HEAD
    if (inHEAD) {
      be = beHEADMap.get(k);
      categoria = 'COINCIDE'; estado = 'CONFIRMADO'; severidad = '—';
      notas = f.nota_base || '';
    } else if (inWT) {
      be = beWTMap.get(k);
      categoria = 'COINCIDE_EN_OTRA_BASE'; estado = 'CONFIRMADO'; severidad = 'MEDIA';
      notas = 'CORREGIDA_EN_WT: existía en frontend HEAD y se implementó en backend WT.';
    } else {
      categoria = 'AUSENTE_EN_BACKEND'; estado = 'CONTRADICE'; severidad = 'MEDIA';
      notas = 'Existía en frontend HEAD sin equivalente en backend.';
    }
  }

  return {
    ruta_frontend: f.ruta_usada,
    archivo_linea: `${f.archivo}:${f.base === 'SOLO_EN_HEAD' ? f.linea_head : f.linea}`,
    base_frontend: f.base,
    metodo: f.metodo,
    ruta_backend: be ? be.ruta_completa : '—',
    archivo_backend: be ? `${be.archivo}:${be.base === 'SOLO_EN_HEAD' ? be.linea_head : be.linea}` : '—',
    base_backend: be ? be.base : '—',
    categoria,
    estado,
    severidad,
    notas,
  };
});

// Paso 2: Endpoints backend sin consumidor frontend
const sinConsumidor = epBackend.filter((r) => {
  const k = `${r.metodo} ${normRoute(r.ruta_completa)}`;
  return !matchedBeKeys.has(k);
});

// Paso 3: Matriz de permisos
const pbMap = new Map(permBackend.map((p) => [p.codigo, p]));
const pfUnique = new Map();
for (const r of permFrontend) {
  if (r.contexto.endsWith('NO_RESUELTO')) continue;
  if (!pfUnique.has(r.permiso)) pfUnique.set(r.permiso, []);
  pfUnique.get(r.permiso).push(r);
}
const permCross = [...pfUnique.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([code, uses]) => {
  const pb = pbMap.get(code);
  const categoria = !pb ? 'NO_EXISTE' : pb.base === 'SOLO_EN_WORKTREE' ? 'EXISTE_SOLO_EN_WT' : 'EXISTE';
  const endpointsCount = pb ? Number(pb.endpoints_que_lo_exigen) : 0;
  const uiWithoutBackendEndpoint = Boolean(pb && endpointsCount === 0);
  return {
    codigo: code,
    modulo: pb?.modulo ?? '—',
    categoria,
    activo_seed: pb?.activo ?? '—',
    endpoints_backend: endpointsCount,
    usos_frontend_wt: uses.filter((u) => u.base !== 'SOLO_EN_HEAD').length,
    ejemplos_frontend: uses.filter((u) => u.base !== 'SOLO_EN_HEAD').slice(0, 2).map((u) => `${u.archivo}:${u.linea}`).join(', '),
    hallazgo_ui_sin_endpoint: uiWithoutBackendEndpoint,
  };
});

// Permisos que algún endpoint exige pero el frontend nunca comprueba
const beEnforcedNotInFe = permBackend
  .filter((p) => Number(p.endpoints_que_lo_exigen) > 0 && !pfUnique.has(p.codigo))
  .map((p) => ({ codigo: p.codigo, modulo: p.modulo, endpoints: Number(p.endpoints_que_lo_exigen), base: p.base }));

const result = {
  v1: {
    wt: { controllers: v1WT.controllers, routes: v1WT.routes.length, noPrefix: v1WT.noPrefix },
    head: { controllers: v1HEAD.controllers, routes: v1HEAD.routes.length, noPrefix: v1HEAD.noPrefix },
    fase0_wt: epBackend.filter((r) => r.base !== 'SOLO_EN_HEAD').length,
    fase0_head: epBackend.filter((r) => r.base !== 'SOLO_EN_WORKTREE').length,
  },
  v2: {
    wt: { files: v2WT.files, calls_regex: v2WT.calls.length, fase0_ast: epFrontend.filter((r) => r.base !== 'SOLO_EN_HEAD').length },
    head: { files: v2HEAD.files, calls_regex: v2HEAD.calls.length, fase0_ast: epFrontend.filter((r) => r.base !== 'SOLO_EN_WORKTREE').length },
  },
  paso1_resumen: crossRows.reduce((a, r) => ((a[r.categoria] = (a[r.categoria] ?? 0) + 1), a), {}),
  paso1_no_coincide: crossRows.filter((r) => r.categoria !== 'COINCIDE'),
  paso2_sin_consumidor_total: sinConsumidor.length,
  paso2_sin_consumidor_wt: sinConsumidor.filter((r) => r.base !== 'SOLO_EN_HEAD').length,
  paso2_sin_consumidor_solo_head: sinConsumidor.filter((r) => r.base === 'SOLO_EN_HEAD').length,
  paso2_lista: sinConsumidor.map((r) => ({ metodo: r.metodo, ruta: r.ruta_completa, archivo: r.archivo, linea: r.linea || r.linea_head, base: r.base, politica: r.politica_efectiva, permiso: r.permiso })),
  paso3_resumen: {
    codigos_fe: permCross.length,
    existe: permCross.filter((p) => p.categoria === 'EXISTE').length,
    no_existe: permCross.filter((p) => p.categoria === 'NO_EXISTE').length,
    ui_sin_endpoint_backend: permCross.filter((p) => p.hallazgo_ui_sin_endpoint),
    backend_enforced_no_fe: beEnforcedNotInFe,
  },
};

fs.writeFileSync(path.join(TMP, 'resultado-fase1.json'), JSON.stringify({ ...result, crossRows, permCross }, null, 2) + '\n', 'utf8');
console.log(JSON.stringify(result, null, 2));

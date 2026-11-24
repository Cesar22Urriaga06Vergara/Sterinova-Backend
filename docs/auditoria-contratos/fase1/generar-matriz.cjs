// Cruce estático reproducible desde los inventarios de Fase 0.
const fs = require('node:fs');
const path = require('node:path');
const base = path.resolve(__dirname, '../fase0');
function parseCsv(file) {
  const text = fs.readFileSync(path.join(base, file), 'utf8');
  const rows = []; let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"' && quoted && text[i + 1] === '"') { field += '"'; i++; }
    else if (c === '"') quoted = !quoted;
    else if (c === ',' && !quoted) { row.push(field); field = ''; }
    else if (c === '\n' && !quoted) { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  const [headers, ...data] = rows;
  return data.filter((r) => r.length === headers.length).map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i]])));
}
const be = parseCsv('endpoints-backend.csv');
const fe = parseCsv('endpoints-frontend.csv');
const bp = parseCsv('permisos-backend.csv');
const fp = parseCsv('permisos-frontend.csv');
const safe = (x) => String(x ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ').replaceAll('\r', ' ');
const table = (headers, rows) => `| ${headers.join(' | ')} |\n|${headers.map(() => '---').join('|')}|\n${rows.map((r) => `| ${r.map(safe).join(' | ')} |`).join('\n')}\n`;
function matches(front, back) {
  const f = front.split('/').filter(Boolean), b = back.split('/').filter(Boolean);
  return f.length === b.length && f.every((s, i) => s.startsWith(':') || b[i].startsWith(':') || s === b[i]);
}
const beKey = (r) => `${r.metodo} ${r.ruta_completa}`;
const feRows = [], used = new Set();
for (const f of fe) {
  let candidates = be.filter((b) => b.metodo === f.metodo && matches(f.ruta_usada, b.ruta_completa));
  let status = 'COINCIDE', note = '';
  if (f.archivo === 'src/lib/api/client.ts' && f.ruta_usada === 'endpoint') {
    candidates = [];
    note = 'Función auxiliar: la ruta llega por argumento; sus llamadas se enumeran por separado.';
    status = 'MODELO_DISTINTO';
  } else if (f.archivo === 'src/components/logistica/ActaServicioFases.tsx' && f.ruta_usada === '/logistica/ordenes/:id/acta/:id') {
    candidates = be.filter((b) => b.metodo === 'PATCH' && /^\/logistica\/ordenes\/:[^/]+\/acta\/(fase1|fase2|cerrar)$/.test(b.ruta_completa));
    note = 'El argumento path se llama con fase1, fase2 y cerrar en src/components/logistica/ActaServicioFases.tsx:38-40.';
  } else if (candidates.length === 0) {
    status = 'AUSENTE_EN_BACKEND';
    note = f.es_dinamica === 'NO_RESUELTA' ? 'Expresión dinámica sin resolución; no se afirma ausencia real.' : 'No existe método y ruta equivalentes en los controladores inventariados.';
  }
  for (const b of candidates) used.add(beKey(b));
  feRows.push([f.ruta_usada, `${f.archivo}:${f.linea}`, f.metodo, candidates.map((b) => b.ruta_completa).join('<br>') || '—', candidates.map((b) => `${b.archivo}:${b.linea}`).join('<br>') || '—', status, status === 'AUSENTE_EN_BACKEND' ? 'ALTA' : status === 'MODELO_DISTINTO' ? 'BAJA' : '—', note]);
}
const absent = be.filter((b) => !used.has(beKey(b)));
const known = new Set(bp.map((p) => p.codigo));
const permissionRows = fp.map((p) => [p.permiso, `${p.archivo}:${p.linea}`, p.contexto, known.has(p.permiso) ? 'EXISTE' : p.contexto.includes('NO_RESUELTO') ? 'SIN_MAPEO' : 'NO_EXISTE', known.has(p.permiso) ? '—' : 'MEDIA', known.has(p.permiso) ? 'Código reconocido por catálogo; activación y ámbito no verificados.' : 'No figura en permission-catalog.ts.']);
const counts = {
  llamadas: feRows.length,
  coinciden: feRows.filter((r) => r[5] === 'COINCIDE').length,
  modelo_distinto: feRows.filter((r) => r[5] === 'MODELO_DISTINTO').length,
  ausentes_backend: feRows.filter((r) => r[5] === 'AUSENTE_EN_BACKEND').length,
  ausentes_frontend: absent.length,
  permisos_frontend: permissionRows.length,
  permisos_no_existen: permissionRows.filter((r) => r[3] === 'NO_EXISTE').length,
  permisos_sin_mapeo: permissionRows.filter((r) => r[3] === 'SIN_MAPEO').length,
};
let md = `# Fase 1 — matriz de contratos\n\nFase: 1 — cruce de contratos  \nEstado: COMPLETADA  \nHallazgos: ${counts.ausentes_backend} ALTA · ${counts.permisos_no_existen} MEDIA · 0 BAJA  \nCambios realizados: matriz de llamadas y permisos; ningún archivo de producto modificado  \nRequiere decisión del usuario: no\n\n`;
md += `Se clasificaron **${counts.llamadas}** llamadas HTTP: ${counts.coinciden} coincidencias, ${counts.modelo_distinto} llamada auxiliar de ruta variable y ${counts.ausentes_backend} ausencias de método/ruta. Se clasificaron **${counts.permisos_frontend}** usos de permiso: ${counts.permisos_frontend - counts.permisos_no_existen - counts.permisos_sin_mapeo} reconocidos, ${counts.permisos_no_existen} no existentes y ${counts.permisos_sin_mapeo} sin mapeo.\n\n`;
md += '## Llamadas frontend frente a controladores backend\n\n' + table(['Ruta frontend', 'Archivo:línea', 'Método', 'Ruta backend equivalente', 'Archivo backend', 'Estado', 'Severidad', 'Notas'], feRows) + '\n';
md += `## Endpoints backend sin llamada directa inventariada (${absent.length})\n\nNo se infiere código muerto: pueden ser endpoints públicos, para integraciones, pruebas o flujos aún sin pantalla.\n\n`;
md += table(['Método', 'Ruta backend', 'Archivo:línea', 'Estado', 'Severidad'], absent.map((b) => [b.metodo, b.ruta_completa, `${b.archivo}:${b.linea}`, 'AUSENTE_EN_FRONTEND', 'BAJA'])) + '\n';
md += '## Permisos usados en el frontend\n\n' + table(['Permiso', 'Archivo:línea', 'Contexto', 'Estado', 'Severidad', 'Notas'], permissionRows) + '\n';
md += '## NO VERIFICADO\n\n- No se consultó la base de datos: reconocimiento del código no garantiza que el permiso esté activo, concedido o dentro del ámbito del usuario.\n- La clasificación de la función auxiliar `downloadPdfFromBackend` describe su llamada interna; las rutas concretas aparecen en las invocaciones de la función.\n- Este cruce estático no ejecuta flujos del navegador ni comprueba qué ramas condicionales se alcanzan.\n';
fs.writeFileSync(path.join(__dirname, 'matriz-contratos.md'), md, 'utf8');
fs.writeFileSync(path.join(__dirname, 'conteos.json'), JSON.stringify(counts, null, 2) + '\n', 'utf8');
console.log(JSON.stringify(counts));

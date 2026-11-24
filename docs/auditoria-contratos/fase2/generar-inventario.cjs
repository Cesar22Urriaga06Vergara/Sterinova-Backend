// Inventario de documentación sin abrir datos de storage, fixtures ni secretos.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const roots = [
  ['Backend', path.resolve(__dirname, '../../..')],
  ['Frontend', path.resolve(__dirname, '../../../../SterinovaFrontend')],
];
const git = (root, args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 100 * 1024 * 1024 });
const norm = (s) => s.replaceAll('\\', '/');
const esc = (s) => String(s).replaceAll('|', '\\|').replaceAll('\n', ' ').replaceAll('\r', ' ');
const mdrow = (items) => `| ${items.map(esc).join(' | ')} |`;
const targetDirs = new Set(['docs', 'tasks', '.qwen', '.superpowers', '.vscode', '.github']);
const docs = [], directories = [], corpus = [];
for (const [project, root] of roots) {
  const listed = git(root, ['ls-files', '--cached', '--others', '--exclude-standard', '-z']).split('\0').filter(Boolean);
  const paths = [...new Set(listed)].filter((p) => fs.existsSync(path.join(root, p)) && !p.startsWith('storage/') && !p.includes('/storage/') && !p.startsWith('tests/fixtures/') && !p.startsWith('test/fixtures/'));
  const history = new Map();
  const log = git(root, ['log', '--format=COMMIT:%h:%cs', '--name-only', '--', '*.md', '*.txt']).split(/\r?\n/);
  let current = '';
  for (const entry of log) {
    if (entry.startsWith('COMMIT:')) current = entry.slice(7);
    else if (entry && !history.has(entry)) history.set(entry, current);
  }
  for (const p of paths) {
    const full = path.join(root, p);
    const stat = fs.statSync(full);
    const ext = path.extname(p).toLowerCase();
    if (stat.isFile() && stat.size < 1024 * 1024 && /\.(md|txt|ts|tsx|js|mjs|cjs|json|yml|yaml|ps1)$/.test(ext) && !/^(package-lock\.json|docs\/arquitectura\/openapi\.json|docs\/auditoria-contratos\/)/.test(norm(p))) {
      corpus.push({ project, path: norm(p), text: fs.readFileSync(full, 'utf8') });
    }
    if (/\.(md|txt)$/i.test(p) || p === '.codexignore') {
      const content = fs.readFileSync(full);
      docs.push({ project, root, path: norm(p), size: stat.size, last: history.get(norm(p)) ?? 'SIN_COMMIT', hash: crypto.createHash('sha256').update(content).digest('hex'), type: ext.slice(1) || 'config' });
    }
    const segments = norm(p).split('/');
    for (let i = 1; i < segments.length; i++) {
      const dir = segments.slice(0, i).join('/');
      if (targetDirs.has(segments[0])) directories.push({ project, path: dir });
    }
  }
}
const hashGroups = new Map();
for (const d of docs) {
  if (!hashGroups.has(d.hash)) hashGroups.set(d.hash, []);
  hashGroups.get(d.hash).push(d);
}
function classify(doc) {
  const p = doc.path.toLowerCase();
  const duplicates = hashGroups.get(doc.hash);
  if (/^(agents\.md|qoder_.*\.md|\.codexignore)$/.test(p) || /(^|\/)(\.qwen|\.superpowers|\.vscode|\.github)\//.test(p)) return ['HERRAMIENTA', 'Instrucción o configuración de agente, IDE o CI.'];
  if (duplicates.length > 1 && duplicates[0] !== doc) return ['DUPLICADO', `SHA-256 idéntico a ${duplicates[0].project}/${duplicates[0].path}`];
  if (p.endsWith('changelog.md')) return ['HISTORICO', 'Registro de cambios útil para rastrear versiones anteriores.'];
  if (p.startsWith('docs/archivo/') || /(^|\/)(historico|archive|plans?|kickoff)\//.test(p) || /(^|\/)(reporte-fase\d+|baseline-fase0|plan-accion|cierre-hito|transicion-|hito\d|inicio-fase|piloto-|resumen-cierre)/.test(p)) return ['HISTORICO', 'Ubicación o nombre indican antecedente o hito cerrado.'];
  if (p.startsWith('docs/auditoria-contratos/')) return ['VIGENTE', 'Entregable reproducible de esta auditoría.'];
  if (p.includes('arquitectura_') || p.includes('arquitectura/')) return ['VIGENTE', 'Documento arquitectónico actual; requiere contraste puntual con código.'];
  if (p.endsWith('readme.md') || p.endsWith('contributing.md')) return ['VIGENTE', 'Índice o guía de entrada del proyecto.'];
  if (p.startsWith('docs/auditorias/')) return ['HISTORICO', 'Informe de auditoría previo; conserva evidencia contextual.'];
  if (p.startsWith('docs/')) return ['VIGENTE', 'Documento en área activa; validar afirmaciones antes de tratarlo como contrato.'];
  if (p.startsWith('tasks/')) return ['HISTORICO', 'Registro de tarea o plan de trabajo.'];
  return ['CANDIDATO_ELIMINAR', 'Fuera del índice documental y sin categoría activa evidente; revisar manualmente antes de cualquier acción.'];
}
const rows = docs.sort((a, b) => `${a.project}/${a.path}`.localeCompare(`${b.project}/${b.path}`)).map((d) => {
  const [status, reason] = classify(d);
  const basename = path.posix.basename(d.path);
  const refs = corpus.filter((f) => !(f.project === d.project && f.path === d.path) && f.text.includes(basename)).slice(0, 3).map((f) => `${f.project}/${f.path}`);
  return { ...d, status, reason, refs };
});
const folderRows = [...new Map(directories.map((d) => [`${d.project}/${d.path}`, d])).values()].sort((a, b) => `${a.project}/${a.path}`.localeCompare(`${b.project}/${b.path}`));
const counts = Object.fromEntries(['VIGENTE', 'HISTORICO', 'DUPLICADO', 'HERRAMIENTA', 'CANDIDATO_ELIMINAR'].map((s) => [s, rows.filter((r) => r.status === s).length]));
let md = `# Fase 2 — inventario documental\n\nFase: 2 — auditoría de documentos  \nEstado: COMPLETADA  \nHallazgos: 0 ALTA · 1 MEDIA · ${counts.DUPLICADO + counts.CANDIDATO_ELIMINAR} BAJA  \nCambios realizados: inventario de ${rows.length} archivos y ${folderRows.length} carpetas; ningún archivo preexistente modificado  \nRequiere decisión del usuario: no\n\n`;
md += 'La clasificación es una **propuesta documental**, no una autorización para borrar o mover. `VIGENTE` indica ubicación o función actual; no valida que cada afirmación esté sincronizada con el código. `último commit` muestra el último commit encontrado para el archivo, no la modificación local sin commit. `Referenciado por` busca el nombre literal en archivos de texto del repositorio, hasta tres ejemplos; puede incluir referencias homónimas.\n\n';
md += '| Ruta | Tamaño (bytes) | Último commit | Referenciado por (ejemplos) | Tipo | Clasificación | Justificación |\n|---|---:|---|---|---|---|---|\n';
for (const d of rows) md += mdrow([`${d.project}/${d.path}`, d.size, d.last, d.refs.join('<br>') || '—', d.type, d.status, d.reason]) + '\n';
md += '\n## Carpetas auxiliares\n\n| Ruta | Tipo | Estado propuesto | Justificación |\n|---|---|---|---|\n';
for (const d of folderRows) {
  const status = /(^|\/)(\.qwen|\.superpowers|\.vscode|\.github)(\/|$)/.test(d.path) ? 'HERRAMIENTA' : /(^|\/)(archivo|historico|archive|plans?)(\/|$)/.test(d.path) ? 'HISTORICO' : 'VIGENTE';
  md += mdrow([`${d.project}/${d.path}/`, 'carpeta', status, status === 'HERRAMIENTA' ? 'Configuración de herramienta o CI.' : status === 'HISTORICO' ? 'Contenedor de antecedentes.' : 'Área documental activa o contenedor de trabajo.']) + '\n';
}
md += '\n## Arquitectura concurrente\n\nLos archivos raíz `ARQUITECTURA_BACKEND.md` y `ARQUITECTURA_FRONTEND.md` no son las únicas fuentes: ambos repositorios contienen `docs/arquitectura/` y mapas `docs/ESTRUCTURA_*.md`. La propuesta de Fase 3 debe decidir el índice y evitar autoridad duplicada.\n\n';
md += '## NO VERIFICADO\n\n- No se inspeccionó el contenido de `storage/`, `storage/backups/` ni fixtures con posibles datos personales.\n- La similitud semántica entre documentos no se calculó; `DUPLICADO` significa identidad byte a byte.\n- La relevancia de documentos clasificados por ruta o nombre necesita revisión humana antes de moverlos o eliminarlos.\n';
fs.writeFileSync(path.join(__dirname, 'inventario-documental.md'), md, 'utf8');
fs.writeFileSync(path.join(__dirname, 'inventario.json'), JSON.stringify(rows.map(({ project, path, status, reason }) => ({ project, path, status, reason })), null, 2) + '\n', 'utf8');
fs.writeFileSync(path.join(__dirname, 'conteos.json'), JSON.stringify({ archivos: rows.length, carpetas: folderRows.length, ...counts }, null, 2) + '\n');
console.log(JSON.stringify({ archivos: rows.length, carpetas: folderRows.length, ...counts }));

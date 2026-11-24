// Genera matriz-contratos.md y matriz-permisos.md a partir de resultado-fase1.json
// resolviendo las 2 rutas dinámicas verificadas en código fuente (useCotizacionDraft.ts:86 y ActaServicioFases.tsx:35).
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const TMP = __dirname;
const FASE1 = path.resolve(TMP, '..');
const data = JSON.parse(fs.readFileSync(path.join(TMP, 'resultado-fase1.json'), 'utf8'));

const HEADER = `\`\`\`
Fase: 1 — Cruce de contratos y verificación de Fase 0 (ronda 2)
Estado: COMPLETADA
Bases comparadas: WT (d5c201b, f0430a9) + HEAD
Verificaciones V1–V6: 5 OK · 1 con diferencia · 0 NO_VERIFICADO
Hallazgos: 0 ALTA · 3 MEDIA · 3 BAJA
Proxy/BFF: no existe; el frontend llama directo a NEXT_PUBLIC_API_URL y el backend no tiene prefijo global
Cambios realizados en producto: ninguno
Requiere decisión del usuario: sí — ver sección 10 en README.md
\`\`\``;

// Reclasificar las 2 rutas dinámicas resueltas manualmente en código fuente
const RESOLVED_BACKEND_KEYS = new Set([
  'GET /productos/buscar/crear',
  'GET /productos/buscar/editar',
  'PATCH /logistica/ordenes/:id/acta/fase1',
  'PATCH /logistica/ordenes/:id/acta/fase2',
  'PATCH /logistica/ordenes/:id/acta/cerrar',
]);

const rows = data.crossRows.map((r) => {
  if (r.archivo_linea === 'src/components/cotizaciones/useCotizacionDraft.ts:86') {
    return {
      ...r,
      ruta_backend: '/productos/buscar/crear · /productos/buscar/editar',
      archivo_backend: 'src/productos/productos.controller.ts:58,73',
      base_backend: 'AMBOS',
      categoria: 'COINCIDE',
      estado: 'CONFIRMADO',
      severidad: '—',
      notas: 'Resuelta en código: `action = quoteId ? "editar" : "crear"`.',
    };
  }
  if (r.archivo_linea === 'src/components/logistica/ActaServicioFases.tsx:35') {
    return {
      ...r,
      ruta_backend: '/logistica/ordenes/:id/acta/{fase1,fase2,cerrar}',
      archivo_backend: 'src/logistica/logistica.controller.ts:116,129,142',
      base_backend: 'AMBOS',
      categoria: 'COINCIDE',
      estado: 'CONFIRMADO',
      severidad: '—',
      notas: 'Resuelta en código: `post("fase1" | "fase2" | "cerrar")` en líneas 37-39.',
    };
  }
  return r;
});

const counts = rows.reduce((a, r) => ((a[r.categoria] = (a[r.categoria] ?? 0) + 1), a), {});
const sinCons = data.paso2_lista.filter((r) => !RESOLVED_BACKEND_KEYS.has(`${r.metodo} ${r.ruta}`));
const sinConsWT = sinCons.filter((r) => r.base !== 'SOLO_EN_HEAD');
const sinConsHEAD = sinCons.filter((r) => r.base === 'SOLO_EN_HEAD');

const consumerNote = (r) => {
  if (r.base === 'SOLO_EN_HEAD') return 'Eliminado en WT; sin consumidor en frontend WT ni HEAD (ver V4).';
  if (r.politica === 'DENEGADO_SCOPED_SIN_PERMISO') return 'Denegado intencionalmente por política de inmutabilidad (`@ApiForbiddenResponse`).';
  if (r.ruta.startsWith('/health/')) return 'Sondas de salud (infraestructura / monitoreo externo).';
  if (r.ruta === '/certificados/validar/:token') return 'Validación pública por token (QR / enlace externo).';
  return 'Sin consumidor en `SterinovaFrontend/src/`; candidato a revisión (posible API de soporte, exportación o código muerto).';
};

let mc = `# Matriz de contratos HTTP — Fase 1 (ronda 2)\n\n${HEADER}\n\n`;
mc += `## Resumen de clasificación (Paso 1)\n\n`;
mc += `Total de filas cruzadas (WT + HEAD): **${rows.length}**\n\n`;
mc += `| Categoría | Cantidad |\n|---|---:|\n`;
for (const [k, v] of Object.entries(counts)) mc += `| \`${k}\` | ${v} |\n`;
mc += `\n> **Resultado clave:** en WT, **0** llamadas del frontend están \`AUSENTE_EN_BACKEND\`. La única discrepancia de contrato existente en HEAD (\`GET /formatos-documentales/:id/versiones\`) quedó \`CORREGIDA_EN_WT\`.\n\n`;

mc += `## Paso 1 — Llamadas del frontend vs endpoints del backend\n\n`;
mc += `| ruta_frontend | archivo:línea | base_frontend | método | ruta_backend_equivalente | archivo_backend:línea | base_backend | categoría | estado | severidad | notas |\n|---|---|---|---|---|---|---|---|---|---|---|\n`;
for (const r of rows) {
  mc += `| \`${r.ruta_frontend}\` | \`${r.archivo_linea}\` | \`${r.base_frontend}\` | \`${r.metodo}\` | ${r.ruta_backend === '—' ? '—' : `\`${r.ruta_backend}\``} | ${r.archivo_backend === '—' ? '—' : `\`${r.archivo_backend}\``} | \`${r.base_backend}\` | \`${r.categoria}\` | \`${r.estado}\` | ${r.severidad} | ${r.notas} |\n`;
}

mc += `\n## Paso 2 — Endpoints del backend sin consumidor en frontend (\`SIN_CONSUMIDOR_FRONTEND\`)\n\n`;
mc += `- **Activos en WT sin consumidor en frontend:** ${sinConsWT.length}\n`;
mc += `- **Eliminados en WT (\`SOLO_EN_HEAD\`) sin consumidor:** ${sinConsHEAD.length}\n\n`;
mc += `| método | ruta_backend | archivo:línea | base | política | permiso | nota |\n|---|---|---|---|---|---|---|\n`;
for (const r of sinCons) {
  mc += `| \`${r.metodo}\` | \`${r.ruta}\` | \`${r.archivo}:${r.linea}\` | \`${r.base}\` | \`${r.politica}\` | ${r.permiso ? `\`${r.permiso}\`` : '—'} | ${consumerNote(r)} |\n`;
}
fs.writeFileSync(path.join(FASE1, 'matriz-contratos.md'), mc, 'utf8');

// Matriz de permisos (Paso 3)
let mp = `# Matriz de permisos — Fase 1 (ronda 2)\n\n${HEADER}\n\n`;
mp += `## Resumen (Paso 3)\n\n`;
mp += `- Códigos de permiso únicos usados en frontend (WT = HEAD): **${data.permCross.length}** (excluye 2 expresiones genéricas \`NO_RESUELTO\` en \`src/lib/utils/navigation.ts:114,122\`).\n`;
mp += `- \`EXISTE\` en catálogo del backend (WT y HEAD): **${data.paso3_resumen.existe}**\n`;
mp += `- \`EXISTE_SOLO_EN_WT\`: **0**\n`;
mp += `- \`NO_EXISTE\`: **0**\n`;
mp += `- Permisos usados en UI que ningún endpoint del backend exige: **${data.paso3_resumen.ui_sin_endpoint_backend.length}**\n`;
mp += `- Permisos exigidos por algún endpoint del backend que el frontend nunca comprueba: **${data.paso3_resumen.backend_enforced_no_fe.length}**\n\n`;

mp += `## Permisos usados por el frontend\n\n`;
mp += `| permiso | módulo | categoría | activo (seed) | endpoints_backend | usos_frontend_wt | ejemplos_frontend | hallazgo |\n|---|---|---|---|---:|---:|---|---|\n`;
for (const p of data.permCross) {
  mp += `| \`${p.codigo}\` | \`${p.modulo}\` | \`${p.categoria}\` | \`${p.activo_seed}\` | ${p.endpoints_backend} | ${p.usos_frontend_wt} | \`${p.ejemplos_frontend}\` | ${p.hallazgo_ui_sin_endpoint ? 'MEDIA: UI sin endpoint' : '—'} |\n`;
}

mp += `\n## Permisos exigidos por endpoints del backend pero no comprobados en frontend\n\n`;
mp += `No constituyen error por sí mismos (el backend sigue protegiendo las rutas), pero se listan para revisión:\n\n`;
mp += `| permiso | módulo | endpoints_backend | base |\n|---|---|---:|---|\n`;
for (const p of data.paso3_resumen.backend_enforced_no_fe) {
  mp += `| \`${p.codigo}\` | \`${p.modulo}\` | ${p.endpoints} | \`${p.base}\` |\n`;
}
fs.writeFileSync(path.join(FASE1, 'matriz-permisos.md'), mp, 'utf8');

console.log(JSON.stringify({ counts, sinConsWT: sinConsWT.length, sinConsHEAD: sinConsHEAD.length, perms: data.permCross.length }));

const fs = require('node:fs');
const path = require('node:path');
const here = __dirname;
const inventory = JSON.parse(fs.readFileSync(path.join(here, '../fase2/inventario.json'), 'utf8'));
const clean = (s) => String(s).replaceAll('|', '\\|').replaceAll('\n', ' ');
function action(d) {
  const p = `${d.project}/${d.path}`;
  if (p === 'Frontend/ARQUITECTURA_FRONTEND.md') return ['REESCRIBIR', 'Acción 1: rutas y permisos del código actual, ruta local anonimizada y Playwright.'];
  if (p === 'Backend/ARQUITECTURA_BACKEND.md') return ['REESCRIBIR', 'Acción 2: guardas, descripción de rutas, árbol y comandos comprobados.'];
  if (p === 'Backend/docs/arquitectura/api-y-contratos.md') return ['REESCRIBIR', 'Acción 3: alojar tabla regenerable del OpenAPI y documentar cobertura.'];
  if (p === 'Backend/docs/arquitectura/roles-y-permisos.md') return ['REESCRIBIR', 'Acción 3: tabla regenerable del catálogo, separando concesiones activas.'];
  if (p === 'Backend/docs/arquitectura-roles-permisos.md') return ['REESCRIBIR', 'Acción 4: aclarar alcance de auditoría y enlazar contrato RBAC canónico.'];
  if (p === 'Backend/docs/README.md' || p === 'Frontend/docs/README.md') return ['REESCRIBIR', 'Acción 5: declarar el índice y autoridad de cada documento.'];
  if (d.status === 'HISTORICO') return ['MANTENER', 'Antecedente útil; ya tiene ubicación o función histórica definida.'];
  if (d.status === 'HERRAMIENTA') return ['MANTENER', 'Configuración o instrucciones locales de su herramienta/repo.'];
  return ['MANTENER', d.status === 'VIGENTE' ? 'Documento del dominio o índice activo; no se propone alterar sin hallazgo puntual.' : 'No hay evidencia suficiente para modificarlo.'];
}
let md = `# Fase 3 — propuesta de limpieza documental

Fase: 3 — propuesta de limpieza  
Estado: PARCIAL (pendiente revisión de las acciones)  
Hallazgos: 0 ALTA · 4 MEDIA · 8 BAJA  
Cambios realizados: propuesta e inventarios; ningún documento preexistente reescrito  
Requiere decisión del usuario: sí; aprobar o rechazar cada acción 1–5

## Estructura objetivo

\`\`\`text
Backend/docs/README.md                         índice y estado
Backend/docs/arquitectura/api-y-contratos.md    contrato HTTP vigente, tablas generadas
Backend/docs/arquitectura/roles-y-permisos.md   códigos y semántica RBAC, tablas generadas
Backend/docs/arquitectura/adr/                 decisiones narrativas
Backend/docs/negocio/                          reglas de negocio
Backend/docs/archivo/                          antecedentes conservados
Frontend/docs/README.md                        índice de integración y UI
Frontend/docs/arquitectura/                    arquitectura de cliente y navegación
\`\`\`

Los documentos raíz \`ARQUITECTURA_*.md\` quedarían como panoramas breves con enlaces a los índices. La fuente verificable para métodos es el código de controladores y el OpenAPI generado; para permisos, el catálogo y la autorización efectiva, distinguiendo catálogo de datos persistidos. La propuesta no modifica contratos ni datos.

## Acciones para decidir

| Nº | Acción concreta | Archivos principales | Verificación previa a aplicar |
|---:|---|---|---|
| 1 | Corregir la arquitectura frontend: sustituir endpoints y permisos obsoletos por los inventarios de Fase 0, quitar la ruta absoluta de usuario y nombrar Playwright como renderer actual. | \`Frontend/ARQUITECTURA_FRONTEND.md\` | Revisar diff y comprobar que las filas citan controladores/llamadas actuales. |
| 2 | Corregir la arquitectura backend: descripciones de relleno, etiqueta de auditoría, árbol \`common/\` y \`revocacion/\`; explicar el rechazo intencional de los dos DELETE y distinguir \`deploy\` de \`start:deploy\`. | \`Backend/ARQUITECTURA_BACKEND.md\` | Revisar diff contra controladores, guardas y \`package.json\`. |
| 3 | Establecer tablas de API y permisos regenerables desde el código y OpenAPI; registrar estado activo como no verificado sin base de datos. | \`Backend/docs/arquitectura/api-y-contratos.md\`, \`Backend/docs/arquitectura/roles-y-permisos.md\`; script nuevo pendiente | Comparar el resultado con los CSV y comprobar regeneración idempotente. |
| 4 | Aclarar que la auditoría de roles y vistas es un análisis puntual y enlazar el contrato RBAC canónico, conservando el contenido propio de ambos documentos. | \`Backend/docs/arquitectura-roles-permisos.md\`, \`Backend/docs/arquitectura/roles-y-permisos.md\` | Comparar secciones y comprobar enlaces. |
| 5 | Actualizar los índices de ambos repositorios para explicar qué es vigente, histórico y generado. | \`Backend/docs/README.md\`, \`Frontend/docs/README.md\` | Validar enlaces relativos y que ningún índice remita a archivos inexistentes. |

No se propone mover ni eliminar archivos. Las acciones 1–5 son independientes para aprobación individual. La acción 3 plantea un generador para las tablas de arquitectura; aún no se ha escrito ese generador. \`fase0/generar-inventarios.cjs\` solo produce listados de auditoría.

## Verificación de hipótesis del adjunto

| Afirmación o hipótesis | Evidencia del documento | Evidencia del código actual | Estado | Severidad | Corrección propuesta |
|---|---|---|---|---|---|
| El frontend documenta rutas y permisos antiguos, aunque sus llamadas actuales coinciden con los 102 métodos backend. | \`Frontend/ARQUITECTURA_FRONTEND.md:459-514\` y \`:285-297\` | \`fase1/matriz-contratos.md\`; \`Backend/src/clientes/clientes.controller.ts\`; \`Frontend/src/app/(erp)/comercial/clientes/ClientesPageClient.tsx:159\` | CONFIRMADO | MEDIA | Acción 1: regenerar tablas desde llamadas actuales. |
| El documento frontend contiene una ruta absoluta de usuario. | \`Frontend/ARQUITECTURA_FRONTEND.md:36\` | — | CONFIRMADO | BAJA | Acción 1: reemplazar por ruta relativa al repositorio. |
| El frontend dice Chromium/Puppeteer, pero el backend usa Playwright. | \`Frontend/ARQUITECTURA_FRONTEND.md:273\` | \`Backend/src/pdf/pdf-generator.service.ts:13\`; \`Backend/package.json:63\` | CONFIRMADO | MEDIA | Acción 1: escribir Chromium mediante Playwright. |
| La tabla backend mezcla textos automáticos como “remove” y “find all”. | \`Backend/ARQUITECTURA_BACKEND.md:734-751\` | Controladores listados en \`fase0/endpoints-backend.csv\` | CONFIRMADO | BAJA | Acción 2: descripciones de negocio concisas. |
| La cifra de 102 métodos HTTP no estaba verificada. | \`Backend/ARQUITECTURA_BACKEND.md:709\` | \`fase0/endpoints-backend.csv\`: 102; \`Backend/docs/arquitectura/openapi.json\`: 102 | CONTRADICE | BAJA | Acción 2: mantener cifra y agregar método de generación. |
| Auditoría se describe “solo Admin”. | \`Backend/ARQUITECTURA_BACKEND.md:713\` | \`Backend/src/auditoria/auditoria.controller.ts:14-16\` exige \`auditoria.ver\` | CONFIRMADO | MEDIA | Acción 2: describir permiso y ámbito, sin fijar rol. |
| Los DELETE de cotizaciones y usuarios parecen huecos de permiso. | \`Backend/ARQUITECTURA_BACKEND.md:734\` y \`:805-811\` | \`Backend/src/cotizaciones/cotizaciones.controller.ts:239-248\`; \`Backend/src/users/users.controller.ts:88-97\`; \`Backend/src/rbac/authorization.guard.ts:34-39\` | CONTRADICE | BAJA | Acción 2: documentar rechazo deliberado. |
| El árbol muestra \`rbac/revocacion/\` sin contenido. | \`Backend/ARQUITECTURA_BACKEND.md:327\` | Directorio local vacío; el módulo actual no lo importa | CONFIRMADO | BAJA | Acción 2: corregir árbol generado. |
| \`nest deploy\` no es un comando del CLI. | \`Backend/ARQUITECTURA_BACKEND.md:864\` | \`Backend/package.json:15\`; \`node_modules/.bin/nest --help\` muestra \`deploy\` | CONTRADICE | BAJA | Acción 2: aclarar que existe en CLI y que producción PaaS usa \`start:deploy\`. |
| TypeORM podría cargar pruebas de migración por patrón. | — | \`Backend/src/database/data-source.ts:14\` usa \`DATABASE_MIGRATIONS\`; \`Backend/src/database/migration-registry.ts:46\` enumera clases | CONTRADICE | BAJA | Acción 2: explicar registro explícito. |
| Dos \`seed-icontec.ts\` serían duplicados. | Árbol de arquitectura | \`Backend/src/scripts/seed-icontec.ts:3\` importa la función de \`Backend/src/sellos/seed-icontec.ts:9\` | CONTRADICE | BAJA | Acción 2: distinguir CLI e implementación. |
| \`common/\` se describe como guardas, decoradores y servicios compartidos; la guarda RBAC vive en \`rbac/\`. | \`Backend/docs/CONTEXTO_RAPIDO.md:12\` | \`Backend/src/common/public.decorator.ts\`, \`Backend/src/common/services/storage.service.ts\`; guardas RBAC en \`Backend/src/rbac/authorization.guard.ts\` | CONFIRMADO | MEDIA | Acción 2: describir contenidos reales y ubicación de guardas. |

## Acciones por documento

El listado siguiente cubre los archivos inventariados en Fase 2. Las rutas son relativas a cada repositorio. Una acción \`MANTENER\` no certifica que el texto interno esté actualizado.

| Documento | Estado Fase 2 | Acción propuesta | Motivo |
|---|---|---|---|
`;
for (const d of inventory) {
  const [a, reason] = action(d);
  md += `| ${clean(`${d.project}/${d.path}`)} | ${d.status} | ${clean(a)} | ${clean(reason)} |\n`;
}
md += `
## Secciones a generar y secciones narrativas

| Generar desde código | Mantener narrativo |
|---|---|
| Métodos/rutas/permisos/público de controladores y OpenAPI | Límites del sistema, flujo de negocio y decisiones ADR |
| Códigos y módulo del catálogo de permisos | Semántica de ámbitos, propietarios, herencia y operación de roles |
| Versiones y scripts de \`package.json\` | Criterios de despliegue y recuperación |
| Entidades registradas en \`src/database/entities.ts\` | Modelo conceptual y restricciones de negocio |

Un futuro comando \`npm run docs:contracts\` podría ejecutar un extractor AST/OpenAPI, escribir tablas deterministas entre marcadores en los dos documentos canónicos y devolver error si el inventario de frontend no coincide. La generación no debe consultar la base de datos ni convertir concesiones sembradas en permisos efectivos. **No se implementa en Fase 3.**

## Prevención propuesta para Fase 5

1. Extender \`Backend/test/openapi-contract.e2e-spec.ts\` con un cruce estático de las rutas frontend normalizadas contra el OpenAPI; fallar ante rutas sin correspondencia y exigir resolución explícita de expresiones dinámicas.
2. Comparar cadenas de permiso del frontend con \`Backend/src/rbac/permission-catalog.ts\`, sin confundir código reconocido con acceso concedido.
3. En CI, ejecutar el generador documental y fallar si \`git diff --exit-code\` muestra tablas desactualizadas.
4. Exigir que cambios de ruta o permiso actualicen inventarios, contrato y pruebas en el mismo PR.

## NO VERIFICADO

- No se consultaron cuentas, concesiones ni datos productivos; el alcance RBAC real sigue sin comprobarse.
- No se revisó línea por línea el contenido de todos los documentos; las acciones \`MANTENER\` se basan en función, ubicación y referencias. Toda reescritura requiere diff y revisión de enlaces en Fase 4.
- La comparación fue estática. No prueba disponibilidad de un backend desplegado ni ejecución de pantallas.
`;
fs.writeFileSync(path.join(here, 'propuesta-limpieza.md'), md, 'utf8');
console.log(JSON.stringify({ documentos: inventory.length, acciones: [1, 2, 3, 4, 5] }));

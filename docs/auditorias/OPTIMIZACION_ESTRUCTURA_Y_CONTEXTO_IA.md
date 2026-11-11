# Optimización de estructura y contexto IA

Fecha: 11 de noviembre de 2026  
Alcance: organización documental, exclusiones y lectura progresiva de Sterinova-Backend y SterinovaFrontend. No se modificó lógica de negocio.

## 1. Problemas detectados

- Los `.gitignore` ya cubrían dependencias, compilados, entornos y buena parte de los reportes; faltaban varios temporales y patrones de salida habituales.
- Ambos repositorios ignoraban `AGENTS.md`, por lo que las reglas solicitadas no quedaban versionadas. El archivo frontend contiene un bloque administrado por Next.js; el generador de Next actualiza ese bloque y conserva el contenido externo.
- Existe `.codexignore` en ambos repositorios, pero Codex CLI no está instalado en este entorno y la documentación oficial consultada describe `AGENTS.md` como guía persistente, sin confirmar el soporte de `.codexignore`. No se atribuye efectividad a ese archivo.
- El mapa backend no excluía explícitamente `storage/backups/`. El índice frontend incluía planes e informes antiguos como documentos vigentes y declaraba una revisión de 6 de noviembre de 2026.
- Hay documentación de dominio repetida entre repositorios, pero no se encontraron duplicados Markdown exactos por SHA-256. Se mantienen las fuentes canónicas enlazadas; no se consolidó contenido.
- No se identificó una necesidad demostrada de mover módulos de código.

## 2. Cambios implementados

- Se completaron exclusiones de temporales, cachés, compilación y claves privadas en ambos `.gitignore`, conservando las reglas existentes para `.env.example`.
- Se retiró la regla que ignoraba `AGENTS.md`; se crearon instrucciones progresivas en el Backend y se añadieron al archivo frontend fuera del bloque administrado por Next.js.
- Se crearon `docs/CONTEXTO_RAPIDO.md` en ambos proyectos y se actualizaron sus índices `docs/README.md`.
- El generador `scripts/generate-structure-docs.ps1` omite `storage/backups/` antes de recorrer su contenido y sigue descartando enlaces simbólicos, secretos y temporales. Se regeneraron ambos mapas.
- No se modificó `.codexignore`: se conservó como estaba, sin tratarlo como un filtro efectivo confirmado.

## 3. Reglas de exclusión y alcance

- `.gitignore`: excluye dependencias, compilaciones, cachés, logs, temporales, entornos y claves; el Backend ya excluía `storage/`, incluidos los respaldos. Las reglas se validaron con `git check-ignore`.
- Generador de mapas: omite `storage/backups/`, dependencias/cachés, directorios de salida de la raíz, archivos temporales, entornos privados, claves y enlaces simbólicos. Las exclusiones de `dist`, `build`, `tmp` y nombres similares se limitan a la raíz para no ocultar código legítimo anidado. Mantiene `.env.example` como nombre de archivo sin leer su contenido.
- Búsquedas: `.gitignore` sirve de filtro para Git y herramientas que respetan sus reglas. `AGENTS.md` limita la lectura a mapas, dominios y dependencias directas; es guía del agente, no un control técnico de acceso.
- `.codexignore`: su soporte no pudo verificarse. La documentación oficial consultada sí describe [AGENTS.md en Codex](https://developers.openai.com/codex/agent-configuration/agents-md) y la [personalización de Codex](https://developers.openai.com/codex/customization/overview); no se midió un efecto de `.codexignore`.

## 4. Organización documental

- Backend: se conservó la separación existente entre documentación funcional/técnica (`negocio/`, `arquitectura/`, `base-de-datos/`, `manuales/`, `calidad-y-pruebas/`) e historial en `docs/archivo/`. Los documentos de `docs/auditorias/` y `docs/superpowers/plans/` se consultan por tema, no como contexto inicial.
- Frontend: se identificaron como referencias de consulta selectiva `arquitectura/`, `manuales/`, `ui-ux/` y `calidad-y-pruebas/`. `estado-proyecto/plan-accion-*`, `reporte-fase*`, `kickoff/` y el diseño inicial en `estado-proyecto/historico/` se etiquetaron como material con vigencia limitada o antecedentes.
- No se movió, borró ni consolidó documentación. El índice frontend advierte que su mapa de rutas fue verificado el 6 de noviembre y debe contrastarse con el código actual.

## 5. Archivos sensibles identificados

- Hay un `.env` local en cada repositorio. Sus contenidos no se leyeron; ambos están excluidos por `.gitignore` y por el generador.
- `storage/backups/` contiene seis archivos de respaldo; no se leyeron ni están rastreados por Git. El generador ahora excluye la carpeta antes de recorrerla.
- La búsqueda de nombres rastreados encontró `.env.example` y ningún archivo versionado con nombres/extensiones típicos de claves o certificados. En el `.env.example` versionado del Backend, una variable con nombre de credencial tiene un valor que no coincide con marcadores obvios de ejemplo. No se copió ni publicó su valor; confirmar manualmente que sea ficticio antes de considerar ese archivo libre de secretos. No se modificó el archivo, que ya tenía cambios previos.
- No se inspeccionó el contenido de respaldos, formatos institucionales ni `.env`.

## 6. Mediciones

| Indicador | Backend antes | Backend después | Frontend antes | Frontend después |
|---|---:|---:|---:|---:|
| Carpetas en mapa, incluye raíz | 88 | 87 | 53 | 53 |
| Archivos en mapa | 380 | 380 | 149 | 149 |
| Tamaño del mapa estructural | 22.468 bytes | 22.291 bytes | 8.284 bytes | 8.295 bytes |
| Tamaño de `CONTEXTO_RAPIDO.md` | no existía | 2.146 bytes | no existía | 2.008 bytes |
| Tamaño de `AGENTS.md` | no existía | 1.678 bytes | 679 bytes | 2.079 bytes |

El mapa incluye los documentos de contexto nuevos y este informe. El conteo de archivos excluidos bajo directorios completos de dependencias, compilación y caché no se recorrió deliberadamente. Se identificaron al menos ocho archivos excluidos de interés (dos `.env` y seis respaldos); los archivos de salida adicionales se filtran por regla. No se atribuye el cambio neto del árbol a una reducción de tokens.

Como flujo representativo de navegación frontend, la selección de `AGENTS.md`, contexto rápido, guía de navegación, fuente de navegación y su prueba suma **12.253 bytes**. Es una medición de archivos, no de tokens ni una comparación con un flujo anterior. No hay telemetría de tokens reales disponible en esta ejecución.

Se mantuvieron fuera de la lectura habitual 40 Markdown bajo `docs/archivo/` en Backend y siete planes/reportes de fase más un diseño inicial en el historial frontend. Los archivos siguen disponibles en sus rutas.

## 7. Validación y riesgos pendientes

- Ambos mapas se regeneraron; los conteos de sus encabezados coinciden con sus entradas y los bloques de árbol cierran correctamente.
- Se verificó que el mapa backend no incluya `storage/backups/` y que no aparezcan las rutas/archivos privados probados. Los índices actualizados no tienen enlaces locales rotos.
- Los patrones `.gitignore` se comprobaron con `git check-ignore`; `AGENTS.md` dejó de estar ignorado en ambos repositorios.
- `npm.cmd run build` pasó en ambos repositorios. No se ejecutaron suites de pruebas porque solo cambiaron documentación/configuración y no se modificó código funcional; tampoco se ejecutaron migraciones, macros ni accesos a bases de datos.
- La guía de agentes reduce lecturas automáticas por instrucción, pero no impide que una herramienta ignore esas pautas. El soporte de `.codexignore` sigue sin verificar.
- Debe revisarse localmente el valor sospechoso de `DB_PASSWORD` en el ejemplo de entorno del Backend antes de afirmar que solo contiene marcadores ficticios.

## 8. Recomendaciones que requieren aprobación

- Actualizar `docs/estado-proyecto/modulos.md` del Frontend contra las rutas actuales, por separado, si se quiere declarar ese inventario vigente.
- Mantener los informes y planes antiguos accesibles; si se decide moverlos a una carpeta histórica, hacerlo en una tarea dedicada con comprobación y actualización de enlaces.
- No se recomienda reorganizar módulos de código con la evidencia actual. Cualquier movimiento requeriría justificar beneficio, importaciones afectadas y pruebas de regresión.

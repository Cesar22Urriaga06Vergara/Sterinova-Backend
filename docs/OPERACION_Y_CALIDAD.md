# Operación, calidad y pruebas

> Consolidado el 23 de noviembre de 2026. Se conserva la ruta de origen y el estado original. Las afirmaciones fechadas deben contrastarse con el código o la decisión vigente.

## Índice

- [Aceptación visual de PDFs oficiales]( #doc-calidad-y-pruebas-aceptacion-visual-pdfs)
- [Calidad e invariantes de datos observadas]( #doc-calidad-y-pruebas-calidad-de-datos)
- [Checklist de verificación operativa — Sterinova ERP]( #doc-calidad-y-pruebas-checklist-verificacion-operativa)
- [Pruebas backend]( #doc-calidad-y-pruebas-pruebas)
- [Runbook de despliegue]( #doc-manuales-despliegue)
- [Runbook de respuesta a incidentes]( #doc-manuales-runbook-incidentes)
- [Runbook de PDFs oficiales]( #doc-manuales-runbook-pdfs)

## Fuentes

<a id="doc-calidad-y-pruebas-aceptacion-visual-pdfs"></a>

**Origen:** docs/calidad-y-pruebas/aceptacion-visual-pdfs.md

## Aceptación visual de PDFs oficiales

**Documento / consecutivo:** ______________________________
**Versión de formato:** __________________  **Fecha de revisión:** __________________

Calidad debe comparar el PDF emitido con la plantilla Word oficial de la misma versión y marcar cada punto.

- [ ] El código, nombre y versión del formato corresponden a la plantilla aprobada.
- [ ] El tamaño de página, orientación, márgenes y número de páginas son correctos.
- [ ] Encabezado, logotipo, pie de página, tablas y bloques conservan alineación y proporciones.
- [ ] No hay texto cortado, montado, desbordado, ilegible ni caracteres sustituidos.
- [ ] Saltos de página y repetición de encabezados de tabla se ven correctamente.
- [ ] Fechas, consecutivo, cliente/equipo y demás datos variables coinciden con el registro emitido.
- [ ] Importes, cantidades, unidades, totales y redondeos coinciden con la fuente aprobada (cuando aplican).
- [ ] Firmas, aprobaciones, controles técnicos y códigos QR/códigos de validación son legibles y correctos (cuando aplican).
- [ ] La impresión en escala 100 % y la lectura en pantalla no pierden información.
- [ ] Se verificó SHA-256 del archivo descargado contra `hash_pdf` del registro.
- [ ] El archivo corresponde a la plantilla Word oficial adjunta al expediente de esta revisión.

**Resultado:** ☐ Aceptado  ☐ Rechazado
**Hallazgos / páginas afectadas:**

______________________________________________________________________________

______________________________________________________________________________

**Nombre y cargo de Calidad:** ______________________________________________
**Firma:** __________________________________  **Fecha:** __________________

Si se rechaza, adjuntar el PDF, la versión Word utilizada y capturas de las páginas afectadas al registro controlado de hallazgos. No liberar el formato hasta repetir y firmar esta aceptación.

<a id="doc-calidad-y-pruebas-calidad-de-datos"></a>

**Origen:** docs/calidad-y-pruebas/calidad-de-datos.md

## Calidad e invariantes de datos observadas

> **Estado:** vigente como descripción estática, verificado el 6 de noviembre de 2026.
> **Verificado contra:** entidades, servicios y migraciones backend el 6 de noviembre de 2026.
> **Alcance:** restricciones implementadas en entidades, servicios y migraciones.
> **No cubre:** integridad de una base desplegada, cumplimiento regulatorio ni auditoría completa.
> **Fuente canónica de:** invariantes de datos visibles en el código.

### Invariantes visibles

> **Fuente canónica:** la definición de entidades y columnas está en [esquema y migraciones](./ARQUITECTURA_Y_CONTRATOS.md#doc-base-de-datos-esquema-y-migraciones). Este documento resume solo invariantes de negocio observadas.

- Clientes: `nit` único; una cotización y ciertas asignaciones restringen el borrado relacionado.
- Cotización: consecutivo único; una orden de servicio por cotización; el servicio impide eliminar cotizaciones emitidas.
- Secuencias: actualizadas dentro de transacción y con bloqueo pesimista en generación de cotizaciones y certificados.
- Calidad: revisión registra revisor, fecha y motivo de rechazo; aprobar requiere contraseña y actualiza ciclo/crea certificado en transacción.
- Certificado: ciclo único, token público opaco, snapshot y metadatos PDF; trigger en migraciones bloquea cambios de negocio después de aprobado.
- Formatos: versiones y asignaciones tienen restricciones referenciales; operaciones de formato registran eventos de auditoría selectivos.
- Auditoría: existe tabla y servicio, pero no instrumenta todas las mutaciones del sistema.

### Retención y alcance de auditoría

- **Política propuesta:** conservar los eventos de auditoría durante cinco años desde su creación y luego eliminarlos mediante un proceso controlado y trazable. Este plazo es una política operativa propuesta; debe validarse con el responsable regulatorio y el negocio antes de declararlo como cumplimiento normativo.
- Los registros deben permanecer append-only desde la aplicación, con acceso de consulta restringido a Admin. La retención debe incluir copias de respaldo y definir qué sucede ante una orden de conservación legal.
- Se registran autenticaciones exitosas/fallidas (IP y User-Agent), decisiones de Calidad, cambios de estado de órdenes, emisión y descargas de certificados. No guardar contraseñas, tokens, ni motivos o datos personales innecesarios en `detalle`.
- Los éxitos de Calidad y cambios de estado se escriben en la transacción de dominio. Los fallos se registran fuera de esa transacción, de forma que el error original se conserve. La auditoría de login y descarga es best effort para no cambiar el resultado de autenticación o entrega.
- Esta instrumentación cubre las operaciones críticas enumeradas en el reporte de Fase 3. No debe describirse como historial integral de cada lectura o mutación del sistema.

No se encontraron entidades para evidencias adjuntas de ciclo ni firma digital de usuarios/clientes. Un sello gráfico no prueba autoría o firma. La auditoría y snapshots no deben describirse como historial integral ni como respaldo.

Evidencia: entidades bajo `src/**/entities/`, servicios de `src/calidad/`, `src/certificados/`, `src/cotizaciones/` y `src/formatos-documentales/`, migraciones de `src/database/migrations/`. La base efectiva queda **NO VERIFICABLE EN CÓDIGO**.

<a id="doc-calidad-y-pruebas-checklist-verificacion-operativa"></a>

**Origen:** docs/calidad-y-pruebas/checklist-verificacion-operativa.md

## Checklist de verificación operativa — Sterinova ERP

> **Estado:** vigente (plan de verificación futura).
> **Verificado contra:** documentación y código inventariado el 6 de noviembre de 2026; la lista no se ejecutó.
> **Alcance:** comprobaciones y evidencias a recopilar en ambiente controlado antes de valorar operación.
> **No cubre:** ejecución, aprobación de cambios, despliegue o validación de producción.
> **Fuente canónica de:** tareas de preparación operativa posteriores a la auditoría.

> Esta lista define qué verificar; no se ejecutó durante el cierre documental. Usar staging o un ambiente de prueba con respaldo, credenciales autorizadas y responsables identificados. No registrar valores de secretos en evidencias.

### 1. Base de datos

- [ ] En cada ambiente controlado, ejecutar `npm run migration:show` y archivar salida con ambiente, fecha y versión del código.
- [ ] Confirmar en configuración que `synchronize: false` y `migrationsRun: false`.
- [ ] Conciliar las 11 migraciones registradas con las filas de historial de esa base; no asumir que todas están aplicadas.
- [ ] Consultar `secuencias_consecutivos`; documentar secuencia, certificados existentes y siguiente número calculado antes de emitir.
- [ ] Confirmar respaldo previo, retención y restauración probada antes de cualquier DDL.
- [ ] Registrar migraciones pendientes, incompatibilidades y plan de recuperación sin ejecutar en producción.

### 2. Pruebas

- [ ] Backend: ejecutar `npm run test` y archivar resumen, versión y código de salida.
- [ ] Backend: ejecutar `npm run test:e2e` en entorno controlado y archivar configuración/salida sin credenciales.
- [ ] Frontend: acordar y documentar comando para ejecutar pruebas `.mjs`; `package.json` no declara script `test`.
- [ ] Registrar cobertura obtenida y compararla con el objetivo que defina el equipo; no inferir cobertura a partir de cantidad de archivos.

### 3. Autenticación y autorización

- [ ] Verificar presencia y política de rotación de `JWT_SECRET` sin mostrar el valor.
- [ ] Confirmar en API desplegada que no existe `/auth/seed`; verificar que el primer Admin se aprovisiona mediante el flujo CLI autorizado y no por una ruta HTTP de seed.
- [ ] En ambiente limpio, ejecutar `bootstrap:admin` con credenciales de prueba y verificar la longitud mínima sin guardar contraseña en logs.
- [ ] Probar acceso permitido/denegado para Admin, Comercial, Logística, Planta y Calidad en endpoints representativos; guardar matriz de resultado.
- [ ] Verificar respuesta `401` y limpieza de sesión frontend.

### 4. PDFs y certificados

- [ ] Configurar `PDF_RENDER_SECRET` con al menos 32 caracteres, compartido entre backend/frontend por gestor de secretos; no usar prefijo público.
- [ ] Confirmar que `PDF_RENDER_BASE_URL` o `FRONTEND_INTERNAL_URL` resuelve desde backend al frontend interno esperado.
- [ ] Definir `PDF_STORAGE_PATH`, permisos, persistencia, respaldo y política de retención por ambiente.
- [ ] En staging con datos de prueba, emitir cotización y certificado; verificar `pdf_url`, `hash_pdf` y `pdf_renderer_version` sin exponer tokens.
- [ ] Validar el QR de certificado contra `GET /certificados/validar/:token` con datos no productivos.
- [ ] Obtener aceptación visual de PDFs frente a formatos aprobados; registrar documento/versión, navegador/render y responsable.

### 5. Frontend

- [ ] Definir `NEXT_PUBLIC_API_URL` por ambiente y resolver la llamada de login que usa URL local fija.
- [ ] Confirmar que el cliente envía Bearer y limpia sesión ante `401`.
- [ ] Comparar navegación por rol en `navigation.ts` con permisos API; no usar visibilidad UI como control de acceso.
- [ ] Acordar si `FARMACEUTICO` y `FABRICANTE` deben estar disponibles en el selector y verificar correspondencia API/UI.
- [ ] Sustituir contadores estáticos del dashboard por fuente real o etiquetarlos como provisionales antes del uso operativo.
- [ ] Probar teclado, foco, estados vacío/carga/error/éxito/sesión y responsive en las pantallas críticas.

### 6. Despliegue

- [ ] Definir CORS por ambiente y confirmar orígenes web esperados.
- [ ] Revisar almacenamiento de secretos, permisos mínimos, rotación y ausencia de valores en logs.
- [ ] Confirmar persistencia/compartición de PDFs entre instancias y plan de recuperación.
- [ ] Configurar y comprobar observabilidad (logs, métricas, trazas, alertas) y respaldos; documentar herramienta y responsable.
- [ ] Acordar staging, ventana, criterios de aceptación, aprobación y rollback antes de producción.

### 7. Documentación

- [ ] Actualizar fuente canónica cuando cambien rutas, migraciones, roles, tipos de cotización o contratos PDF.
- [ ] Mantener una sola fuente canónica por tema según la [índice documental].
- [ ] Archivar evidencia de cada ambiente sin secretos, datos personales innecesarios ni tokens.
- [ ] Revisar históricos y enlaces cruzados al menos una vez por release.

<a id="doc-calidad-y-pruebas-pruebas"></a>

**Origen:** docs/calidad-y-pruebas/pruebas.md

## Pruebas backend

> **Estado:** vigente como inventario estático, revisado el 6 de noviembre de 2026.
> **Verificado contra:** scripts y archivos de pruebas backend/frontend el 6 de noviembre de 2026.
> **Alcance:** comandos, configuraciones y archivos de prueba detectados.
> **No cubre:** resultados, cobertura medida ni calidad demostrada por ejecución.
> **Fuente canónica de:** comandos y alcance de pruebas backend.

### Comandos declarados

| Comando | Uso declarado |
|---|---|
| `npm run test` | Vitest unitario (`vitest run`). |
| `npm run test:watch` | Vitest interactivo. |
| `npm run test:cov` | Vitest con cobertura. |
| `npm run test:e2e` | Vitest con `vitest.config.e2e.ts`. |
| `npm run lint` | Oxlint en `src/` y `test/`. |
| `npm run build` | Compilación NestJS. |

El backend contiene especificaciones `*.spec.ts` en módulos y migraciones y `test/app.e2e-spec.ts`. Las áreas incluyen auth/guards, Calidad, certificados, clientes, cotizaciones, migraciones, formatos, PDF, Planta, sellos, usuarios y controlador raíz.

En frontend existen cuatro pruebas `.mjs` puntuales y no hay script `test` en `package.json`. El detalle por repositorio está en [pruebas frontend](./DESARROLLO_Y_CALIDAD.md#doc-calidad-y-pruebas-pruebas-frontend); esta página es la fuente canónica del inventario y estado general de verificación de pruebas de ambos repositorios.

La auditoría inventarió los archivos; no ejecutó pruebas, lint ni build.

No se reporta aquí cobertura numérica ni resultado de CI. Los comandos de migración requieren configuración de base incluso si el proyecto compila.

<a id="doc-manuales-despliegue"></a>

**Origen:** docs/manuales/despliegue.md

## Runbook de despliegue

> **Estado:** procedimiento de referencia; no implica que staging o producción ya estén desplegados.
> **Fuente de configuración:** variables contrastadas con `src/app.module.ts`, `src/main.ts`, `src/pdf/pdf-generator.service.ts` y `src/common/services/storage.service.ts`.

### Prerrequisitos

- Node.js y npm compatibles con `package-lock.json`; desplegar desde un commit/tag inmutable.
- MariaDB accesible desde la nueva versión y con usuario de mínimo privilegio para la API y permisos de DDL temporales/restringidos para el operador de migraciones.
- Chromium de Playwright y bibliotecas del sistema instaladas en la imagen/runtime. La readiness lanza Chromium para comprobar el renderer.
- Un gestor de secretos del entorno (por ejemplo, el gestor administrado del proveedor). No guardar secretos en Git, imágenes, logs ni archivos `.env` del servidor.
- Volumen persistente para PDFs montado en todas las instancias con permisos de lectura/escritura para el usuario de Node.
- Respaldo reciente de MariaDB y storage, con verificación de recuperación según el procedimiento de respaldo aprobado para el entorno.

### Variables de entorno

Configurar en el gestor de secretos o en la configuración protegida del runtime:

| Variable                |           Requerida | Uso                                                                                                                        |
| ----------------------- | ------------------: | -------------------------------------------------------------------------------------------------------------------------- |
| `DB_HOST`               |                  Sí | Host MariaDB.                                                                                                              |
| `DB_PORT`               |                  Sí | Puerto MariaDB, normalmente `3306`.                                                                                        |
| `DB_USERNAME`           |                  Sí | Usuario de conexión de la aplicación.                                                                                      |
| `DB_PASSWORD`           |                  Sí | Secreto de conexión; nunca imprimir su valor.                                                                              |
| `DB_DATABASE`           |                  Sí | Esquema de la aplicación.                                                                                                  |
| `JWT_SECRET`            |                  Sí | Firma JWT. Generar aleatorio y privado; rotarlo con un plan de invalidación de sesiones.                                   |
| `PDF_RENDER_SECRET`     |                  Sí | Firma del acceso interno del renderer; usar al menos 32 caracteres aleatorios y compartirlo solo con el frontend renderer. |
| `PDF_RENDER_BASE_URL`   |                 Sí* | URL interna alcanzable por el backend para las rutas `/internal/pdf/...`. Tiene prioridad sobre `FRONTEND_INTERNAL_URL`.   |
| `FRONTEND_INTERNAL_URL` |                 Sí* | Alternativa para resolver las rutas internas PDF cuando no se define `PDF_RENDER_BASE_URL`.                                |
| `PDF_STORAGE_PATH`      |    Sí en producción | Ruta del volumen persistente montado para PDFs. Sin ella, se usa `storage/pdfs` relativo al código.                        |
| `NODE_ENV`              |                  Sí | Usar `production` para emitir logs JSON.                                                                                   |
| `PORT`                  |                  No | Puerto HTTP; predeterminado `3002`.                                                                                        |
| `CORS_ORIGINS`          | Sí si hay navegador | Orígenes web exactos separados por coma; evitar comodines.                                                                 |
| `PDF_RENDER_TIMEOUT_MS` |                  No | Límite de generación PDF; predeterminado 15000 ms.                                                                         |

`*` Configurar exactamente una URL interna accesible. Cualquier contraseña/token usado por el frontend se suministra por separado y no debe aparecer en el URL.

Usa `npm run start:deploy` como Start Command recomendado para servicios de producción en Render o contenedores Docker. El comando ejecuta migraciones y bootstrap con los artefactos compilados de `dist/` antes de iniciar `start:prod`. En el primer despliegue, configura temporalmente `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` en el entorno privado del servicio. Después del primer despliegue exitoso, elimina esas tres variables del panel del proveedor; el bootstrap omite la creación y termina con código 0 cuando ya hay usuarios o cuando faltan esas credenciales en producción. No incluyas esas variables en el frontend ni en imágenes del contenedor.

### Secuencia de despliegue

1. Seleccionar el release/tag y comprobar el estado de migraciones contra el ambiente (`npm run migration:show`) sin imprimir secretos.
2. Tomar respaldo consistente de MariaDB y storage; registrar ubicación, hora, resultado y responsable. No continuar si falla.
3. Crear la nueva imagen/instancia desde el release y cargar los secretos/configuración del ambiente.
4. Configurar `npm run start:deploy` como Start Command del servicio (en Docker, como comando del contenedor). El flujo ejecuta:

   ```sh
   npm run migration:run
   npm run bootstrap:admin
   npm run start:prod
   ```

   `migration:run` y `bootstrap:admin` compilan el proyecto y ejecutan la versión correspondiente desde `dist/`; no se requiere `ts-node` en producción. Instalar dependencias y compilar también puede hacerse en la fase de build de la plataforma.

5. `migration:run` solo procede si el respaldo está confirmado. Verificar su salida y luego ejecutar `npm run migration:show`; no promocionar la instancia si quedan migraciones pendientes o hay errores.
6. En una instancia nueva, llamar `GET /health/live` y `GET /health/ready`. La readiness debe informar `database`, `storage` y `pdf_renderer` como `up`. Confirmar además una operación autenticada de lectura y una emisión PDF de prueba con datos no productivos.
7. Promover tráfico al release nuevo y observar errores HTTP, latencia, readiness, logs con `correlation_id`, generación/descarga PDF y espacio del volumen.
8. Mantener la versión anterior disponible hasta completar el período de observación definido por operación. Verificar que la versión anterior sea compatible con el esquema expandido.

### Estrategia recomendada: Blue/Green

Mantener dos grupos de instancias detrás del balanceador: el grupo activo (Blue) y el nuevo (Green). Ejecutar migraciones compatibles hacia adelante antes de cambiar tráfico; desplegar Green con el mismo volumen persistente compartido (o el adaptador de object storage) y verificar health checks. Cambiar el balanceador a Green gradualmente. Mantener Blue disponible para volver a enrutar tráfico.

Las migraciones deben seguir expansión/contracción: primero agregar estructuras compatibles, desplegar código que soporte ambas formas, migrar datos y eliminar estructuras antiguas en un release posterior. No iniciar dos procesos de migración simultáneos. La configuración TypeORM del backend usa `synchronize: false` y `migrationsRun: false`; migraciones se ejecutan como paso controlado.

### Rollback

1. Si Green falla en health, API o PDFs, enrutar el tráfico al grupo Blue desde el balanceador/orquestador. No borrar Green ni el volumen hasta preservar logs y diagnóstico.
2. Si la migración fue compatible hacia atrás, dejar el esquema expandido y ejecutar el binario anterior. No revertir el esquema solo para volver el tráfico.
3. Solo si la migración es reversible, la versión previa requiere el esquema anterior y el responsable de base de datos confirma el respaldo, ejecutar una migración a la vez:

   ```sh
   npm run migration:revert
   npm run migration:show
   ```

   TypeORM revierte la última migración aplicada. Revisar primero el método `down()` y el impacto de pérdida de datos. Si no es segura, restaurar el respaldo en una base separada y planificar recuperación; no repetir la migración sobre producción a ciegas.

4. Si hay corrupción o pérdida de datos, detener escrituras, preservar el estado actual, y seguir el procedimiento de restauración aprobado para el entorno. Reconciliar datos creados después del respaldo antes de reabrir tráfico.
5. Registrar release, hora, decisión, correlaciones afectadas y resultado. Mantener tráfico en la versión estable hasta corregir y volver a desplegar Green.

### Persistencia de PDFs

La implementación local guarda PDFs en `PDF_STORAGE_PATH`; el valor predeterminado `storage/pdfs` es solo para desarrollo y **no es adecuado para producción efímera**. Montar un volumen persistente compartido en la misma ruta en todas las instancias, limitar permisos al usuario del proceso, incluirlo en respaldos y probar una restauración. No limpiar PDFs como archivos temporales. En despliegues multi-instancia, un filesystem compartido consistente o un adaptador S3-compatible registrado en `PdfModule` es obligatorio.

### Rotación de secretos

Rotar desde el gestor de secretos, nunca editando valores en el repositorio. Para `PDF_RENDER_SECRET`, coordinar el cambio en backend y frontend y desplegarlos de forma compatible para evitar renders inválidos. Para `JWT_SECRET`, planificar la invalidación de tokens/sesiones y comunicar la reautenticación; no asumir rotación transparente. Revisar logs posteriores para confirmar ausencia de valores filtrados.

### Configuración local

> **Estado:** vigente. Preparación local del backend y comandos disponibles. No cubre configuración productiva ni valores de secretos.

#### Requisitos

- Node.js y npm compatibles con el proyecto.
- MariaDB accesible y base de datos creada.
- Dependencias instaladas con `npm install`.

#### Variables

Configura en `.env` local:

- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`.
- `JWT_SECRET`.
- Para generar PDFs: `PDF_RENDER_SECRET` (mínimo 32 caracteres) y `PDF_RENDER_BASE_URL` o `FRONTEND_INTERNAL_URL`. El valor local habitual es `http://localhost:3004`.
- Opcional: `PDF_STORAGE_PATH`.

El archivo `.env.example` incluye las variables reconocidas y deja los secretos vacíos. Copia ese archivo como `.env` y completa credenciales locales; nunca copies secretos reales a archivos versionados.

No publiques secretos ni uses una variable `NEXT_PUBLIC_*` para `PDF_RENDER_SECRET`.

#### Arranque

Primero inicia el frontend según su manual local, y luego en el backend:

```powershell
npm install
npm run migration:show
npm run migration:run
npm run start:dev
```

La API escucha en `http://localhost:3002`. `start:dev` solo levanta NestJS; las migraciones se aplican explícitamente con `npm run migration:run`, después de revisar el estado y respaldar la base si contiene datos existentes.

Para aprovisionar el primer Admin, inyecta temporalmente `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` de al menos 12 caracteres al proceso aislado `npm run bootstrap:admin`. El CLI solo crea la cuenta cuando no existe ningún usuario en la base de datos. Nunca configures estas variables en el servicio HTTP. No existe una ruta HTTP `/auth/seed`.

#### Comandos útiles

- `npm run build`: compila la API.
- `npm run lint`: analiza `src/` y `test/`.
- `npm run test`: ejecuta las pruebas unitarias.
- `npm run test:e2e`: ejecuta pruebas end to end.
- `npm run migration:show`: compila y muestra migraciones pendientes/aplicadas en la base configurada.

Consulta el [índice], la [arquitectura y seguridad](./ARQUITECTURA_Y_CONTRATOS.md#doc-arquitectura-arquitectura-y-stack) y el [esquema y migraciones](./ARQUITECTURA_Y_CONTRATOS.md#doc-base-de-datos-esquema-y-migraciones).

<a id="doc-manuales-runbook-incidentes"></a>

**Origen:** docs/manuales/runbook-incidentes.md

## Runbook de respuesta a incidentes

### Reglas para cualquier incidente

1. Registrar hora, ambiente, release, síntoma y `x-correlation-id` de una petición afectada. No copiar tokens, contraseñas, snapshots ni datos personales a tickets.
2. Consultar `GET /health/live` y `GET /health/ready`; revisar logs JSON por `correlation_id`, status HTTP y servicio marcado `down`.
3. Priorizar detener el impacto y conservar evidencia. No borrar PDFs, reiniciar migraciones ni restaurar sobre la base activa sin preservar el estado y coordinar con el responsable de base de datos/operación.
4. Registrar acciones, resultado, responsable y decisión de recuperación; notificar al responsable operativo definido para el ambiente.

### Base de datos MariaDB/PostgreSQL no disponible

> La implementación actual usa MariaDB (`type: 'mariadb'` en TypeORM). PostgreSQL requiere un driver y configuración específicos antes de usarse.

1. Confirmar `GET /health/live` (proceso) y el estado `database` de `/health/ready`. Verificar desde la instancia conectividad DNS/red/puerto, disponibilidad y conexiones del servidor de base de datos.
2. Revisar estado del proveedor, pool/conexiones, límites de conexiones y logs de base de datos. No imprimir `DB_PASSWORD` ni cadenas de conexión.
3. Si la base está reiniciando o inaccesible, mantener instancias vivas; la aplicación no está lista y el balanceador debe retirar tráfico según su configuración. No cambiar credenciales por ensayo/error.
4. Si hay saturación, detener jobs/consumidores no esenciales y reducir temporalmente tráfico de escritura de acuerdo con operación. No aumentar conexiones sin revisar capacidad del servidor.
5. Cuando la base se recupere, comprobar `/health/ready`, una lectura autenticada y una escritura controlada. Revisar errores recientes agrupados por `correlation_id` antes de reabrir tráfico.
6. Si hay corrupción o pérdida, congelar escrituras y ejecutar la restauración aprobada para el entorno; no restaurar encima de la base sin preservar copia del estado fallido.

### Playwright falla o agota memoria al generar PDF

1. Buscar respuestas 503 de emisión/descarga y `pdf_renderer` en `/health/ready`; correlacionar petición usando `x-correlation-id`. Los logs de renderer no deben incluir datos de documentos.
2. Revisar memoria disponible, reinicios/OOM del contenedor, procesos Chromium huérfanos, conectividad desde backend a `PDF_RENDER_BASE_URL`/`FRONTEND_INTERNAL_URL`, fuentes y assets del frontend interno.
3. Si hay presión de memoria, detener temporalmente nuevas emisiones (no borrar/alterar documentos ya emitidos) y escalar capacidad o reducir concurrencia de instancias/trabajos conforme a la plataforma. El servicio mantiene un solo browser y crea una página por render.
4. Verificar que `PDF_RENDER_SECRET` coincida en backend/frontend sin mostrar el valor. Revisar que Playwright/Chromium y sus dependencias estén presentes en el runtime.
5. Cuando `/health/ready` reporte renderer arriba, generar un PDF de prueba controlado, validar descarga y hash SHA-256. Reanudar emisiones y observar errores 503 y memoria.
6. No regenerar un documento oficial desde datos actuales si no existe su snapshot inmutable. Seguir [runbook de PDFs](./OPERACION_Y_CALIDAD.md#doc-manuales-runbook-pdfs).

### Disco `storage/pdfs` lleno

1. Confirmar `storage` en `/health/ready`, espacio e inodos del volumen configurado por `PDF_STORAGE_PATH`, cuotas y errores de escritura. No asumir que la ruta por defecto es un volumen persistente.
2. Suspender nuevas emisiones PDF para evitar fallos repetidos; mantener lecturas si los archivos existentes siguen disponibles.
3. Identificar crecimiento por fecha/tamaño y revisar política de retención aprobada. **No borrar PDFs oficiales** como limpieza urgente. Si no hay retención aprobada, ampliar volumen o migrar a object storage persistente.
4. Verificar espacio libre y permisos después de ampliar/liberar únicamente archivos temporales autorizados. Probar escritura y lectura por readiness y emitir un PDF de prueba.
5. Reanudar emisiones, revisar fallos de persistencia y comprobar hash de archivos afectados. Si faltan archivos, recuperar desde respaldo o usar el flujo de regeneración desde snapshot del runbook PDF.

### Migración TypeORM falla a mitad

1. Detener la promoción y no iniciar otra ejecución concurrente de `npm run migration:run`. Conservar salida del proceso, release, hora y logs; retirar la nueva versión del balanceador si afecta servicio.
2. Consultar `npm run migration:show` y la tabla `typeorm_migrations`; determinar si la migración marcó aplicación, si la transacción fue revertida y qué DDL quedó aplicado. El datasource usa `migrationsTransactionMode: 'each'`, pero no asumir que todo DDL MariaDB es transaccional.
3. Tomar una copia del estado actual antes de cualquier reparación. Revisar el `up()` y `down()` exactos, comprobar esquema/datos y estimar si reejecutar es idempotente.
4. Si quedó aplicada y el esquema es correcto, verificar el release y continuar con el procedimiento documentado. Si quedó parcial, preparar reparación explícita con DBA en staging/copia primero; no editar la tabla de migraciones manualmente ni borrar filas para forzar reejecución sin evidencia.
5. Ejecutar `npm run migration:revert` solo si `down()` fue revisado, es seguro para los datos y se aprobó recuperación. En otro caso, restaurar respaldo en una base separada o crear una migración correctiva hacia adelante.
6. Repetir en staging, volver a ejecutar `npm run migration:show`, validar `/health/ready` y pruebas de lectura/escritura antes de promover. Registrar la causa y la reparación aplicada.

### Cierre

Anotar impacto/usuarios afectados, duración, release, correlaciones, causa conocida o pendiente, respaldo/restauración usados y acciones preventivas. Confirmar alertas de 5xx, base, renderer y capacidad de storage antes de cerrar el incidente.

<a id="doc-manuales-runbook-pdfs"></a>

**Origen:** docs/manuales/runbook-pdfs.md

## Runbook de PDFs oficiales

### Flujo de emisión

1. Cotizaciones y certificados preparan `snapshot_datos` con los valores y la versión de formato usados para emitir.
2. El backend firma ese snapshot con `PDF_RENDER_SECRET` y abre la ruta interna correspondiente del frontend (`/internal/pdf/cotizacion` o `/internal/pdf/certificado`) usando Playwright.
3. Playwright espera la respuesta, el documento, las fuentes y las imágenes, aplica medio de impresión y produce los bytes PDF. La generación completa tiene un límite de 15 segundos (`PDF_RENDER_TIMEOUT_MS` permite ajustarlo).
4. `PdfGeneratorService` calcula SHA-256 de esos bytes y los entrega a `StorageService`. La implementación local guarda en `storage/pdfs` (o en `PDF_STORAGE_PATH`) mediante archivo temporal y renombrado atómico.
5. En la transacción del documento se guardan `pdf_url`, `hash_pdf`, `pdf_renderer_version` y el snapshot. Si el render falla o excede el límite, se devuelve 503 y no se guarda el registro de emisión.
6. Al descargar, el backend lee los bytes a través de `StorageService`, comprueba el SHA-256 contra `hash_pdf` y responde con esos mismos bytes. Una discrepancia no se entrega como si fuera un documento válido.

`StorageService` es el límite para el proveedor: un adaptador de S3 u otro object store debe implementar `saveFile`, `getFile` y `deleteFile`, y registrarse como proveedor de `StorageService` en `PdfModule`. Las claves son privadas y relativas, por ejemplo `certificados/001-react-playwright-v1.pdf`.

### Diagnóstico de integridad

Obtenga `pdf_url` y `hash_pdf` del registro correspondiente, descargue el objeto de almacenamiento por el canal operativo autorizado y calcule el hash:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath .\certificado.pdf
```

Compare `Hash` con `hash_pdf` (64 caracteres hexadecimales). Para verificar lo que recibe el usuario, descargue por `GET /certificados/:id/descargar` o `GET /cotizaciones/:id/descargar` y calcule el hash sobre el archivo descargado. El servicio también hace esta comparación antes de responder.

No copie snapshots, tokens públicos ni archivos PDF a tickets o canales públicos. `snapshot_datos` puede contener datos personales/comerciales y credenciales de validación del certificado.

### Recuperación de un PDF huérfano

Un PDF huérfano puede ser un objeto ausente o alterado mientras el registro y su snapshot siguen en la base de datos. La descarga oficial detecta el objeto ausente o un hash incorrecto y regenera el documento desde `snapshot_datos`; una versión de render antigua también se reconstruye desde ese snapshot. Solicite de nuevo la descarga autenticada del registro para activar la recuperación y confirme que `pdf_url`, `hash_pdf` y `pdf_renderer_version` se actualizaron.

Si no hay snapshot, no reconstruya el documento con datos actuales: eso produciría un documento distinto al emitido. Marque el caso para revisión de Calidad y recupere el respaldo consistente del PDF o de la base de datos. Si la generación devuelve 503, revise disponibilidad del frontend interno, Chromium/Playwright, fuentes e imágenes; reintente cuando el servicio esté estable. La operación fallida no reemplaza la fila previa.

La recuperación requiere que el PDF esté emitido y que exista `snapshot_datos`. Proteja el acceso al endpoint de descarga y ejecute el procedimiento con una cuenta autorizada.


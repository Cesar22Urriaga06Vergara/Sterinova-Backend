> **Análisis fechado — 4 de noviembre de 2026.** Es una revisión de código en un momento concreto, no una guía operativa. Para el arranque local y el aprovisionamiento del administrador, sigue los manuales vigentes de este repositorio.

# Análisis de Estado Actual - Sterinova ERP (V2)
**Fecha:** 4 de noviembre de 2026

> **Alcance:** revisión del código fuente disponible en `backend_sterinova` y `frontend_sterinova`. Se describe lo que está implementado en código; los documentos funcionales previos se usan como referencia, no como prueba de funcionalidad. Este documento no certifica el despliegue ni la validación del sistema en producción.

## 1. Resumen Ejecutivo

Sterinova ERP cuenta con una aplicación web Next.js y una API REST NestJS conectada a MariaDB mediante TypeORM. Comparado con el estado documentado anteriormente, ya existe un recorrido parcial desde el acceso y la gestión comercial hasta la logística y el registro de un ciclo de esterilización:

- **Módulo 0 — Auth:** login con email y contraseña, hash bcrypt y emisión de JWT de ocho horas. Un guard JWT global protege la API, salvo los endpoints marcados públicos. El frontend guarda el token en `localStorage` y el cliente Axios lo envía como `Bearer`.
- **Módulo 1 — Comercial:** alta, consulta y edición de clientes; importación Excel con deduplicación por NIT; creación y consulta de cotizaciones, aprobación operativa, cálculo de valores en backend y descarga de PDF desde el navegador.
- **Módulo 2 — Logística:** creación de órdenes desde cotizaciones aprobadas, consulta y avance de estados para registrar la recolección y llegada a planta.
- **Módulo 3 — Planta:** consulta de órdenes `EN_PLANTA` y registro de ciclos. En una transacción, el ciclo queda `PENDIENTE_CALIDAD` y la orden cambia a `PROCESADO`.

El recorrido está incompleto en el punto crítico de **Calidad**: existe una entidad de certificado, pero no hay flujo de aprobación, módulo API ni página de revisión. Tampoco se genera el certificado de esterilización. La administración de usuarios no tiene API de gestión ni interfaz. No hay captura de firma del cliente ni aplicación móvil/web dedicada a conductores.

**Conclusión:** prototipo funcional parcial para comercial, logística y registro de planta; todavía no está completo para operar el ciclo regulado de esterilización ni listo para producción. La configuración actual mantiene `synchronize: true`, caché en memoria y direcciones locales; faltan controles de autorización por rol, gestión de certificados, configuración productiva y despliegue.

## 2. Estado de los Módulos (Completados vs Pendientes)

| Módulo | Estado | Backend + Frontend |
|---|---|---|
| **Auth** | Parcial implementado | Login, bcrypt, JWT y guard global. No hay control de acceso por rol ni gestión de sesiones Redis. La creación inicial de Admin está expuesta en una ruta pública con credenciales predefinidas. |
| **Comercial** | Funcional parcial | CRUD de clientes en API y alta/edición/listado en interfaz; importación Excel; alta/listado/aprobación de cotizaciones y PDF. La UI no permite eliminar clientes ni editar/eliminar cotizaciones. |
| **Logística** | Funcional parcial | API para generar/listar órdenes y cambiar estado; tablero web para crearlas y avanzarlas hasta `EN_PLANTA`. No hay vista móvil del conductor ni firma digital de recepción. |
| **Planta** | Registro de ciclo implementado | La API lista órdenes en planta y ciclos, y registra ciclos vinculados a operador y orden. La interfaz muestra órdenes/historial y permite registrar un ciclo. Calidad, evidencias y rangos de proceso siguen pendientes. |
| **Calidad** | Pendiente | Solo está definida la entidad de certificado. No hay controlador, servicio, endpoints, interfaz de aprobación, firma, rechazo ni emisión del certificado. |
| **Usuarios** | Parcial (modelo y servicio) | Existe entidad, servicio de creación y consulta por email para autenticación. No hay endpoints ni pantallas para administrar usuarios, asignar roles o permisos. |

### Reglas de negocio que sí se aplican

- **Clientes:** NIT único en la base de datos. La importación procesa la primera hoja `.xlsx`/`.xls`; reconoce `CLIENTE` como razón social e `ID` como NIT. Normaliza encabezados, asigna “No registra” a contacto, teléfono y dirección vacíos, valida que razón social y NIT estén presentes en la interfaz, y omite NIT duplicados dentro del archivo o ya existentes. La API masiva devuelve `{ imported, skipped }`.
- **Cotizaciones:** debe tener al menos un ítem y un cliente existente. El backend calcula las líneas, subtotal, IVA fijo del 19 % y total, redondeados a dos decimales. Los consecutivos son `COT-CMI-`, `COT-LAV-`, `COT-CEMFA-`, `COT-CMED-`, `COT-CME-` o `COT-IND-`, seguidos de una secuencia de tres dígitos, según tipo. La interfaz actualmente ofrece cinco tipos; el backend enumera siete (`FARMACEUTICO` y `FABRICANTE` no aparecen en el selector).
- **Órdenes:** solo se generan desde una cotización `APROBADA`; una cotización admite como máximo una orden por la columna única `cotizacion_id`. El consecutivo usa `OS-{año}-{secuencia de cuatro dígitos}`. La interfaz avanza `PENDIENTE → EN_RUTA → RECOGIDO → EN_PLANTA`. La API comprueba que el estado pertenezca al enum, pero no restringe por sí misma la transición a ese orden secuencial.
- **Ciclos:** solo se registran para órdenes `EN_PLANTA`; quedan asignados al usuario autenticado y cambian la orden a `PROCESADO` en una única transacción. El DTO valida números no negativos y campos requeridos, pero no aplica rangos específicos por método, equipo o protocolo.
- **JWT:** la API exige un JWT válido en las rutas no públicas. Esto no equivale a autorización por rol: no hay guards/policies que restrinjan acciones por perfil.

## 3. Base de Datos (Esquema Actual)

La conexión MariaDB/TypeORM se configura con variables `DB_*`. TypeORM registra siete entidades y `synchronize: true`; no se encontraron migraciones. Los nombres de tabla siguientes corresponden a `@Entity`.

| Tabla / entidad | Campos y restricciones relevantes | Relaciones |
|---|---|---|
| `usuarios` (`User`) | `id`, `nombre`, `email` único, `password_hash`, `rol` (default `Admin`), `created_at`. No contiene `firma_digital_url`. | Un usuario puede quedar asociado como operador en varios ciclos (`ciclos_esterilizacion.operador_id`). |
| `clientes` (`Cliente`) | `id`, `razon_social`, `nit` único, `contacto`, `telefono`, `email`, `direccion`, `created_at`. | Un cliente puede tener varias cotizaciones; la FK reside en `cotizaciones.cliente_id`. |
| `cotizaciones` (`Cotizacion`) | `id`, `consecutivo` único, `fecha`, `tipo_servicio` enum, `estado`, `subtotal`, `iva`, `total`, `condiciones_comerciales`, `cliente_id`. | Muchos-a-uno con `clientes` (`RESTRICT`); uno-a-muchos con `cotizacion_items` (cascada al borrar ítems); uno-a-uno con `ordenes_servicio` mediante `cotizacion_id` único. |
| `cotizacion_items` (`CotizacionItem`) | `id`, `descripcion`, `cantidad`, `valor_unitario`, `valor_total`, `cotizacion_id`. | Muchos-a-uno con `cotizaciones`; al borrar la cotización, los ítems se eliminan en cascada. |
| `ordenes_servicio` (`OrdenServicio`) | `id`, `consecutivo` único, `cotizacion_id` único, `fecha_programada`, `estado` enum, `conductor_asignado`, `vehiculo_placa`, `observaciones`, `created_at`. | Uno-a-uno con `cotizaciones` (`RESTRICT`); uno-a-muchos desde orden hacia ciclos. Los certificados pueden referenciar la orden. |
| `ciclos_esterilizacion` (`CicloEsterilizacion`) | `id`, `orden_id`, `equipo`, `metodo` (`ETO`/`VAPOR`), `operador_id`, temperatura, humedad, presión, tiempos, controles biológico/químico, `fecha_proceso`, `estado`. | Muchos-a-uno con `ordenes_servicio` y muchos-a-uno con `usuarios`; ambas relaciones restringen el borrado (`RESTRICT`). |
| `certificados_esterilizacion` (`CertificadoEsterilizacion`) | `id`, `consecutivo` único, `orden_id` nullable, equipo, ciclo, `parametros_tecnicos` JSON simple, controles biológicos, `estado` default `Borrador`, `created_at`. | Muchos-a-uno opcional con `ordenes_servicio`; al borrar la orden, `orden_id` pasa a `NULL`. No existe una política implementada de inmutabilidad al aprobar. |

No hay entidades ni tablas propias para sesiones, aprobaciones/auditoría, evidencias adjuntas o firmas. La definición de `DATABASE.md` contiene campos y reglas que no coinciden completamente con las entidades actuales; debe mantenerse sincronizada con el esquema efectivo.

## 4. Backend (API REST)

La API escucha en el puerto `3001`, no define prefijo global, aplica `ValidationPipe` global (transformación, whitelist y rechazo de propiedades no permitidas) y permite CORS desde `http://localhost:3000`. Salvo las dos rutas públicas de Auth, las rutas están protegidas por el guard JWT global. No existe autorización por rol.

| Método y ruta | Acceso | Función |
|---|---|---|
| `GET /` | JWT | Endpoint básico de bienvenida. |
| `POST /auth/login` | Público | Valida credenciales y devuelve `access_token` y datos del usuario. |
| `POST /auth/seed` | Público | Crea `admin@sterinova.co` con contraseña fija `admin123` si no existe; conflicto si ya existe. Debe retirarse o protegerse antes de producción. |
| `POST /clientes` | JWT | Crea cliente. |
| `POST /clientes/bulk` | JWT | Importa un arreglo de clientes; deduplica por NIT y devuelve contadores `imported` y `skipped`. |
| `GET /clientes` | JWT | Lista clientes. |
| `GET /clientes/:id` | JWT | Consulta cliente por ID. |
| `PUT /clientes/:id` | JWT | Actualiza cliente. |
| `DELETE /clientes/:id` | JWT | Elimina cliente. |
| `POST /cotizaciones` | JWT | Crea cotización con ítems; verifica cliente y calcula consecutivo, subtotal, IVA y total. |
| `GET /cotizaciones` | JWT | Lista cotizaciones con cliente e ítems. |
| `GET /cotizaciones/:id` | JWT | Consulta cotización con relaciones. |
| `PUT /cotizaciones/:id` | JWT | Actualiza campos de cotización; la interfaz lo usa para marcar `APROBADA`. |
| `DELETE /cotizaciones/:id` | JWT | Elimina cotización. |
| `POST /logistica/ordenes` | JWT | Crea orden desde cotización aprobada sin orden existente. |
| `GET /logistica/ordenes` | JWT | Lista órdenes con cotización y cliente. |
| `GET /logistica/cotizaciones-aprobadas` | JWT | Lista cotizaciones aprobadas que no tienen orden. |
| `GET /logistica/ordenes/:id` | JWT | Consulta una orden y sus relaciones. |
| `PUT /logistica/ordenes/:id/estado` | JWT | Actualiza el estado de orden si pertenece al enum. |
| `GET /planta/ordenes` | JWT | Lista órdenes en estado `EN_PLANTA`. |
| `GET /planta/ciclos` | JWT | Lista ciclos con orden, cliente y operador. |
| `POST /planta/ciclos` | JWT | Registra ciclo para la orden en planta, asigna operador del JWT y actualiza orden a `PROCESADO` en transacción. |

No hay rutas de gestión de usuarios, Calidad, aprobación de certificados, carga de tirillas, firma digital, generación/descarga/validación del certificado 55388 ni QR.

## 5. Frontend (Rutas y Vistas)

Las rutas bajo el grupo Next.js `(erp)` se publican sin ese segmento:

| Ruta | Funcionalidad |
|---|---|
| `/login` | Formulario de email/contraseña; guarda `access_token` y usuario en `localStorage`. |
| `/` | Dashboard con saludo y tarjetas de indicadores estáticos/codificados; no consulta métricas de API. |
| `/comercial` | Índice comercial con accesos a clientes y cotizaciones; reportes marcados “Próximamente”. |
| `/comercial/clientes` | Lista clientes, crea y edita mediante formulario modal, e importa Excel. No muestra acción de eliminación. |
| `/comercial/cotizaciones` | Lista cotizaciones, permite aprobarlas y generar/descargar el PDF de cotización. |
| `/comercial/cotizaciones/nueva` | Formulario para cliente, tipo de servicio, condiciones comerciales e ítems; muestra subtotal, IVA y total preliminares. |
| `/logistica` | Tablero de órdenes; crea orden desde cotización aprobada, registra fecha/conductor/vehículo/observaciones y avanza estados de recolección. |
| `/planta` | Lista órdenes en planta e historial de ciclos; acceso al registro de ciclo. |
| `/planta/ciclo/nuevo` | Formulario de método, equipo, parámetros y controles para registrar el ciclo de una orden. |

El menú lateral también muestra enlaces a `/calidad` y `/usuarios`, pero esas páginas no existen en el árbol actual. El layout redirige al login cuando falta un token en el navegador; el token además se añade a las peticiones del cliente Axios. La URL de API y el origen CORS están fijados a localhost, por lo que requieren configuración por entorno para desplegar.

## 6. Estado del Generador de PDFs

`CotizacionPDF.tsx` y `CertificadoPDF.tsx` son los componentes React compartidos por la vista previa y la ruta interna de impresión. `PdfGeneratorService` usa Playwright para renderizar `/internal/pdf/cotizacion` o `/internal/pdf/certificado` y almacena el PDF resultante. La UI solicita la emisión y descarga oficial por `POST /cotizaciones/:id/emitir`, `GET /cotizaciones/:id/descargar` y `GET /certificados/:id/descargar`; las descargas no deben crear el PDF con `html2pdf.js` en el navegador.

Las emisiones nuevas guardan la versión del motor junto con `pdf_url` y `hash_pdf`. La primera descarga de un documento anterior sin esa marca lo vuelve a renderizar desde su snapshot, guarda el archivo/version/hash nuevos y entrega ese archivo. La migración `AddPdfRendererVersion1793813500000` debe ejecutarse antes de desplegar esta ruta. El acceso a PDFs históricos de certificados mantiene inmutables sus datos de negocio y permite actualizar únicamente la referencia y metadatos técnicos del archivo.

La vista previa y el PDF oficial comparten los componentes React, pero la equivalencia visual final debe verificarse en el navegador y cotejarse contra los formatos Word vigentes; las pruebas automatizadas no acreditan por sí solas la aceptación visual. La disponibilidad del flujo depende de configurar `PDF_RENDER_SECRET`, `PDF_RENDER_BASE_URL` (o `FRONTEND_INTERNAL_URL`) y la ruta pública de imágenes del frontend.

## 7. Deuda Técnica y Pendientes (TODOs)

1. **Módulo de Calidad:** construir la bandeja de ciclos pendientes, revisión de parámetros/evidencias, aprobación o rechazo, firma y trazabilidad de la decisión.
2. **Certificado de esterilización 55388:** implementar datos/versionado, emisión PDF, numeración, firma(s), QR verificable y política de inmutabilidad posterior a aprobación.
3. **PDF de cotizaciones:** cotejar cada plantilla contra el Word oficial y refinar diseño, contenido, logos, colores, recuadros, iconografía, saltos y consistencia entre los siete tipos del backend y los tipos habilitados en UI.
4. **Redis en producción:** el código registra caché en memoria; aunque el adaptador Redis está en dependencias, no está configurado como store activo ni se implementan sesiones Redis.
5. **Despliegue:** definir ambientes, secretos, URL pública, CORS, persistencia, observabilidad, respaldos, proceso de build y estrategia de publicación. No se encontró configuración que acredite un despliegue operativo.
6. **Autorización:** agregar permisos por rol y proteger acciones sensibles; retirar la ruta pública `/auth/seed` y la contraseña predefinida. El guard actual autentica, pero no autoriza por rol.
7. **Persistencia segura:** sustituir `synchronize: true` por migraciones revisadas antes de usar datos productivos; definir estrategia atómica para consecutivos y auditoría de cambios.
8. **Ciclo logístico móvil:** completar la vista del conductor, asignación/entrega, captura de firma y evidencia de recepción.
9. **Planta y trazabilidad:** adjuntar tirilla/evidencias y configurar límites/rangos de proceso por método y protocolo; definir qué ocurre al reprocesar una orden.
10. **Gestión de usuarios:** alta/edición/desactivación, roles, recuperación/cambio de contraseña y control de firma.
11. **Configuración y cobertura:** mover URLs/orígenes a variables de entorno; añadir pruebas de integración de rutas protegidas, transiciones de estado, flujo de Calidad/PDF y pruebas de interfaz relevantes.
12. **Dashboard y reportes:** reemplazar contadores estáticos por métricas reales y completar reportes comerciales/operativos.

## 8. Próximos Pasos Recomendados

Para cerrar primero el ciclo operativo, programar en este orden:

1. **Diseñar e implementar Calidad de extremo a extremo:** definir estados y permisos; consultar ciclos `PENDIENTE_CALIDAD`; aprobar/rechazar con identidad del aprobador y auditoría; guardar la decisión de forma transaccional e inmutable.
2. **Generar el certificado 55388 desde un ciclo aprobado:** modelar los campos oficiales, consecutivo atómico, plantilla PDF, firma y QR con una página/endpoint verificable. Probar datos reales antes de emitirlo.
3. **Completar evidencia de Planta y recolección:** carga/almacenamiento de tirilla, validación de parámetros según método y captura de firma de recepción por logística.
4. **Cerrar controles de producción antes de operar:** permisos por rol, retirar el seed público, migraciones, Redis/configuración por entorno y pruebas e2e del recorrido completo.
5. **Validar plantillas y desplegar:** cotejar los PDFs contra documentos oficiales, probar aceptación con usuarios y desplegar a un ambiente controlado con respaldos y monitoreo.

El siguiente incremento de producto recomendado es **Módulo de Calidad + emisión del certificado 55388**; es el eslabón que transforma el registro de proceso existente en un ciclo operativo trazable y cerrable.

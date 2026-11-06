> **Estado:** histórico — fotografía de código al 3 de noviembre de 2026.
> **Verificado contra:** no revalidado en esta auditoría; se preserva como antecedente.
> **Alcance:** fotografía previa del estado backend/frontend.
> **No cubre:** estado actual posterior al 3 de noviembre ni operación desplegada.
> **Reemplazado por:** [análisis del 4 de noviembre](analisis-estado-2026-11-04.md), posteriormente sustituido por [documentación vigente](../modulos.md).
> No usar como estado vigente.

# Análisis del estado actual — Sterinova ERP

**Fecha de revisión:** 3 de noviembre de 2026  
**Alcance:** código fuente actual de `backend_sterinova` y `frontend_sterinova`. Este documento describe lo que existe en el repositorio; la documentación funcional se toma como contexto, no como prueba de que una función esté implementada. No se modificó código de la aplicación ni se ejecutaron pruebas.

## 1. Resumen ejecutivo

El proyecto tiene un esqueleto funcional de ERP con backend NestJS y frontend Next.js. Los flujos implementados de extremo a extremo con mayor cobertura son:

- **Acceso inicial:** login con email/contraseña, contraseñas almacenadas con bcrypt y emisión de JWT de ocho horas. La aplicación web comprueba la presencia de un token en `localStorage`, pero la API no exige ese JWT en sus controladores.
- **Comercial — clientes:** alta, consulta, importación masiva desde Excel y deduplicación por NIT. La API también ofrece actualización y eliminación, aunque la interfaz no expone esas acciones.
- **Comercial — cotizaciones:** alta con varios ítems, listado, consulta, cambio de estado desde la interfaz, cálculo de importes en el servidor y descarga de PDF de cotización generado en el navegador.
- **Logística — recolección:** creación de una orden desde una cotización aprobada, listado y transición de estado hasta “En planta”.

Hay entidades registradas para usuarios, clientes, cotizaciones, sus ítems, órdenes de servicio y certificados de esterilización. La entidad de certificados es, por ahora, únicamente un modelo de datos: no tiene módulo, servicio, controlador ni interfaz asociados.

**Estado global:** prototipo funcional parcial, no listo para operación regulada ni producción. No están implementados Planta ni Calidad; la aprobación de cotizaciones y el control de estados tampoco aplican autorización por rol. La aplicación depende de MariaDB y de configuración de entorno válida. El dashboard muestra indicadores estáticos.

## 2. Base de datos — esquema actual

La conexión se configura en `src/app.module.ts` mediante TypeORM y MariaDB. Las seis entidades siguientes se registran para sincronización automática (`synchronize: true`); por ello TypeORM puede crear sus tablas al iniciar. No se encontraron migraciones. Los tipos de columnas inferidos —por ejemplo, `varchar`— se indican como tales cuando la entidad no fija explícitamente longitud o tipo.

| Tabla | Columnas principales | Claves y relaciones |
|---|---|---|
| `usuarios` | `id` entero autogenerado; `nombre` varchar; `email` varchar único; `password_hash` varchar; `rol` varchar con default `Admin`; `created_at` fecha/hora de creación. | PK `id`. No tiene relaciones declaradas. El modelo no incluye `firma_digital_url`, a diferencia del esquema descrito en `DATABASE.md`. |
| `clientes` | `id` entero autogenerado; `razon_social`, `contacto`, `telefono`, `email`, `direccion` varchar; `nit` varchar único; `created_at` fecha/hora de creación. | PK `id`. Un cliente puede tener múltiples cotizaciones; la relación se define desde `cotizaciones`. |
| `cotizaciones` | `id` entero autogenerado; `consecutivo` varchar único; `fecha` fecha/hora de creación; `tipo_servicio` enum; `estado` varchar default `Borrador`; `subtotal`, `iva`, `total` `DECIMAL(14,2)`; `condiciones_comerciales` text nullable; `cliente_id` int. | PK `id`; FK `cliente_id` → `clientes.id`, `ManyToOne`, borrado restringido (`RESTRICT`); `OneToMany` con `cotizacion_items`, con cascada y carga eager. |
| `cotizacion_items` | `id` entero autogenerado; `descripcion` varchar(500); `cantidad`, `valor_unitario`, `valor_total` `DECIMAL(12,2)`; `cotizacion_id` int. | PK `id`; FK `cotizacion_id` → `cotizaciones.id`, `ManyToOne`; borrado en cascada (`CASCADE`). |
| `ordenes_servicio` | `id` entero autogenerado; `consecutivo` varchar único; `cotizacion_id` int único; `fecha_programada` date; `estado` enum; `conductor_asignado` varchar(255) nullable; `vehiculo_placa` varchar(50) nullable; `observaciones` text nullable; `created_at` fecha/hora de creación. | PK `id`; `cotizacion_id` → `cotizaciones.id`, `OneToOne`, borrado restringido (`RESTRICT`). La unicidad permite como máximo una orden por cotización. |
| `certificados_esterilizacion` | `id` entero autogenerado; `consecutivo` varchar único; `orden_id` int nullable; `equipo`, `ciclo` varchar(255) nullable; `parametros_tecnicos` `simple-json` nullable; `controles_biologicos` text nullable; `estado` varchar default `Borrador`; `created_at` fecha/hora de creación. | PK `id`; FK nullable `orden_id` → `ordenes_servicio.id`, `ManyToOne`, borrado con `SET NULL`. No existe una regla de inmutabilidad implementada para certificados aprobados. |

El enum real de `cotizaciones.tipo_servicio` contiene `INDUSTRIAL_ETO`, `INSTITUCIONAL_ETO`, `INSTITUCIONAL_VAPOR`, `INSUMOS`, `LAVANDERIA`, `FARMACEUTICO` y `FABRICANTE`. El estado real de órdenes es `PENDIENTE`, `EN_RUTA`, `RECOGIDO`, `EN_PLANTA` o `CANCELADO`.

## 3. Backend — API REST disponible

El servidor escucha en el puerto `3001`, no configura un prefijo global y habilita CORS para `http://localhost:3000`. Las rutas de autenticación y negocio no tienen guardas JWT o de roles aplicadas.

| Método y ruta | Función |
|---|---|
| `GET /` | Endpoint de bienvenida; responde `Hello World!`. |
| `POST /auth/login` | Valida email y contraseña y devuelve `access_token` más datos básicos del usuario. |
| `POST /auth/seed` | Crea el usuario `admin@sterinova.co` con credenciales predefinidas si aún no existe; responde conflicto si ya existe. No requiere autenticación. |
| `POST /clientes` | Crea un cliente. |
| `POST /clientes/bulk` | Importa clientes en lote; omite NIT duplicados recibidos o ya guardados y devuelve `{ imported, skipped }`. |
| `GET /clientes` | Lista clientes en orden descendente por ID. |
| `GET /clientes/:id` | Obtiene un cliente por ID. |
| `PUT /clientes/:id` | Actualiza los campos enviados del cliente. |
| `DELETE /clientes/:id` | Elimina un cliente y devuelve un mensaje. |
| `POST /cotizaciones` | Crea cotización e ítems, valida existencia del cliente, genera consecutivo y calcula subtotal, IVA y total. Exige al menos un ítem. |
| `GET /cotizaciones` | Lista cotizaciones con cliente e ítems, orden descendente por ID. |
| `GET /cotizaciones/:id` | Obtiene una cotización con cliente e ítems. |
| `PUT /cotizaciones/:id` | Aplica los campos enviados a una cotización existente; la interfaz lo usa para marcarla `APROBADA`. |
| `DELETE /cotizaciones/:id` | Elimina la cotización. |
| `POST /logistica/ordenes` | Crea orden desde cotización aprobada sin orden previa; requiere fecha programada. |
| `GET /logistica/ordenes` | Lista órdenes con cotización, cliente e ítems asociados. |
| `GET /logistica/cotizaciones-aprobadas` | Devuelve cotizaciones `APROBADA` que todavía no tienen orden. |
| `GET /logistica/ordenes/:id` | Obtiene una orden con sus relaciones. |
| `PUT /logistica/ordenes/:id/estado` | Cambia el estado de una orden tras comprobar que pertenece al enum. |

No hay endpoints para administrar usuarios, certificados, ciclos de planta, evidencias/archivos, revisiones de calidad ni emisión o validación de certificados.

## 4. Frontend — estructura, rutas e integración

Las rutas agrupadas bajo `src/app/(erp)` no incluyen `(erp)` en la URL. El layout ERP comprueba en el navegador que exista `access_token` en `localStorage` antes de mostrar el contenido.

| Ruta | Página/uso | Conexiones backend |
|---|---|---|
| `/login` | Formulario de ingreso. Guarda token y usuario en `localStorage`; envía la petición directamente con Axios. | `POST /auth/login` |
| `/` | Dashboard con tarjetas de cifras codificadas en el componente y saludo basado en el usuario local. | Ninguna. |
| `/comercial` | Índice del área comercial, enlaces a Clientes y Cotizaciones, reporte marcado “Próximamente”. | Ninguna. |
| `/comercial/clientes` | Lista, formulario de alta e importación de Excel. | `GET /clientes`, `POST /clientes`, `POST /clientes/bulk` |
| `/comercial/cotizaciones` | Listado, acción de aprobación y descarga del PDF generado en el cliente. | `GET /cotizaciones`, `GET /cotizaciones/:id`, `PUT /cotizaciones/:id` |
| `/comercial/cotizaciones/nueva` | Formulario de cliente, tipo de servicio, condiciones e ítems; presenta totales antes de guardar. | `GET /clientes`, `POST /cotizaciones` |
| `/logistica` | Listado de órdenes, selector de cotizaciones aprobadas y formulario de creación; permite avanzar estados. | `GET /logistica/ordenes`, `GET /logistica/cotizaciones-aprobadas`, `POST /logistica/ordenes`, `PUT /logistica/ordenes/:id/estado` |

**Componentes compartidos:** `Header` muestra usuario/rol de `localStorage` y cierra sesión eliminando esos datos; `Sidebar` proporciona la navegación. El menú contiene enlaces a `/planta`, `/calidad` y `/usuarios`, pero esas páginas no existen en el árbol actual. El wrapper Axios de `src/lib/api.ts` usa `http://localhost:3001`; no incorpora el token en una cabecera Authorization. El login también usa una URL local fija en vez del wrapper.

La interfaz de clientes no ofrece edición ni eliminación pese a que la API sí las implementa. La interfaz de cotizaciones ofrece aprobación y descarga, pero no edición ni borrado. No hay pantallas de Planta, Calidad o administración de usuarios.

## 5. Reglas de negocio implementadas

### Consecutivos

El backend genera los consecutivos en los servicios, no mediante una secuencia o trigger de base de datos. Para cotizaciones, el prefijo concreto depende del tipo:

| Tipo de servicio | Prefijo generado |
|---|---|
| `INSUMOS` | `COT-CMI-` |
| `LAVANDERIA` | `COT-LAV-` |
| `FARMACEUTICO` | `COT-CEMFA-` |
| `FABRICANTE` | `COT-CMED-` |
| `INSTITUCIONAL_ETO` y `INSTITUCIONAL_VAPOR` | `COT-CME-` |
| `INDUSTRIAL_ETO` | `COT-{año}-` (por ejemplo, `COT-2026-`) |

Los prefijos por tipo usan tres dígitos (`001`); el formato anual de `INDUSTRIAL_ETO` usa cuatro (`0001`). El servicio busca el registro del prefijo ordenando por ID descendente y suma uno al sufijo. Por tanto, **no existe el prefijo `COT-IND`** en el código actual. La columna `consecutivo` es única, lo que evita persistir duplicados, pero no evita una colisión entre dos solicitudes concurrentes ni implementa el bloqueo/trigger descrito en la documentación.

Las órdenes de servicio usan `OS-{año}-{secuencia de cuatro dígitos}`, con la misma estrategia de buscar el último registro por ID.

### Importación de Excel

La lectura del archivo ocurre en el navegador mediante `xlsx`; solo se admite `.xlsx` o `.xls`, se procesa la primera hoja y se convierte a objetos JSON. Los encabezados se normalizan (minúsculas, sin acentos ni espacios/guiones/guiones bajos) y se reconocen nombres españoles para los seis campos: razón social, NIT, contacto, teléfono, email y dirección. La interfaz rechaza filas con campos vacíos y manda el arreglo JSON a `POST /clientes/bulk`; el backend no recibe ni almacena el archivo original.

El servicio elimina duplicados por NIT dentro del lote, filtra los NIT ya existentes y reintenta si detecta un `ER_DUP_ENTRY` concurrente, contabilizando los omitidos. Hay pruebas unitarias específicas para estos casos en `src/clientes/clientes.service.spec.ts`.

### Totales e IVA

El backend calcula el valor de cada línea como cantidad × precio unitario y redondea a dos decimales. Suma las líneas para el subtotal, aplica IVA fijo del **19 %**, redondea el IVA a dos decimales y suma ambos valores para el total. El frontend muestra un cálculo de previsualización, pero el cálculo persistido lo realiza el backend. La presentación monetaria del frontend usa COP y no muestra decimales.

El PDF generado con jsPDF es un documento comercial de cotización creado localmente en el navegador. No equivale al PDF de un certificado de esterilización.

## 6. Dependencias clave

Versiones indicadas por los manifiestos (`package.json`); los rangos con `^` pueden resolver a una versión compatible más reciente según el lockfile.

| Proyecto | Librería | Uso |
|---|---|---|
| Backend | NestJS (`@nestjs/common`, `core`, `platform-express`, `config`) | Framework y módulos HTTP/configuración. |
| Backend | TypeORM (`@nestjs/typeorm`, `typeorm`) y `mysql2` | ORM, repositorios y conexión MariaDB/MySQL. |
| Backend | `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt` | Emisión/estrategia JWT. |
| Backend | `bcrypt` | Hash y verificación de contraseñas. |
| Backend | `@nestjs/cache-manager`, `cache-manager`, `cache-manager-redis-yet` | Abstracción de caché y adaptador Redis instalado; Redis no está configurado como store activo. |
| Backend | `vitest`, `@vitest/coverage-v8`, `supertest`, `@nestjs/testing` | Pruebas unitarias y de integración HTTP. |
| Backend | `oxlint`, `prettier`, `typescript` | Lint, formato y compilación TypeScript. |
| Frontend | Next.js, React, React DOM | Enrutamiento y renderizado de la aplicación web. |
| Frontend | Tailwind CSS | Estilos utilitarios. |
| Frontend | Axios | Peticiones HTTP. |
| Frontend | `xlsx` | Lectura de archivos Excel en el navegador. |
| Frontend | `jspdf`, `jspdf-autotable` | Generación local del PDF de cotización y tabla de ítems. |
| Frontend | `lucide-react` | Iconos de la interfaz. |
| Frontend | TypeScript, ESLint | Tipado y análisis estático. |

## 7. Deuda técnica y pendientes

1. **Autorización incompleta:** el backend no aplica guardas JWT ni permisos por rol. La comprobación de token en el layout es solo del lado cliente y se puede omitir; además, las llamadas Axios no envían el token. `POST /auth/seed` está expuesto y contiene una contraseña inicial fija. El frontend guarda el JWT en `localStorage`.
2. **Validación de entrada:** no se configura `ValidationPipe` global y los DTO no usan decoradores de validación. Los tipos TypeScript no validan por sí mismos los datos HTTP recibidos.
3. **Secretos y despliegue:** `AuthModule` requiere `JWT_SECRET`, mientras `JwtStrategy` mantiene un secreto de fallback codificado. Se debe centralizar la configuración y eliminar el fallback antes de desplegar.
4. **Persistencia/esquema:** `synchronize: true` está habilitado y no se observan migraciones; no es una estrategia segura para controlar cambios en producción. Las reglas de unicidad y secuenciación regulatoria requieren transacciones/bloqueo o un mecanismo atómico.
5. **Redis:** aunque están instalados el módulo y el adaptador, `CacheModule.register()` usa la configuración por defecto y el propio código marca Redis como pendiente. No hay sesiones Redis implementadas.
6. **Planta y Calidad:** no hay módulos funcionales, endpoints ni páginas para registrar lotes/ciclos, parámetros, tirillas, controles biológicos, revisión, firma, aprobación o rechazo.
7. **Certificados:** existe una entidad parcial, pero no hay API/UI asociada, flujo de aprobación, historial de auditoría, restricción de inmutabilidad ni PDF de certificado con QR. El campo `estado` no basta para aplicar esa política.
8. **Archivos:** no hay carga ni almacenamiento de tirillas, evidencias, firmas o documentos. El Excel se convierte a JSON solo en cliente; el backend no conserva el archivo.
9. **UX y configuración:** el dashboard muestra cifras estáticas; están pendientes reportes y pantallas de Planta/Calidad/Usuarios. Los orígenes y URL de API están codificados para localhost en vez de configurarse por entorno.
10. **Consistencia funcional/documental:** `DATABASE.md` describe campos y reglas que no coinciden con las entidades actuales. El backend admite siete tipos de cotización, pero el selector/tipos del frontend solo presentan cinco. La ruta de `INDUSTRIAL_ETO` usa el formato anual, no `COT-IND`.
11. **Pruebas:** existen pruebas unitarias para el controlador raíz, importación masiva y consecutivos de cotización, y una prueba e2e básica del `GET /`. No se encontraron pruebas para autenticación, CRUD de clientes/cotizaciones, logística, autorización, certificados o interfaz. Este análisis no ejecutó la suite.
12. **Otros:** no se observan paginación, límites explícitos para importaciones, ni políticas explícitas de auditoría/retención. La eliminación de cotizaciones y clientes debe revisarse frente a los requisitos de trazabilidad y operación.

## 8. Recomendaciones y próximos pasos — orden para Planta y Calidad

1. **Asegurar la base del flujo:** acordar estados, roles, transición y responsabilidades desde orden de servicio hasta lote, ciclo, revisión y certificado. Definir invariantes y qué información queda inmutable. Resolver primero autenticación/autorización del API, validación de DTO, configuración por entorno y migraciones.
2. **Completar el modelo de dominio:** definir entidades y relaciones para lotes/cargas, ciclos, equipos, proceso/tipo de esterilización, operador, parámetros medidos, rangos, controles y evidencias. Vincularlas a una orden y conservar quién/cuándo creó o modificó cada dato. No reutilizar el certificado actual como sustituto del registro de producción.
3. **Construir Planta antes que Calidad:** exponer órdenes elegibles; implementar registro manual de parámetros y resultados de proceso, validación de rangos por proceso, carga segura de la tirilla física y envío explícito a revisión. Respetar la regla del negocio de no usar OCR para transcribir tirillas. Añadir pruebas de límites, campos requeridos y transiciones.
4. **Implementar la bandeja de Calidad:** listar ciclos pendientes, mostrar datos y evidencia, permitir aprobación o rechazo con motivo, verificar identidad del aprobador y registrar una auditoría no editable. Impedir que un certificado aprobado se altere; para correcciones, anular y emitir otro, con las reglas aplicadas también en persistencia.
5. **Emitir el certificado como último paso:** generar el consecutivo de forma atómica; emitir PDF con los datos aprobados, firma y QR; implementar verificación pública controlada del QR sin exponer datos sensibles. Mantener el certificado final vinculado a la orden/ciclo y conservar versiones/anulaciones.
6. **Entregar de forma incremental:** habilitar primero APIs y pruebas de dominio, después interfaz de Planta, luego revisión de Calidad y finalmente PDF/QR; probar el flujo completo desde cotización aprobada → orden → planta → calidad → certificado en una base de pruebas antes de producción.

# Hito 1: IVA dinámico

## Puntos de restauración

Ambos repositorios siguen en `feature/rbac-security`, sin push:

- Backend `701d728`: identidad y capacidades de `/auth/me`.
- Frontend `177eba5`: sesión validada y acciones de Cotizaciones por permisos.

La regla aplica a cualquier comercial: los guards y botones de Cotizaciones consumen permisos
y ámbitos, sin condiciones por ID, nombre o correo de JUAN. Asignar `emisor_comercial` aporta
`cotizaciones.emitir` mediante configuración; el backend lo aplica en la siguiente solicitud
y el frontend revalida la sesión al navegar o recuperar foco. No requiere cambiar código.

## Datos y contrato

Migración `AddVersionedIva1794225600000`, registrada después del piloto RBAC:

- Tabla `tasas_fiscales`: impuesto, versión, tasa decimal de seis posiciones, vigencia UTC,
  responsable, motivo y fecha de creación. Índices únicos por versión y por comienzo de vigencia.
- Configuración inicial de IVA del 19% como dato de base de datos; no existe fallback del cálculo
  a una constante. Los triggers rechazan UPDATE y DELETE de versiones.
- Campos `cotizaciones.iva_tasa` e `iva_version_id`, con FK y consistencia de nulabilidad.
  Los mismos datos se fijan al construir el snapshot de nuevas emisiones y previsualizaciones.
- Históricos sin evidencia quedan con ambos campos null. No se recalcularon importes ni se
  reescribieron snapshots. No se atribuye retrospectivamente la tasa inicial a los documentos.

| Endpoint | Permiso y comportamiento |
| --- | --- |
| `GET /cotizaciones/iva-vigente` | `cotizaciones.crear`; tasa vigente según el reloj UTC de la base, sin caché. |
| `GET /tasas-fiscales/iva` | `tasas_fiscales.gestionar` con ámbito GLOBAL; historial de versiones. |
| `POST /tasas-fiscales/iva` | Mismo permiso global; publica una versión inmutable y registra auditoría en la misma transacción. |

El permiso de gestión se concede inicialmente al rol `superadmin`, nunca por ID de usuario ni por
el rol legado Admin. Un permiso concedido solo en un departamento no permite modificar la tasa global.
El catálogo pasa de 42 a 43 capacidades; las semillas históricas permanecen congeladas.

Ejemplo de cuerpo de publicación (fecha futura respecto a la solicitud):

```json
{
  "tasa": "0.050000",
  "vigente_desde": "2027-01-01T00:00:00-05:00",
  "motivo": "Actualización autorizada de configuración fiscal"
}
```

Este ejemplo no se publicó en la base local. Se exige tasa entre 0 y 1 con hasta seis decimales,
zona horaria explícita y motivo. No se permiten vigencias retroactivas ni anteriores a la última
versión publicada. La tasa vigente es la última cuyo comienzo ya ocurrió; no hay reinicio ni
recompilación para activar una versión. Las publicaciones se serializan por bloqueo de la última
versión y las restricciones únicas impiden duplicados.

## Cálculo y frontend

La creación resuelve la versión vigente dentro de su transacción, calcula el IVA en servidor y
guarda tanto importes como metadatos fiscales. Las cotizaciones existentes conservan la tasa
capturada aunque luego se publique otra. La emisión utiliza esos datos guardados, sin consultar
la configuración vigente para recalcular el documento.

El DTO rechaza `iva`, `iva_tasa`, `iva_version_id`, `subtotal` y `total` aportados por el cliente.
El formulario solo envía opcionalmente `iva_version_esperada_id`: funciona como precondición de
la previsualización, nunca como selector de tasa. Si quedó obsoleta, el servidor devuelve 409,
no crea la cotización y el frontend recarga la tasa y solicita revisar el nuevo total.
Sin tasa disponible no se habilita Guardar.

El IVA usa enteros escalados: subtotal en centavos y tasa en millonésimas; el medio centavo se
redondea alejándose de cero. Se evita el error binario por el que `0.145.toFixed(2)` produce
0,14 en vez de 0,15. La previsualización reproduce el mismo algoritmo y redondeo de líneas.

El PDF muestra la tasa persistida. La ausencia del campo en snapshots antiguos conserva la
etiqueta histórica del renderizador; un campo explícitamente null muestra solo “IVA”, sin
inventar una tasa para documentos no conciliados. No se modificaron archivos PDF históricos.

## Aplicación local y conservación

Se restauró y migró el respaldo en MariaDB desechable antes de aplicar el cambio local.

- Respaldo: `storage/backups/sterinova-pre-rbac-2026-11-09T12-11-43-682Z.sql`.
- SHA-256: `b1898904b7a601f53eb26b95f616cd25d7b7e2238dff221bcbdd6db8707afc9f`.
- Solo se aplicó la migración nueva en `sterinova` local. Quedaron 15 migraciones aplicadas,
  sin pendientes. La versión vigente local sigue siendo 19%.
- Comparación antes/después de datos previos de cotizaciones, ítems y certificados: idénticos.
  Huella del conjunto: `09a8346c97357afdb41018788a406a260c6723cdd36c0cca2eddf977ba0d558e`.
  Evidencia: `storage/backups/iva-migration-verification-2026-11-09.json`, fuera de Git.

MariaDB confirma DDL implícitamente y la migración requiere privilegios para crear triggers.
No usar `migration:revert`: se rechaza el borrado de historia fiscal. Ante una incidencia,
preparar una migración correctiva o restauración consistente después de detener escrituras.

## Verificación

- Backend: 163 pruebas unitarias aprobadas y 2 omisiones preexistentes; cubren tasa vigente/ausente, validación de configuración, ámbito global,
  creación autoritativa, DTO contra inyección, versión obsoleta, snapshot y medio centavo.
- MariaDB desechable: 17 pruebas aprobadas, incluida cadena completa, restauración, triggers,
  transición programada 19% → 5%, conservación de cotizaciones anteriores y emisión con su tasa.
- Aplicación completa en otra base desechable: 4 E2E aprobadas. Se ajustó el fixture de throttling
  para aportar la dependencia de RBAC incorporada por `/auth/me` en la entrega anterior.
- Frontend: 45 pruebas unitarias y 7 E2E aprobadas; navegador verifica cambio 5% → 8%,
  payload sin importes fiscales y actualización después de 409, además de los flujos RBAC previos.
- Comprobación HTTP contra AppModule y base local: consulta de IVA 200 para JUAN, anónimo 401,
  publicación fiscal por comercial 403; Crear sigue concedido y Emitir sigue ausente.
- Builds, lint y contrato OpenAPI verificados; dos advertencias de lint previas en PDF y Certificados.

## Límite de esta entrega

El IVA se entrega para revisión sin un nuevo commit. Los commits previos solicitados sí están creados.
No se hizo push ni despliegue. No se implementaron edición de borradores, versionado de sellos ni
el nuevo cuadro de estampado; continúan como hitos posteriores autorizados, a ejecutar por separado.

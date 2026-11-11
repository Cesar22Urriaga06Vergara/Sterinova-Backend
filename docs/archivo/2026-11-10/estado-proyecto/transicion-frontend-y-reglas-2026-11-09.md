> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

# Sesión RBAC, frontend y propuesta de reglas de negocio

## Entrega autorizada

- Commit de seguridad: `cfec803`, rama `feature/rbac-security`, sin push.
- `GET /auth/me` autenticado: identidad pública, `permissions`, `capabilities`
  (`permission`, `scope_ids`, `own_scope_ids`), `current_scope` y `available_scopes`.
  Usa las mismas asignaciones y política que los endpoints protegidos; no concede por rol legado.
- `x-scope-id` opcional selecciona y restringe capacidades. Un único ámbito se selecciona
  automáticamente; con varios, `current_scope` es null hasta seleccionar. Sin concesiones,
  devuelve listas vacías; usuario inactivo/inexistente produce 401. Respuesta no almacenable.
- El proveedor de sesión del ERP obtiene la identidad de `/auth/me` y mantiene capacidades
  en memoria. Revalida al navegar y recuperar foco. El token continúa con su transporte existente.
  Las vistas legadas conservan las restricciones de rol, pero reciben identidad validada.
- Cotizaciones condiciona Crear, Previsualizar, Emitir, Descargar y la acción legada Aprobar
  por sus permisos actuales. Aprobar sigue usando `cotizaciones.editar` porque ese es el permiso
  del PUT existente; separar aceptación/transiciones pertenece al trabajo propuesto abajo.
- Selector de ámbito y header en listado, creación, previsualización y mutaciones. La creación
  exige ámbito operativo; los permisos del navegador no sustituyen los guards del servidor.

Verificación: backend 149 pruebas aprobadas y 2 omisiones existentes, build y contrato OpenAPI
aprobados; lint sin errores y con 2 advertencias previas. Frontend 42 pruebas unitarias y 6 E2E
aprobadas, build y lint aprobados. Comprobación adicional en Chromium con AppModule/JWT y base
local reales: JUAN abre listado y vista previa, accede al formulario de creación y no ve Emitir,
aunque se inyecte un usuario Admin falso en localStorage. POST directo de emisión responde 403;
`/auth/me` sin token responde 401. La creación guardada se verificó en el E2E con API simulada;
la comprobación real no creó nuevas cotizaciones.

## Cambio local de JUAN

La inspección inicial confirmó que JUAN (ID local 2) sí tenía `emisor_comercial`, además de
`comercial`. El usuario autorizó expresamente desactivar solo esa asignación para probar la UI.
Se creó respaldo consistente y se desactivó transaccionalmente, conservando el registro y
añadiendo auditoría con valor anterior/nuevo y motivo. El rol comercial permanece activo.

Respaldo: `storage/backups/sterinova-pre-rbac-2026-11-09T11-56-33-718Z.sql`.
SHA-256: `a5c601bcf22cbe8efcc9f89d3e22b4a08b0aa4f6318f8f9a480d0e5143b51ee4`.
Solo se modificó la base local; no se cambió la semilla general ni se hardcodeó a JUAN en la aplicación.
No repetir la conciliación antigua para esta prueba: su plan local aún representa la asignación previa.

## Propuesta A: editar únicamente borradores

**Hallazgos:** existe formulario de creación y listado, pero no formulario/ruta de edición.
`UpdateCotizacionDto` admite cliente, tipo, condiciones y estado, pero no ítems. El update usa
transacción y bloqueo, aunque solo comprueba `fecha_emision` y permite cambiar `estado` incluso
después de emitir. No recalcula importes. La entidad usa por defecto `Borrador`, mientras la regla
solicitada exige `BORRADOR`; los estados son cadenas abiertas.

**Plan:** normalizar estados y definir transiciones explícitas sin borrar evidencia de emisión;
separar la aceptación del cliente de la edición de contenido. Autorizar edición de contenido solo
en BORRADOR y sin `fecha_emision`, PDF o snapshot de emisión. Reutilizar el formulario para cliente,
tipo, condiciones e ítems completos. Validar cantidades/precios en servidor, sustituir ítems y
recalcular subtotal/IVA/total en una misma transacción con bloqueo. Mantener consecutivo, creador
y ámbito inalterables; resolver explícitamente el cambio de tipo si implica otro prefijo, sin
renumerar silenciosamente. Añadir control de concurrencia para evitar sobrescrituras entre asesores.
Mostrar Editar solo con permiso y borrador; bloquear también acceso directo y PUT manipulado.

**Aceptación:** editar cliente/ítems/precios recalcula correctamente; emitida permanece idéntica,
incluidos snapshot, archivo y hash; IDOR, estados inventados y carreras editar/emitir se rechazan.

## Propuesta B: IVA configurable y congelado por documento

**Hallazgos:** backend `cotizaciones.service.ts` usa `IVA_RATE = 0.19`; formulario nuevo calcula
`subtotal * 0.19`. Hay importes persistidos, pero no una tasa explícita por cotización. También
deben revisarse las etiquetas fijas del PDF al sustituir la tasa.

**Arquitectura recomendada:** tabla de tasas fiscales versionadas en base de datos, con valor
decimal, vigencia, responsable y auditoría; más `iva_tasa` y referencia a su versión en cotización
y snapshot. La configuración proporciona el valor predeterminado al crear; cada borrador conserva
la tasa seleccionada. Una emisión no cambia de tasa por una modificación posterior de configuración.
Una actualización de tasa en borradores anteriores debe ser explícita y recalcular con confirmación.
No permitir que el cliente envíe una tasa arbitraria. Una variable de entorno puede servir para
bootstrap, pero no como fuente operativa: requiere reinicios y no conserva historia documental.

**Plan:** migración aditiva, conciliación de históricos sin recalcular importes, API protegida para
configuración/consulta de tasa, cálculo monetario autoritativo del servidor y actualización de preview
y etiquetas PDF. No asumir que todo histórico corresponde al 19% sin comprobarlo.

**Aceptación:** cambiar tasa sin recompilar ni reiniciar; nuevos borradores usan la nueva, anteriores
conservan la suya y documentos emitidos mantienen bytes/importes; probar vigencias y redondeo.

## Propuesta C: versiones de sellos ICONTEC

**Hallazgos:** `SelloCertificacion` contiene norma, licencia, `imagen_key`, activo, orden y fechas.
El servicio modifica el mismo registro; una imagen nueva usa UUID y conserva el archivo anterior,
pero falta entidad de versión, vigencia y vínculo documental. Los componentes PDF usan la imagen
estática `/certificaciones-icontec-iqnet.jpeg`; el catálogo administrable no está incorporado en los
snapshots actuales de cotizaciones/certificados. El texto de la tabla de sellos promete una integración
que el renderizador actual no materializa.

**Plan:** separar sello lógico y versiones inmutables (norma/licencia, archivo único, SHA-256,
vigencias, estado borrador/publicada/retirada). Publicar una versión nueva de forma transaccional,
sin sobrescribir ni borrar las usadas. En emisión resolver la versión vigente y fijar ID, hash y
referencia de archivo inmutable en el snapshot. La regeneración debe resolver esa misma versión y
la misma versión de renderizador, nunca consultar los sellos actualmente activos.
Migrar los sellos existentes como versiones iniciales; conservar PDFs históricos y conciliar sus
referencias solo con evidencia. No atribuir retroactivamente una versión desconocida.

**Aceptación:** un documento previo conserva su sello al publicar otro; uno posterior usa el nuevo;
regenerar no cambia sello; no se admite modificación/eliminación de versiones utilizadas ni vigencias
superpuestas. Probar también emisión concurrente con publicación.

## Propuesta D: cuadro para estampado físico completamente blanco

**Hallazgos:** `frontend/src/components/pdf/CertificadoPDF.tsx` imprime dos elementos distintos:
ICONTEC/IQNET en cabecera y `/sello-calidad.png` en el cuadro inferior derecho. Este cuadro también
contiene el QR y el texto “SELLO / QR DE VALIDACIÓN”. Quitar únicamente el PNG no dejaría el cuadro blanco.
El backend genera el PDF mediante Playwright sobre `/internal/pdf/certificado`, que usa ese componente.

**Plan:** conservar borde y dimensiones del cuadro de estampado y dejar su interior vacío: sin imagen,
QR, texto ni marcador. Trasladar QR/leyenda de validación fuera del cuadro para mantener validación
electrónica. El sello de cabecera es un elemento separado y se trata mediante el versionado del punto C.
Publicar una versión nueva de formato/renderizador para nuevas emisiones, manteniendo el renderizador
anterior y los PDFs emitidos. Cambiar solo el componente compartido alteraría reconstrucciones históricas.

**Aceptación:** inspección del PDF real confirma interior blanco y espacio físico conservado; QR fuera
del cuadro sigue validando; certificados históricos no se reemiten ni cambian de hash.

## Orden propuesto y alcance

1. Acordar estados/transiciones y política de tasas para borradores anteriores.
2. Implementar B (fuente fiscal y snapshot), después A (edición completa con cálculo común).
3. Implementar C y el versionado de renderizador necesario para reconstrucciones históricas.
4. Publicar D como nueva versión del certificado y validar el PDF impreso.

Los cuatro puntos son análisis y propuesta: no se implementaron en esta entrega.

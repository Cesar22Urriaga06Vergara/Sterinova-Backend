> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

# Hito 4: formularios y PDFs listos para prueba real

Implementación final sobre `feature/rbac-security`, en backend y frontend. Sin push.
La dependencia previa de edición de borradores se registró por separado:
backend `2eaf2f9`, frontend `9a46aea`. Los commits siguientes corresponden al Hito 4.

## Inicialización local de ICONTEC

Ejecutado y verificado dos veces:

```powershell
cd C:\Users\urria\backend_sterinova
npm run seed:icontec
```

El inicializador usa el JPEG existente en `frontend_sterinova/public`, crea el catálogo
solo si falta y conserva la configuración existente al repetirlo. Verifica la imagen
congelada dentro de su transacción y no reactiva automáticamente un sello desactivado.

- Sello local: ID 1, versión ID 1.
- SHA-256: `5532847fb90b46e89281fe39596d71ee85bc9edd2687906abc4e67aa2c4dab0a`.
- Licencias transcritas de la imagen: `SC-CER814321 / DM-CER814323`.
- Fuente: arte legado ICONTEC ISO 9001 / ISO 13485 e IQNET. La inicialización no afirma
  una verificación externa de vigencia de las certificaciones.
- Las claves de almacenamiento y los archivos de versiones no se modifican al repetir el comando.

## Formularios

- Logística permite capturar y editar material recibido por producto/lote/empaque,
  con cantidades enteras y muestras cero o N/A. Respeta versión de la orden, conflictos
  y bloqueo tras registrar un ciclo. No consulta endpoints comerciales restringidos
  para acceder a datos que el rol Logística no tiene concedidos.
- Planta captura fecha civil de esterilización y protocolo, admite presión negativa
  EtO y usa un campo independiente de secado para Vapor. El método se toma de la orden;
  no se inventan ceros para campos no aplicables.
- Calidad usa las alternativas de la versión de protocolo del ciclo, requiere decisiones
  explícitas por fila y no preselecciona CUMPLE. NO_CUMPLE bloquea la emisión.
  Al rechazar, las evaluaciones seleccionadas se guardan con autor/fecha; la alternativa
  elegida queda también en auditoría. Al cambiar de ciclo se limpian las decisiones anteriores.

## Renderizadores

Los componentes nuevos declaran `data-pdf-schema-version="2"`.

Cotización:

- ICONTEC se obtiene de `sellos.icontec.imagen_src`, atendido por el recurso congelado
  e íntegro de la página de renderizado; no usa el JPEG estático en la nueva emisión.
- El total y la nota comercial usan la misma etiqueta de IVA persistido. Se verificó
  una cotización con IVA del 5%, sin menciones residuales al 19%.

Certificado:

- Encabezado con logo Sterinova y título; sin ICONTEC, código o texto de versión.
- Diez filas técnicas: cinco EtO y cinco Vapor. El método inactivo queda N/A;
  las especificaciones, resultados y criterios del activo vienen del snapshot.
- `NO_CUMPLE` se presenta como «NO CUMPLE» si figura en datos congelados; la emisión
  de un ciclo no conforme continúa bloqueada en backend.
- Materiales operativos, fechas civiles y vencimiento persistidos, sin recalcular desde emisión.
- Elaborado/Aprobado usan nombre, apellido y cargo congelados. Elaborado corresponde al
  operador autenticado del ciclo; Aprobado al usuario autenticado de Calidad. No se usan
  nombres ni cargos de ejemplo. Verificado queda vacío cuando no existe en el snapshot.
- Cuadro inferior derecho con borde e interior vacío: sin imagen, texto ni QR.
- Se retiró el aviso de QR de la vista de descarga.

Backend fija `react-playwright-v2` para las nuevas emisiones. Los snapshots anteriores
mantienen `react-playwright-v1` y sus componentes Legacy separados; no se obliga a
regenerar PDFs históricos solo por introducir el formato nuevo.

## Validación

- Backend: 197 pruebas aprobadas y 2 omisiones preexistentes; build y contrato OpenAPI aprobados.
- Integración MariaDB desechable: 20 pruebas HTTP/RBAC, incluida emisión real con React/Chromium
  de cotización, certificado EtO y certificado Vapor, todas con HTTP 201. El sello ausente 409
  ya no afecta a las emisiones configuradas. La base local no recibió documentos ficticios.
- Suite Hito 4: 12 pruebas aprobadas de esquema, consecutivos, restauración del respaldo
  local y generación Chromium con entrega de imagen congelada.
- Frontend: 49 pruebas aprobadas; 13 casos E2E de navegador aprobados, incluidas capturas
  de materiales, secado de Vapor y decisión/rechazo NO_CUMPLE. Build de producción aprobado.
- Lint frontend sin advertencias; backend conserva una advertencia preexistente del catch PDF.
- `git diff --check` aprobado en ambos repositorios.
- Revisión visual de los PDF generados: una página cada uno; cotización con ICONTEC e IVA 5%;
  certificados con las tablas completas y cuadro de estampado vacío.
- Caso bisiesto verificado en API, snapshot, columna DATE y PDF:
  esterilización 29/02/2024 → vencimiento 28/02/2027.

Artefactos de prueba locales, fuera de Git:

- `storage/backups/hito4-pdfs-smoke/cotizacion.pdf`.
- `storage/backups/hito4-pdfs-smoke/certificado-eto.pdf`.
- `storage/backups/hito4-pdfs-smoke/certificado-vapor.pdf`.

Los datos de esos archivos pertenecen a fixtures del entorno desechable. No son documentos
oficiales de clientes ni consumen consecutivos de `sterinova` local.

## Prueba manual

1. Iniciar sesión con los permisos correspondientes.
2. Crear una cotización, revisar su IVA y emitirla; comprobar ICONTEC en el PDF descargado.
3. Aprobar una cotización y generar su orden con material recibido.
4. Llevar la orden a Planta, registrar fecha y parámetros del método, incluido secado si es Vapor.
5. En Calidad, seleccionar especificaciones y evaluar cada parámetro. Aprobar con contraseña
   solo cuando corresponda; descargar y revisar el certificado.

La conciliación de ciclos históricos incompletos no se sustituye por fechas o materiales
inventados. Las nuevas capturas tienen el flujo completo disponible.

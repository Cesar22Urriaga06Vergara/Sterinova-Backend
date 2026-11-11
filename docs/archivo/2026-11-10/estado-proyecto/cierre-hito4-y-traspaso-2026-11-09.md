> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

# Cierre de Hito 4 y traspaso a la siguiente fase

Fecha: 9 de noviembre de 2026. Repositorios: `backend_sterinova` y `frontend_sterinova`.

## Ajuste final del certificado

`CertificadoPDF.tsx` recorre directamente los materiales del snapshot con `.map()`.
La tabla muestra exactamente una fila por material, sin completar un mínimo fijo de
20 filas. Un array vacío, nulo o ausente produce una única fila con ocho celdas N/A.
Los valores cero se conservan. Las plantillas Legacy y los PDFs históricos no se modifican.

El E2E HTTP del backend se actualizó al contrato operativo de Hito 4: cotización
institucional Vapor, cinco materiales, fecha de esterilización, secado y evaluaciones
explícitas de Calidad. Verifica los cinco lotes persistidos en el snapshot y limpia
las relaciones de prueba respetando sus claves foráneas.

## Validación de cierre

- Frontend: 55 pruebas unitarias y 15 E2E de Chromium aprobados; lint y build aprobados.
- Regresión del certificado: 1, 5 y 25 materiales; arrays vacíos, nulos y ausentes;
  datos independientes en las ocho columnas, incluidos cero y N/A.
- PDFs reales desde `/internal/pdf/certificado`: EtO y Vapor con cinco materiales.
  Extracción de texto: cinco productos, referencias, lotes y empaques presentes,
  una página por documento. Revisión visual del certificado EtO y cuadro de estampado vacío.
- Backend: 197 pruebas unitarias aprobadas, con dos omisiones preexistentes;
  build y lint aprobados. Lint conserva la advertencia previa del parámetro `error`
  sin usar en el catch de `PdfGeneratorService`.
- MariaDB desechable mediante `scripts/test-rbac-schema.ps1 -RunApplicationE2E`:
  25 pruebas de integración RBAC aprobadas, dos casos opcionales omitidos;
  cuatro E2E de aplicación aprobados, incluido el flujo operativo completo.
- Prueba de integración Chromium del generador PDF y contrato OpenAPI aprobados.
- La base local de trabajo no se utilizó para insertar fixtures ni ejecutar los E2E.

Los PDFs de regresión quedan en `frontend_sterinova/test-results/` (ignorado por Git);
`npm run test:e2e -- e2e/certificate-materials.spec.ts` permite regenerarlos.

## Arranque en la siguiente sesión

Mantener MariaDB local activa y conservar los `.env` existentes. Backend y frontend
deben compartir el mismo `PDF_RENDER_SECRET` privado de al menos 32 caracteres.
`PDF_RENDER_BASE_URL` del backend debe apuntar a `http://localhost:3000`.

En una terminal PowerShell, iniciar el frontend:

```powershell
Set-Location C:\Users\urria\frontend_sterinova
git switch main
npm ci
npm run dev
```

En otra terminal PowerShell, iniciar el backend:

```powershell
Set-Location C:\Users\urria\backend_sterinova
git switch main
npm ci
npm run start:dev
```

`start:dev` compila y aplica las migraciones pendientes antes de arrancar NestJS.
No es necesario ejecutar otra migración manual para un arranque habitual.
Frontend: `http://localhost:3000`. Backend: `http://localhost:3001`.

## Siguiente análisis de formatos diligenciados

Desde otra terminal, consultar este traspaso e inventariar los ejemplos:

```powershell
Set-Location C:\Users\urria\backend_sterinova
Get-Content docs\estado-proyecto\cierre-hito4-y-traspaso-2026-11-09.md
Get-ChildItem docs\ejemplos-formatos -Filter '*.pdf'
```

Se incorporan los cinco PDFs de cotizaciones diligenciadas que estaban sin versionar:

- `COT- CMED139 Ejemplo de Cotizacion Diligenciado.pdf`
- `COT-CEMFA192-1 Ejemplo de Cotizacion Diligenciado.pdf`
- `COT-CME1095 Ejemplo de Cotizacion Diligenciado.pdf`
- `COT-CMI522 Ejemplo de Cotizacion Diligenciado.pdf`
- `COT-LAV15-1 Ejemplo de Cotizacion Diligenciado.pdf`

El alcance de la próxima fase comprende Industrial, Institucional EtO, Institucional
Vapor y Lavandería Farmacéutica, comparando los documentos diligenciados con sus
formatos de referencia. Insumos (R-CM-07-4) queda explícitamente excluido del análisis
por ahora. Este cierre no implementa cambios derivados de esos nuevos ejemplos.

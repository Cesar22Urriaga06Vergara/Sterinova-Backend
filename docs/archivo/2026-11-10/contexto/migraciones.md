> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

# Migraciones y seeds – Sterinova-Backend

- Fecha: 2026-11-10
- Fuente: `src/database/migrations/**`, `scripts/**`, `package.json`.
- Estado: ✅ consolidado por inspección estática.

## 1) Serie histórica observada

| Timestampt      | Nombre                                  | Propósito resumido                                                                                   | Reversible                    |
| --------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------- |
| `1730750400000` | `InitialSchema`                         | Crea el baseline operativo inicial: usuarios, clientes, cotizaciones, órdenes, ciclos, certificados. | No                            |
| `1730750401000` | `AddQualityCertificates`                | Ajusta estados y certificación de calidad para ciclos.                                               | No se observa `down` seguro   |
| `1730750402000` | `AddCertificateValidationToken`         | Añade token público/validación para certificados.                                                    | No se observa `down` seguro   |
| `1793750400000` | `AddDocumentFormatVersioning`           | Versionado de formatos documentales y plantillas de documento.                                       | No se observa `down` seguro   |
| `1793754000000` | `ResetCertificateSequenceToThreeDigits` | Ajusta secuencia de consecutivos para certificados.                                                  | No se observa `down` seguro   |
| `1793757600000` | `ExtendDocumentSequences`               | Extiende la numeración de documentos/formatos.                                                       | No se observa `down` seguro   |
| `1793813200000` | `AddClienteDocumentFields`              | Añade metadatos documentales a clientes.                                                             | No se observa `down` seguro   |
| `1793813300000` | `CreateAuditoria`                       | Crea tabla de auditoría de acciones.                                                                 | No                            |
| `1793813400000` | `AddTemplateResponsible`                | Añade responsable a plantillas/formatos.                                                             | No se observa `down` seguro   |
| `1793813500000` | `AddPdfRendererVersion`                 | Guarda versión del renderer del PDF y su metainformación.                                            | No se observa `down` seguro   |
| `1793813600000` | `AddUsersAndCertificationSeals`         | Integra usuarios y sellos de certificación.                                                          | No se observa `down` seguro   |
| `1793813700000` | `ExtendAuditoriaEvents`                 | Extiende eventos de auditoría.                                                                       | No se observa `down` seguro   |
| `1794096000000` | `AddScopedRbac`                         | Instala RBAC con scopes, roles, permisos y asignaciones.                                             | No para el baseline histórico |
| `1794096001000` | `ScopeQuotePilot`                       | Piloto de ámbito/creador en cotizaciones.                                                            | No se observa `down` seguro   |
| `1794225600000` | `AddVersionedIva`                       | Añade tasas fiscales versionadas y conciliación de IVA.                                              | No se observa `down` seguro   |
| `1794225601000` | `AddQuoteEditVersion`                   | Controla versiones y edición de cotizaciones.                                                        | No se observa `down` seguro   |
| `1794225602000` | `AddOperationalDocumentData`            | Añade datos operativos, protocolos y metadatos de documentos.                                        | No se observa `down` seguro   |

## 2) Patrón observable

- Hay un baseline inicial con `transaction = false` y validación defensiva en `InitialSchema`.
- Las migraciones posteriores son aditivas y suelen ajustar tipos, columnas y restricciones, no se detectan operaciones masivas no controladas.
- El RBAC nuevo tiene una historia explícita con un snapshot frozen en `AddScopedRbac` y un piloto asociado `ScopeQuotePilot`.

## 3) Seeds y carga de datos

`package.json` define los scripts:

- `seed:icontec` -> `node dist/scripts/seed-icontec.js`
- `seed:templates` -> `node dist/scripts/seed-document-templates.js`
- `bootstrap:admin` -> `node dist/scripts/bootstrap-admin.js`

Los efectos esperados, según nombre y estructura del proyecto:

- `seed:icontec`: crea o carga sellos de certificación o referencias de Icontec.
- `seed:templates`: inicializa plantillas/motores documentales para formatos.
- `bootstrap:admin`: crea el usuario/superadmin base y/o la estructura inicial de permisos.

## 4) Observación importante

No se observan migraciones adicionales fuera de `src/database/migrations`. Si en un entorno real falta alguna tabla, la forma segura es revisar el historial con `migration:show` y no inventar cambios no visibles en el código.

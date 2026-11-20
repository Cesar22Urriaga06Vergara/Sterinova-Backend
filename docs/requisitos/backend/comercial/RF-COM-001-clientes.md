---
id: RF-COM-001
titulo: Registrar y consultar clientes
tipo: RF
modulo: Comercial
estado: cubierto
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §5"
fuente_contraste: "docs/arquitectura/api-y-contratos.md; docs/base-de-datos/esquema-y-migraciones.md; src/clientes/"
depende_de: []
bloquea: [RF-LOG-001]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Cubierto; importación y ciclo de vida se separan en requisitos derivados."
---

# RF-COM-001 — Registrar y consultar clientes

**Fuente principal:** `Sterinova-ERP.md` §3, «Módulos principales — Comercial»; §5, «Trazabilidad».

**Fuente de contraste:** documentación activa del backend y archivos del módulo de clientes citados abajo.

1. **ID:** `RF-COM-001`
2. **Título:** Registrar y consultar clientes.
3. **Tipo:** RF.
4. **Módulo:** Comercial.
5. **Descripción funcional:** El sistema debe permitir registrar clientes y consultar clientes existentes, incluida su consulta en el proceso comercial.
6. **Reglas de negocio asociadas:** El anexo §3 indica gestión y consulta de clientes; §5 requiere identificar qué cliente solicitó el servicio. El anexo no especifica campos obligatorios, reglas de identificación, duplicados, activación ni visibilidad.
7. **Actores / roles / ámbitos:** Los endpoints requieren `clientes.crear` o `clientes.ver`. El controlador aplica permisos con ámbito; el acceso efectivo depende de las concesiones y ámbitos del usuario. No se deducen perfiles concretos.
8. **Datos y entidades implicadas:** Entidad `Cliente`, tabla `clientes`: `id`, `razon_social`, `nit`, `contacto`, `telefono`, `email`, `direccion`, `cargo`, `ciudad`, `created_at`, `scope_id` y `creador_id`. `nit` es único. `scope_id` referencia `rbac_scopes(id)` y `creador_id` referencia `usuarios(id)`, ambos con `ON DELETE RESTRICT` e índices declarados en migración. No existe campo activo/inactivo ni tipo de identificación en la entidad.
9. **Precondiciones / postcondiciones:** Registro: usuario autenticado y autorizado con `clientes.crear`, datos válidos según `CreateClienteDto`; al guardar, se asocian ámbito y creador del contexto RBAC. Consulta: usuario autorizado con `clientes.ver`; se limita a ámbitos autorizados. Consulta individual inexistente o fuera del ámbito produce no encontrado. La base desplegada no se verificó.
10. **Criterios de aceptación:**
    - Dado un usuario autorizado y datos válidos, cuando envía `POST /clientes`, entonces el sistema crea y devuelve el cliente.
    - Dado un usuario autorizado, cuando consulta `GET /clientes` o `GET /clientes/:id`, entonces recibe los clientes visibles en su ámbito.
    - Dado un usuario sin el permiso requerido, cuando intenta registrar o consultar, entonces el backend deniega la operación. Este criterio adicional corresponde formalmente a `RNF-SEG-001`. No se ejecutaron pruebas.
11. **Evidencia en el backend:** `src/clientes/clientes.controller.ts` declara alta, listado, detalle, actualización, importación masiva y eliminación; `src/clientes/clientes.service.ts` implementa alta y consultas filtradas por `resourceWhere`; `src/clientes/dto/create-cliente.dto.ts` y `src/clientes/dto/update-cliente.dto.ts` definen las validaciones; no hay DTO bulk separado, el endpoint acepta arreglo de `CreateClienteDto` mediante `ParseArrayPipe`; `src/clientes/entities/cliente.entity.ts` define la entidad; `src/clientes/clientes.module.ts` registra `TypeOrmModule.forFeature([Cliente])`; `docs/arquitectura/api-y-contratos.md` documenta las rutas y autorización.
12. **Evidencia en BD:** `src/database/migrations/1730750400000-InitialSchema.ts` crea `clientes`, PK `id` y `UQ_clientes_nit`; `1793813200000-AddClienteDocumentFields.ts` agrega `cargo` y `ciudad`; `1794312000000-AddBackendRoleSchema.ts` agrega `scope_id`, `creador_id`, índices y FKs a `rbac_scopes(id)` y `usuarios(id)`, con `ON DELETE RESTRICT`; `docs/base-de-datos/esquema-y-migraciones.md` resume NIT único y restricciones. Aplicación en una instancia concreta: no verificable sin ejecución.
13. **Brechas detectadas:** Ninguna asignada a este requisito. El ciclo de vida se deriva a `RA-COM-001` y la importación masiva a `RF-COM-009`; ver `docs/requisitos/brechas/registro-brechas.md`.
14. **Preguntas abiertas:** Ninguna para cerrar esta ficha. El ciclo de vida queda en `RA-COM-001`; las reglas de importación se evaluarán en su ficha propia.
15. **Estado de cobertura:** Cubierto. Endpoints, DTO, servicio, entidad, autorización/ámbitos y migraciones versionadas cubren registro y consulta.
16. **Nivel de certeza:** Confirmado en código y migraciones versionadas; estado de una base desplegada no verificable sin ejecución.

**Trazabilidad:** cliente → cotización → orden → recepción → ciclo → calidad → certificado → entrega → auditoría. Esta ficha verifica registro y consulta del cliente; los enlaces posteriores se evalúan en sus requisitos respectivos.

---
id: RF-COM-006
titulo: Enviar y registrar aceptación del cliente
tipo: RF
modulo: Comercial / Cotizaciones
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §6"
fuente_contraste: "src/cotizaciones/; src/database/migrations/; docs/negocio/reglas-maestras.md, Módulo 3; docs/arquitectura/roles-y-permisos.md"
depende_de: [RF-COM-005]
bloquea: [RF-COM-007]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial; lógica de envío/aceptación y bloqueo de emisión derivada a RF-COM-013; decisión sobre evidencia a RA-COM-006."
---

# RF-COM-006 — Enviar y registrar aceptación del cliente

**Fuente principal:** `Sterinova-ERP.md` §3, «Módulos principales — Comercial»; §6, «Reglas operativas principales».

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 3, respuestas 32–35; `docs/arquitectura/roles-y-permisos.md`; código y migraciones en `src/cotizaciones/` y `src/database/migrations/`.

1. **ID:** `RF-COM-006`.
2. **Título:** Enviar y registrar aceptación del cliente.
3. **Tipo:** RF.
4. **Módulo:** Comercial / Cotizaciones.
5. **Descripción funcional:** El sistema debe permitir registrar el envío al cliente de una cotización aprobada y registrar posteriormente la aceptación del cliente, vinculando los eventos con la versión correspondiente y conservando la trazabilidad de quien los registra.
6. **Reglas de negocio asociadas:** El anexo §3 incluye la emisión de propuestas al cliente; §6 ordena el flujo como aprobación interna → envío al cliente → aceptación → emisión operativa. La documentación activa distingue el envío de la emisión operativa. Como el cliente no inicia sesión, un usuario del ERP registra su respuesta. El tipo de evidencia —por ejemplo, orden de compra, firma o registro manual— no está definido como obligatorio. La documentación propone conservar fecha, responsable, medio, versión y alternativa aceptada.
7. **Actores / roles / ámbitos:** El asesor comercial registra el envío y la respuesta del cliente sujeto a sus permisos y ámbito. El cliente no inicia sesión en el ERP. El catálogo RBAC contiene `cotizaciones.enviar` y `cotizaciones.aceptar`, pero no se encontraron rutas que apliquen estos permisos al flujo.
8. **Datos y entidades implicadas:** `Cotizacion` / `cotizaciones`: `estado`, `version`, `aprobador_interno_id`, `aprobado_internamente_at`, `aceptacion_registrada_por_id` y `aceptacion_registrada_at`. El enum declara `ENVIADA` y `ACEPTADA_CLIENTE`. No se encontró en la cotización un campo para evidencia, medio, referencia documental o alternativa aceptada. `orden_compra_cliente` existe en `OrdenServicio` como dato de orden de servicio.
9. **Precondiciones / postcondiciones:** El envío debería requerir aprobación interna y vincular el evento con la versión enviada. El registro de aceptación debería requerir una cotización enviada y guardar al usuario ERP responsable y la fecha. El backend inspeccionado no implementa esas operaciones. La decisión sobre tipo de evidencia queda en `RA-COM-006`.
10. **Criterios de aceptación:**
    - Dada una cotización aprobada, cuando un usuario autorizado registra su envío, entonces queda en `ENVIADA` y se conserva la versión correspondiente.
    - Dada una cotización enviada, cuando un usuario autorizado registra la aceptación, entonces queda en `ACEPTADA_CLIENTE`.
    - Al registrar la aceptación, se persisten el usuario ERP responsable y la fecha.
    - Al registrar la aceptación, se conserva la evidencia o referencia que se acuerde en `RA-COM-006`.
    - Dada una cotización aprobada pero no aceptada, cuando se intenta emitirla, entonces el sistema impide avanzar al ciclo operativo hasta registrar la aceptación.
11. **Evidencia en el backend:** `src/cotizaciones/cotizaciones.controller.ts` expone rutas de creación, consulta, aprobación y emisión; no se encontraron endpoints de envío ni de aceptación. `UpdateCotizacionDto` no permite cambiar `estado`. `src/cotizaciones/cotizaciones.service.ts` no contiene operaciones que asignen `ENVIADA`, `ACEPTADA_CLIENTE`, `aceptacion_registrada_por_id` o `aceptacion_registrada_at`. `emitir` comprueba aprobación interna, pero no exige `ACEPTADA_CLIENTE`. `docs/arquitectura/roles-y-permisos.md` propone las rutas `/cotizaciones/:id/enviar` y `/cotizaciones/:id/aceptacion`; es documentación de diseño, no evidencia de implementación.
12. **Evidencia en BD:** `Cotizacion` declara `aceptacion_registrada_por_id` y `aceptacion_registrada_at`; `1794312000000-AddBackendRoleSchema.ts` agrega ambas columnas y la FK del usuario responsable. No se encontró campo de evidencia en `cotizaciones`. `orden_compra_cliente` se agrega a `ordenes_servicio` en `1795400000000-OrdenCompraCliente.ts`, por lo que no constituye por sí mismo evidencia de aceptación de la cotización. No se verificó una base desplegada.
13. **Brechas detectadas:** Ninguna asignada a esta ficha porque los faltantes se derivaron. `B-006-01` (envío y transición a `ENVIADA`), `B-006-02` (registro de aceptación y transición a `ACEPTADA_CLIENTE`) y `B-006-04` (bloqueo de emisión sin aceptación) se derivan a `RF-COM-013`. `B-006-03` (tipo de evidencia de aceptación) se deriva a `RA-COM-006`.
14. **Preguntas abiertas:** ¿Qué evidencias acepta el negocio y cuáles son obligatorias: número de orden de compra, archivo firmado, correo u otra referencia? ¿Se deben registrar también el medio y la alternativa aceptada? Se plantean en `RA-COM-006`. La implementación del flujo y su compuerta de emisión se especificará en `RF-COM-013`.
15. **Estado de cobertura:** Parcial, con faltantes funcionales principales. El enum y el esquema contemplan estados de envío/aceptación y metadatos de responsable/fecha para aceptación, pero no se encontró lógica que los persista. No se conserva evidencia de aceptación y la emisión no está condicionada a ella.
16. **Nivel de certeza:** Confirmado en el controlador y servicio inspeccionados que no existen rutas/métodos de envío o aceptación, que los metadatos de aceptación no se escriben en el módulo y que emitir no exige `ACEPTADA_CLIENTE`. Confirmado en entidad y migración que existen columnas de usuario y fecha, pero no se encontró un campo de evidencia. La evidencia aceptable permanece pendiente de decisión de negocio.

**Trazabilidad:** aprobación interna → envío de una versión identificable → respuesta del cliente → registro por un usuario ERP con fecha y evidencia acordada → emisión operativa. El flujo y el bloqueo por falta de aceptación quedan en `RF-COM-013`.

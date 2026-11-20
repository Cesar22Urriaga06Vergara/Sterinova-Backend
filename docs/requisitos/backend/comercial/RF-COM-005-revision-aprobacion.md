---
id: RF-COM-005
titulo: Revisar y aprobar cotizaciones
tipo: RF
modulo: Comercial / Cotizaciones
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §4, §6"
fuente_contraste: "src/cotizaciones/; src/rbac/; src/auth/; docs/negocio/reglas-maestras.md, Módulo 3"
depende_de: [RF-COM-003, RF-COM-004]
bloquea: [RF-COM-006]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial; transición a revisión deriva a RF-COM-012. La confirmación por contraseña se originó en RF-SEG-001 y se consolidó en RNF-SEG-002. B-005-01 descartada."
---

# RF-COM-005 — Revisar y aprobar cotizaciones

**Fuente principal:** `Sterinova-ERP.md` §3, «Módulos principales — Comercial»; §4, «Seguridad»; §6, «Reglas operativas principales».

**Fuente de contraste:** documentación activa `docs/negocio/reglas-maestras.md`, Módulo 3, respuestas 32–35; código del backend en `src/cotizaciones/`, `src/rbac/` y `src/auth/`.

1. **ID:** `RF-COM-005`.
2. **Título:** Revisar y aprobar cotizaciones.
3. **Tipo:** RF.
4. **Módulo:** Comercial / Cotizaciones.
5. **Descripción funcional:** El sistema debe permitir enviar una cotización a revisión y registrar una aprobación interna antes de enviarla al cliente. Revisión, aprobación y emisión son actuaciones diferenciadas, trazables y autorizadas.
6. **Reglas de negocio asociadas:** El anexo §3 contempla la revisión y aprobación; §6 describe la secuencia Borrador → Revisión → Aprobación interna → Envío al cliente → Aceptación → Emisión operativa. El anexo §4 establece confirmación por contraseña para aprobaciones críticas. La documentación activa precisa que quien crea la cotización no la aprueba y que aprueba el gerente comercial o administrador autorizado, distinto del creador. El backend registra la aprobación como `APROBADA`; la emisión es una operación posterior.
7. **Actores / roles / ámbitos:** El creador prepara el borrador. Aprobar requiere `cotizaciones.aprobar_interna` y acceso al ámbito de la cotización. La regla documental asigna la aprobación al gerente comercial o administrador autorizado, distinto del creador.
8. **Datos y entidades implicadas:** `Cotizacion` / `cotizaciones`: `estado`, `creador_id`, `aprobador_interno_id`, `aprobado_internamente_at` y `version`. El aprobador referencia a `usuarios`. `EstadoCotizacion` declara `BORRADOR`, `EN_REVISION` y `APROBADA`, además de estados posteriores.
9. **Precondiciones / postcondiciones:** Aprobar requiere cotización accesible, estado `BORRADOR`, versión vigente, creador asociado y condiciones comerciales obligatorias completas. El aprobador debe ser distinto del creador. Al aprobar, se persisten `APROBADA`, el aprobador, la fecha y una versión incrementada. La operación no exige contraseña adicional.
10. **Criterios de aceptación:**
    - Dado un borrador válido, cuando se solicita su revisión, entonces pasa a un estado de revisión registrado antes de aprobarse.
    - Dada una cotización en revisión, cuando la aprueba un usuario autorizado distinto del creador, entonces se registran aprobador, fecha y versión.
    - Dado que el creador intenta aprobar su cotización, cuando solicita la aprobación, entonces el backend la rechaza.
    - Dada una cotización que no está en el estado requerido o cuya versión no coincide, cuando se intenta aprobar, entonces el backend rechaza la operación.
    - Dada una aprobación crítica, cuando se confirma, entonces se valida la contraseña según la política transversal consolidada en `RNF-SEG-002` (antecedente: `RF-SEG-001`).
11. **Evidencia en el backend:** `src/cotizaciones/cotizaciones.controller.ts` expone `POST /cotizaciones/:id/aprobar`, protegido por `cotizaciones.aprobar_interna`, y recibe `QuoteVersionDto`. `src/cotizaciones/dto/update-cotizacion.dto.ts` define en ese DTO solo `version`, sin contraseña. `CotizacionesService.aprobar` comprueba autorización, ámbito, versión, estado y condiciones comerciales, y cambia directamente el estado a `APROBADA`. `assertApprovalCandidate` bloquea la aprobación por el creador. El enum declara `EN_REVISION`, pero no se encontró una operación del controlador/servicio que transicione a ese estado. `AuthService` tiene `verifyPassword`, pero la ruta de aprobación revisada no lo invoca.
12. **Evidencia en BD:** `Cotizacion` incluye `aprobador_interno_id` y `aprobado_internamente_at`. La migración `1794312000000-AddBackendRoleSchema.ts` agrega ambas columnas, índice y FK del aprobador a `usuarios` con `ON DELETE RESTRICT`. No se verificó una base desplegada.
13. **Brechas detectadas:** Ninguna asignada a esta ficha porque los faltantes se derivaron. `B-005-01` se descarta: el servicio bloquea la autoaprobación. `B-005-02`, por la falta de transición a `EN_REVISION`, se deriva a `RF-COM-012`. `B-005-03`, por la confirmación por contraseña requerida transversalmente para operaciones críticas, se originó como `RF-SEG-001` y se consolidó en `RNF-SEG-002`.
14. **Preguntas abiertas:** La secuencia y separación de responsables quedan definidas en la documentación activa. La selección exacta de operaciones que requieren confirmación por contraseña queda pendiente en `RNF-SEG-002`; la implementación del paso de revisión se especificará en `RF-COM-012`.
15. **Estado de cobertura:** Parcial. El backend aplica autorización, ámbito, separación entre creador y aprobador, control de versión y estado, y registra quién y cuándo aprobó. No implementa la transición a revisión y la ruta no solicita confirmación por contraseña.
16. **Nivel de certeza:** Confirmado en el código inspeccionado que la autoaprobación se bloquea, la aprobación cambia directamente de `BORRADOR` a `APROBADA` y el DTO de aprobación no contiene contraseña. Confirmado en las fuentes documentales que revisión y aprobación son etapas separadas y que las aprobaciones críticas requieren confirmación por contraseña. No se verificó una base desplegada.

**Trazabilidad:** creador → borrador → revisión → aprobación interna → envío al cliente → aceptación → emisión operativa. El backend evidencia la aprobación interna y su responsable, pero no implementa la transición a revisión.

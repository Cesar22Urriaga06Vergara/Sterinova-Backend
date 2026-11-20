---
id: RF-LOG-005
titulo: Registrar entregas parciales y finales
tipo: RF
modulo: Logística / Entregas
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 54–56; src/logistica/; src/ordenes-servicio/; SterinovaFrontend/src/components/logistica/RegistroEventoOrdenModal.tsx"
depende_de: [RF-LOG-004]
bloquea: [RF-LOG-019, RF-LOG-020, RF-LOG-021]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-LOG-021 se derivó a RF-LOG-019; B-LOG-022 a RF-LOG-020; B-LOG-023 a RF-LOG-021; criterios de cierre y liberación parcial a RA-LOG-004."
---

# RF-LOG-005 — Registrar entregas parciales y finales

**Fuente principal:** `Sterinova-ERP.md` §3, Logística, solicita entregas parciales y finales.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 4, respuestas 54–56; servicios, entidades, DTOs y migraciones de `src/logistica/` y `src/ordenes-servicio/`; formulario de eventos logísticos del frontend.

1. **ID:** `RF-LOG-005`.
2. **Título:** Registrar entregas parciales y finales.
3. **Tipo:** RF.
4. **Módulo:** Logística / Entregas.
5. **Descripción funcional:** Registrar cada entrega de material al cliente, completa o parcial, con cantidades por material, datos del transportista, receptor y evidencia, manteniendo el saldo pendiente hasta completar o cerrar la orden según reglas aprobadas.
6. **Reglas de negocio asociadas:** La respuesta 54 exige transportista, conductor, placa, ruta y prueba de entrega (POD) firmada o fotografiada. La respuesta 56 condiciona el despacho a liberación de Calidad y certificado cuando corresponda; alcance de la liberación en despachos parciales y regularización de excepciones siguen pendientes. La entrega al cliente debe distinguirse de la recepción en Planta.
7. **Actores y permisos:** Personal autenticado con `logistica.ordenes.cambiar_estado` registra el evento. El receptor se captura como nombre libre, no como usuario ERP.
8. **Datos y entidades:** `OrdenServicio`, `OrdenServicioMaterial`, `OrdenServicioEvento`, `Entrega` y `User`. El evento guarda cantidades por material, responsable, receptor, transportista, observaciones, fecha/hora y usuario autenticado. `Entrega` modela cabecera, transporte, receptor y evidencias JSON opcionales, pero no detalla materiales/cantidades.
9. **Precondiciones y postcondiciones:** La transición permitida es `PROCESADO → ENTREGADO`. Para órdenes con método de esterilización se exige que todos sus ciclos estén aprobados y certificados. Actualmente el estado final cierra la orden tras una sola entrega y no conserva saldo para eventos posteriores.
10. **Criterios de aceptación:** (a) Registrar una o varias entregas por orden. (b) Acumular cantidades por línea y calcular saldo. (c) No cerrar orden mientras exista saldo, salvo política de excepción aprobada. (d) Registrar POD y receptor. (e) Aplicar reglas de Calidad/certificado a entregas parciales conforme a decisión de negocio. (f) Conservar cada intento o entrega fallida sin sobrescribir el anterior.
11. **Evidencia en backend:** `LogisticaService.updateEstado` acepta transición final a `ENTREGADO`, valida que los IDs cubran los materiales de la orden sin duplicados y que cada cantidad no supere la cantidad de la línea; requiere receptor textual y guarda `ENTREGA_CLIENTE` con usuario/hora. No acumula cantidades de entregas anteriores ni valida saldo total pendiente.
12. **Evidencia en BD y frontend:** `OrdenServicioEvento` tiene unicidad por `(orden_id, tipo)`, que permite un único evento `ENTREGA_CLIENTE` por orden. La UI ofrece “Marcar Entregado” desde `PROCESADO`; captura cantidades, responsable y receptor textual, pero no adjunta firma/POD. `Entrega` no está conectada a servicio/controlador y no se encontró una migración que cree su tabla.
13. **Brechas derivadas:** `B-LOG-021` se asigna a `RF-LOG-019` (entregas parciales acumulables y saldos); `B-LOG-022` a `RF-LOG-020` (POD y firmas); `B-LOG-023` a `RF-LOG-021` (integración o depuración de la entidad `Entrega`). Los criterios de cierre y despacho parcial se derivan a `RA-LOG-004`. Esta ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** ¿Qué determina la entrega completa ante faltantes, devoluciones o entregas parciales planificadas? ¿Qué condiciones de Calidad y certificado aplican a despachos parciales? ¿Qué firma/evidencia es aceptable para la POD? Se consultan en `RA-LOG-004` y `RF-LOG-020`.
15. **Estado de cobertura:** Parcial. El evento final registra cantidades, receptor, responsable y actor autenticado y verifica el límite por línea; no hay varias entregas acumulables, cálculo de saldo, cierre por saldo ni POD adjunta.
16. **Nivel de certeza y límites:** Confirmado en código, entidades, DTOs, rutas y UI revisados. No se encontró servicio/migración operativa para `Entrega`; no se verificó una base desplegada.

**Trazabilidad actual:** Ciclos aprobados/certificados → un evento `ENTREGA_CLIENTE` → estado `ENTREGADO`; una cantidad menor puede cerrar la orden sin saldo pendiente registrable.

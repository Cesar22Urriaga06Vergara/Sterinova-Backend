---
id: RF-PLA-003
titulo: Distribuir cantidades entre ciclos
tipo: RF
modulo: Planta
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, Planta; §6, reglas operativas"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 5, respuestas 62–63 y 68; src/planta/; src/calidad/"
depende_de: [RF-PLA-002, RF-LOG-002]
bloquea: [RF-PLA-011]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-PLA-005 se deriva a RF-PLA-011; decisiones de reproceso y material rechazado se derivan a RA-PLA-006."
---

# RF-PLA-003 — Distribuir cantidades entre ciclos

**Fuente principal:** `Sterinova-ERP.md` §3, Planta, distribución de una orden entre ciclos y asignación de materiales por cantidad.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 5, respuestas 62–63 y 68; servicio y entidades de Planta y Calidad.

1. **ID:** `RF-PLA-003`.
2. **Título:** Distribuir cantidades entre ciclos.
3. **Tipo:** RF.
4. **Módulo:** Planta.
5. **Descripción funcional:** Asignar materiales de una orden a uno o varios ciclos en cantidades parciales, calcular saldo disponible y preservar historial por intento.
6. **Reglas de negocio asociadas:** Una orden puede distribuirse entre ciclos; los materiales deben asociarse por línea/cantidad y no exceder lo recibido. Un reproceso es un ciclo nuevo vinculado al original; el ciclo fallido no se borra ni sobrescribe y se conserva su evidencia.
7. **Actores y permisos:** Operador autenticado con `planta.ciclos.crear`; Calidad revisa, aprueba o rechaza el ciclo con permisos separados.
8. **Datos y entidades:** `CicloMaterialProcesado` vincula ciclo y línea de material de orden, y persiste cantidad. `CicloEsterilizacion` guarda estado, motivo de rechazo y una relación nullable `ciclo_correccion_de_id`, aunque el flujo de creación no la utiliza.
9. **Precondiciones y postcondiciones:** Para una orden `EN_PLANTA`, el servicio suma las cantidades guardadas en ciclos previos, resta del recibido y valida el saldo solicitado. Guarda ciclo y asignación en transacción y mantiene `EN_PLANTA` si faltan cantidades; de lo contrario marca `PROCESADO`. La suma actual incluye ciclos rechazados.
10. **Criterios de aceptación:** (a) Saldo calculado por material a partir de la cantidad recibida menos cantidades válidas procesadas. (b) No sobreasignar en ciclos sucesivos o concurrentes. (c) Un ciclo rechazado/abortado no se contabiliza como procesamiento conforme y su disposición debe quedar definida. (d) Reprocesar con ciclo nuevo vinculado al original, preservando el registro original y sus evidencias.
11. **Evidencia en backend:** `PlantaService.createCiclo` suma `cantidad_procesada` de todos los ciclos previos de la orden, sin filtrar su estado. Toma `pessimistic_write` sobre la fila de la orden dentro de la transacción, serializando las creaciones concurrentes de esa misma orden. Calidad marca ciclos `RECHAZADO`, pero el DTO de creación no permite `ciclo_correccion_de_id`.
12. **Evidencia en BD:** `CicloMaterialProcesado` persiste las cantidades de cada intento y `CicloEsterilizacion` conserva estado y motivo; no hay tabla/flujo de reproceso conectado. El cómputo de saldo trata igualmente ciclos pendientes, aprobados y rechazados.
13. **Brechas derivadas:** `B-PLA-005` se reasigna a `RF-PLA-011` para excluir saldos rechazados de procesamiento válido e implementar vínculo/flujo de reproceso. Esta ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** Se derivan a `RA-PLA-006`: si un ciclo rechazado libera toda o parte de su cantidad; quién autoriza el reproceso; cómo tratar abortos y material rechazado; y cuándo debe cambiar el estado de la orden.
15. **Estado de cobertura:** Parcial. Saldo y bloqueo concurrente de la misma orden están implementados; estados rechazados se incluyen erróneamente en el acumulado y el vínculo de reproceso no está operativo.
16. **Nivel de certeza y límites:** Confirmado en fuente de negocio, servicios, entidades y DTO. No se verificó la base de datos desplegada.

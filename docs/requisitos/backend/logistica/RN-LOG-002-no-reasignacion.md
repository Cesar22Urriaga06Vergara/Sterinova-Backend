---
id: RN-LOG-002
titulo: Evitar reasignar dos veces un material recibido
tipo: RN
modulo: Logística / Planta
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §6, reglas operativas"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 49–51; Módulo 5, respuestas 62–63; src/logistica/; src/planta/"
depende_de: [RF-LOG-002]
bloquea: [RF-LOG-012, RF-PLA-006]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-LOG-010 y B-LOG-012 se derivaron a RF-LOG-012; B-LOG-013 se derivó a RF-PLA-006."
---

# RN-LOG-002 — Evitar reasignar dos veces un material recibido

**Fuente principal:** `Sterinova-ERP.md` §6 establece que un material recibido no puede reasignarse dos veces y que las cantidades pueden distribuirse en varios ciclos.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 4, respuestas 49–51, y Módulo 5, respuestas 62–63; servicios y entidades de `src/logistica/` y `src/planta/`.

1. **ID:** `RN-LOG-002`.
2. **Título:** Evitar reasignar dos veces un material recibido.
3. **Tipo:** RN.
4. **Módulo:** Logística / Planta.
5. **Definición de la regla:** Una unidad física recibida solo puede asignarse una vez a una orden y a un ciclo de procesamiento. Una línea puede fraccionarse entre ciclos cuando se conserve el saldo y nunca se exceda la cantidad efectivamente recibida.
6. **Reglas asociadas:** Las recepciones parciales conservan pendiente. Las cantidades se controlan según unidad/servicio; Planta registra vínculos por material de orden y cantidad. Las precisiones 62–63 permiten distribuir una orden en ciclos parciales y asignar varias órdenes compatibles al mismo ciclo.
7. **Actores y permisos:** Logística registra y entrega material; personal autorizado de Planta asigna cantidades al crear ciclos. Los controles de integridad y saldo se aplican en backend bajo transacción.
8. **Datos y entidades:** `RecepcionItem` debería representar la cantidad física recibida; `OrdenServicioMaterial` identifica material por orden; `CicloMaterialProcesado` relaciona el material con ciclo y cantidad procesada; `CicloEsterilizacion` conserva el ciclo.
9. **Precondiciones y postcondiciones:** Solo materiales de órdenes elegibles pueden asignarse. La cantidad disponible se deriva de recepción acumulada menos reservas/procesamiento previos; no se duplica unidad alguna. Repartir una línea en ciclos distintos es válido si cada porción mantiene trazabilidad y el total no excede lo recibido.
10. **Criterios de aceptación:** (a) Rechazar material que no pertenezca a la orden/ciclo. (b) Evitar duplicar una misma asignación de cantidad. (c) Permitir fraccionamiento entre ciclos dentro del saldo recibido. (d) Serializar asignaciones concurrentes. (e) No permitir que una línea manual sin vínculo contractual eluda el control acordado. (f) Definir qué ocurre con saldo reservado por ciclo rechazado, abortado o reprocesado.
11. **Evidencia en backend:** `PlantaService.createCiclo` admite órdenes `EN_PLANTA`, restringe IDs a los materiales de esa orden, rechaza IDs repetidos y suma cantidades registradas en ciclos anteriores; impide superar `OrdenServicioMaterial.cantidad` y bloquea la orden en transacción. Así permite ciclos parciales sin sobrepasar el total de la orden.
12. **Evidencia en persistencia y límites:** `CicloMaterialProcesado` tiene FK a `OrdenServicioMaterial` y guarda cantidad, pero el agregado se compara contra cantidad ordenada, no recibida. Los eventos de recepción no alimentan este ledger. `createOrden` controla el saldo cotizado solo para líneas con `cotizacion_item_id`; materiales manuales sin vínculo se omiten del cálculo. La entidad de ciclo apunta a una sola orden, aunque la regla maestra de Planta permite varias órdenes por ciclo.
13. **Brechas derivadas:** `B-LOG-010` y `B-LOG-012` se reasignaron a `RF-LOG-012`, para controlar el procesamiento contra saldo físico recibido y cerrar bypasses de cantidad. `B-LOG-013` se reasignó a `RF-PLA-006`, para soportar varios pedidos en un ciclo. La ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** ¿Una cantidad queda reservada al crear el ciclo o al iniciar el proceso? ¿Cómo se libera tras aborto, rechazo o reproceso? ¿Qué evidencia individualiza una unidad física cuando el material es homogéneo y se recibe por lote?
15. **Estado de cobertura:** Parcial. Existe un agregado transaccional por material de orden que evita superar la cantidad ordenada al distribuirla entre ciclos; no protege contra la cantidad realmente recibida ni asegura la identidad de la unidad física.
16. **Nivel de certeza y límites:** Confirmado en los servicios y entidades revisados; no se verificó una base desplegada. La posibilidad de ciclos parciales y multiorden proviene de las respuestas activas del Módulo 5, no de la capacidad actual del modelo de ciclo.

**Trazabilidad:** Cantidad física recibida → saldo disponible por material → reservas/asignaciones de ciclo → procesamiento, rechazo o reproceso con historia conservada.

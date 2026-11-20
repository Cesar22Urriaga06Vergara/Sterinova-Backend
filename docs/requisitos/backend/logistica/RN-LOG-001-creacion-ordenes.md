---
id: RN-LOG-001
titulo: Crear órdenes desde cotizaciones aceptadas
tipo: RN
modulo: Logística
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, Logística"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 4, respuestas 46–47; src/logistica/; src/ordenes-servicio/; src/database/migrations/1795100000000-AllowMultipleOrdersPerQuote.ts"
depende_de: [RF-COM-006, RF-COM-007]
bloquea: [RF-LOG-001, RF-LOG-006, RF-LOG-007]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-LOG-001 y B-LOG-002 se derivaron a RF-LOG-006 y RF-LOG-007; B-LOG-003 se derivó a RA-LOG-001."
---

# RN-LOG-001 — Crear órdenes desde cotizaciones aceptadas

**Fuente principal:** `Sterinova-ERP.md` §3, «Logística», que requiere creación de órdenes desde cotizaciones.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 4, respuestas 46–47, que precisa aceptación del cliente, varias órdenes por cotización, entregas parciales o por sede y soporte comercial; código en `src/logistica/`, `src/ordenes-servicio/` y migraciones relacionadas.

1. **ID:** `RN-LOG-001`.
2. **Título:** Crear órdenes desde cotizaciones aceptadas.
3. **Tipo:** RN.
4. **Módulo:** Logística.
5. **Definición de la regla:** Una orden de servicio debe originarse en una cotización aceptada por el cliente. Una cotización puede originar múltiples órdenes para sedes o entregas parciales; cada orden referencia una sola cotización y agrupa ítems de esa cotización, sin mezclar cotizaciones.
6. **Reglas de negocio asociadas:** La respuesta 47 del Módulo 4 exige estado `ACEPTADA` y una Orden de Compra del cliente o autorización explícita del Jefe de Área. Si el acuerdo exige anticipo, se debe alertar; no se define bloqueo obligatorio antes de confirmación de Finanzas.
7. **Actores y permisos:** La creación corresponde al personal autorizado de Logística mediante `logistica.ordenes.crear`, con acceso al ámbito del recurso.
8. **Datos y entidades implicadas:** `Cotizacion`, `CotizacionItem`, `OrdenServicio`, `OrdenServicioMaterial`; relación por `cotizacion_id` y, para los materiales vinculados, `cotizacion_item_id`.
9. **Precondiciones y postcondiciones:** La cotización debe existir y estar `ACEPTADA_CLIENTE`; debe registrarse soporte comercial; las cantidades asignadas no deben exceder el saldo contratado. La orden se crea en estado `PENDIENTE`, con consecutivo y datos de soporte. Una cotización aceptada puede seguir generando órdenes mientras haya cantidades disponibles.
10. **Criterios de aceptación:** (a) Cotización en borrador o solo aprobada internamente: rechazar creación. (b) Cotización aceptada con soporte válido: permitir crear orden. (c) Permitir órdenes parciales o por sede. (d) No exceder el saldo de cada ítem contratado. (e) Impedir que una orden agrupe ítems de cotizaciones diferentes.
11. **Evidencia en backend:** `LogisticaService.createOrden` valida `ACEPTADA_CLIENTE`, exige `orden_compra_cliente`, bloquea la cotización durante la transacción y comprueba saldo por ítem contra órdenes no canceladas. El servicio permite varias órdenes parciales por la misma cotización.
12. **Evidencia en base de datos y frontend:** La migración `1795100000000-AllowMultipleOrdersPerQuote.ts` quita la unicidad de `ordenes_servicio.cotizacion_id`; la entidad `OrdenServicio` conserva una relación ORM `OneToOne`, inconsistente con esa cardinalidad. El formulario de `src/app/(erp)/logistica/page.tsx` inicia con materiales manuales vacíos y no carga automáticamente los ítems seleccionados de la cotización. `CreateOrdenDto.materiales` es opcional y el servicio acepta una lista vacía.
13. **Brechas derivadas:** `B-LOG-001` (precarga y trazabilidad de ítems) se asigna a `RF-LOG-006`; `B-LOG-002` (cardinalidad ORM) se asigna a `RF-LOG-007`; `B-LOG-003` (OC o autorización alternativa) se asigna a `RA-LOG-001`. Esta ficha queda con `brechas: []` por la derivación aprobada.
14. **Preguntas abiertas:** `RA-LOG-001` plantea si el soporte alternativo a la OC requiere evidencia adjunta, registro de autorizador/fecha o ambos. También debe decidirse el tratamiento de materiales manuales que no correspondan a un ítem de la cotización.
15. **Estado de cobertura:** Parcial. El estado de aceptación, el saldo de cantidades y la multiplicidad de órdenes están cubiertos por la lógica y migración. La captura/precarga de ítems y la cardinalidad del ORM requieren corrección; la alternativa de soporte comercial requiere decisión.
16. **Nivel de certeza y límites:** Confirmado en el código y migración inspeccionados; no se verificó una base desplegada. La regla de negocio contractual se complementa con respuestas 46–47 del documento activo de reglas maestras.

**Trazabilidad:** Cotización aceptada → soporte comercial → una o varias órdenes parciales/por sede → materiales asignados con saldo controlado.

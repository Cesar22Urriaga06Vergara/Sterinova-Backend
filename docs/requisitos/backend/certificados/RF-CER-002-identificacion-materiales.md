---
id: RF-CER-002
titulo: Identificar en el certificado los materiales y ciclos asociados
tipo: RF
modulo: Certificados / Planta
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §7"
fuente_contraste: "src/certificados/; src/planta/; src/pdf/; src/database/migrations/"
depende_de: [RF-CER-001, RF-PLA-003, RF-PLA-004]
bloquea: [RF-CER-005, RA-CER-001]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-CER-002 se deriva a RF-CER-005; partición/agrupación a RA-CER-001."
---

# RF-CER-002 — Identificar en el certificado los materiales y ciclos asociados

**Fuente principal:** `Sterinova-ERP.md` §3 (ciclos, lotes y agrupación) y §7 (PDFs con datos congelados).

**Fuentes de contraste:** entidad/servicio de Certificados, persistencia de cantidades procesadas de Planta, servicio PDF y migraciones.

1. **ID:** `RF-CER-002`.
2. **Título:** Identificar en el certificado los materiales y ciclos asociados.
3. **Tipo:** RF.
4. **Módulo:** Certificados / Planta.
5. **Descripción funcional:** El certificado identifica ciclo/protocolo y los materiales, lotes y cantidades realmente procesados que ampara.
6. **Reglas asociadas:** Congelar los datos al emitir; regenerar desde snapshot; reflejar la cantidad y alcance reales del ciclo, no extrapolar del pedido.
7. **Actores y permisos:** Calidad aprueba y emite; usuarios autorizados consultan/descargan certificado.
8. **Datos y entidades:** Certificado contiene snapshot JSON, datos técnicos, formato/versiones, PDF/hash; snapshot de materiales incluye id, descripción, lote, cantidad, empaque, muestras y referencia al ítem cotizado.
9. **Flujo:** Al aprobar se copian los materiales de la orden, se construye snapshot y PDF; `ciclos_materiales_procesados` guarda por separado cantidades asignadas a cada ciclo.
10. **Criterios de aceptación:** El certificado debe incluir solo alcance procesado por ese ciclo con lote y cantidad correctos; preservar snapshot y verificar integridad PDF; regeneración no consulta datos operativos mutables.
11. **Evidencia del backend:** `emitirDesdeCiclo` mapea `ciclo.orden.materiales`; no consulta las filas de `ciclos_materiales_procesados` al construir la lista certificada.
12. **Persistencia y PDF:** `snapshot_datos` guarda datos completos; Playwright genera PDF en backend y SHA-256 se persiste. `ensurePdfCurrent` valida integridad y regenera desde el snapshot. Trigger de BD protege snapshot/campos principales de certificados aprobados.
13. **Brechas derivadas:** `B-CER-002` se asigna a `RF-CER-005` para usar cantidades procesadas del ciclo; partición multiorden/cliente se deriva a `RA-CER-001`. Frontmatter sin brechas propias por derivación aprobada.
14. **Preguntas abiertas:** Definir cómo presentar material parcial y rechazado y agrupar materiales de órdenes/ciclos diversos; `RA-CER-001`.
15. **Estado de cobertura:** Parcial. Snapshot y PDF conservan lotes y materiales, pero la cantidad incluida proviene del material completo de la orden, no de la cantidad procesada del ciclo.
16. **Certeza y límites:** Confirmado al comparar `CertificadosService` con la entidad de cantidades procesadas de Planta; no se verificó PDF real/base desplegada.

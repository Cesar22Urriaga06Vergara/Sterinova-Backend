---
id: RN-CAL-001
titulo: Exigir aprobación de Calidad antes del despacho
tipo: RN
modulo: Calidad / Logística / Certificados
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §6"
fuente_contraste: "Sterinova-ERP.md §3; docs/negocio/reglas-maestras.md, Módulo 6, respuestas 76–77; src/logistica/; src/calidad/; src/certificados/"
depende_de: [RF-CAL-001, RF-CAL-002]
bloquea: [RF-CAL-007]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-CAL-003 se mantiene asignada a RF-CAL-007."
---

# RN-CAL-001 — Exigir aprobación de Calidad antes del despacho

**Fuente principal:** `Sterinova-ERP.md` §6: Calidad debe aprobar antes del despacho.

**Fuentes de contraste:** Anexo §3; `docs/negocio/reglas-maestras.md`, Módulo 6, respuestas 76–77; servicios de Logística, Calidad y Certificados.

1. **ID:** `RN-CAL-001`.
2. **Título:** Exigir aprobación de Calidad antes del despacho.
3. **Tipo:** RN.
4. **Módulo:** Calidad / Logística / Certificados.
5. **Enunciado:** La entrega ordinaria requiere liberación de Calidad y certificado aplicable para todo material que lo requiera; resultados pendientes/no conformes no autorizan despacho. Excepciones solo por flujo formal aprobado.
6. **Reglas asociadas:** Procesamiento terminado no equivale a liberación; estados pendientes no equivalen a resultados negativos; fallos críticos bloquean certificado ordinario; excepciones documentadas no alteran el resultado original.
7. **Actores y permisos:** Calidad revisa y aprueba; Logística registra entrega. Cualquier flujo alternativo debe validar permisos y autorizadores definidos.
8. **Datos y entidades:** `OrdenServicio.metodo_esterilizacion` puede ser nulo; los ciclos tienen estados y certificado asociado. No hay atributo general de liberación para órdenes sin método.
9. **Flujo y validación actual:** Antes de `ENTREGADO`, Logística valida existencia, aprobación y certificado de todos los ciclos solo si `metodo_esterilizacion` tiene valor. Si es nulo, ese bloque de comprobación se omite.
10. **Criterios de aceptación:** Aplicar compuerta a toda orden/material que requiera liberación; impedir despacho ordinario si faltan ciclos aprobados/certificados; definir explícitamente el tratamiento de órdenes sin método; validar excepciones por autorización específica y auditable.
11. **Evidencia en backend:** `LogisticaService.updateEstado` contiene la validación condicionada por el método. Cuando aplica, bloquea sin ciclos o ante ciclo no aprobado/sin certificado.
12. **Evidencia de persistencia/interfaz:** La entidad de orden permite método `null`; actualización de estado expone transición a `ENTREGADO`. No se identificó otra compuerta universal para órdenes sin método.
13. **Brechas derivadas:** `B-CAL-003` continúa asignada a `RF-CAL-007`, que debe blindar la validación para órdenes sin método. Frontmatter sin brechas propias por derivación aprobada.
14. **Preguntas abiertas:** Determinar qué órdenes sin método requieren Calidad (p. ej. procesos no esterilizantes) y qué certificado o constancia permite su despacho. Resolver dentro de `RF-CAL-007`/política aplicable.
15. **Estado de cobertura:** Parcial. El bloqueo es robusto para órdenes con método y ciclos, pero condicional; nulo puede evitar la verificación.
16. **Certeza y límites:** Confirmado en la condición de `LogisticaService.updateEstado` y entidad `OrdenServicio`. El riesgo es de ruta de código; no se confirmó cuántas órdenes operativas tienen método nulo ni se inspeccionó BD productiva.

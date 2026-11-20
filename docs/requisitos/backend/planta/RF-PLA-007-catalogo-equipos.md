---
id: RF-PLA-007
titulo: Crear catálogo de equipos (EtO, Vapor, Lavandería)
tipo: RF
modulo: Planta
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3; docs/negocio/reglas-maestras.md, Módulo 5, respuestas 58–59"
fuente_contraste: "src/planta/entities/ciclo-esterilizacion.entity.ts; src/planta/dto/create-ciclo.dto.ts"
depende_de: [RF-PLA-001]
bloquea: []
brechas: [B-PLA-001]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-PLA-001; formaliza catálogo y selección trazable frente al texto libre actual."
  - version: 0.2
    nota: "Se completa como ficha técnica preliminar de 16 campos; clasificación, atributos y permisos siguen por definir."
---

# RF-PLA-007 — Crear catálogo de equipos (EtO, Vapor, Lavandería)

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-PLA-007`.
2. **Título:** Crear catálogo de equipos (EtO, Vapor, Lavandería).
3. **Tipo:** RF.
4. **Módulo:** Planta.
5. **Descripción funcional:** Administrar equipos operativos como activos identificables y seleccionables en ciclos, incluyendo equipos EtO, Vapor y lavandería.
6. **Reglas asociadas:** Cada equipo debe tener identificación estable y uso/método compatible; lavandería debe representarse sin asignarle EtO/Vapor por defecto. Campos y clasificadores se aprueban antes de migrar datos.
7. **Actores / permisos:** Administración de Planta/Calidad según matriz RBAC; usuarios operativos consultan y seleccionan equipos habilitados. Los códigos exactos de permisos quedan por validar.
8. **Datos y entidades:** Catálogo propuesto con código, nombre, tipo/uso, ubicación, método(s), capacidad y estado; relación de ciclo a equipo. No existe aún la entidad indicada.
9. **Flujo preliminar:** Registrar equipo → definir tipo/método y ubicación → habilitarlo según estado → seleccionarlo al crear ciclo → conservar vínculo histórico al equipo usado.
10. **Criterios de aceptación preliminares:** Equipo tiene código único y no ambiguo; ciclo nuevo referencia un equipo existente; equipos inactivos no aparecen como seleccionables; consulta histórica conserva el equipo aun tras cambio de catálogo; lavandería se distingue de tecnologías de esterilización.
11. **Evidencia en backend:** `CicloEsterilizacion` conserva `equipo` como texto y no se encontró entidad/servicio de catálogo en `src/planta/`.
12. **Persistencia e interfaz:** DTO/formulario actual recibe dato textual; falta catálogo relacional y administración/selección desde UI.
13. **Brecha asociada:** `B-PLA-001` abierta; el diseño de catálogo absorbe la inexistencia de entidad y clasificación estructurada.
14. **Preguntas abiertas:** Tipo/subtipo de lavandería, equipos multi-método, códigos, ubicaciones, capacidad, ciclo de vida, permisos y plan de migración de textos históricos (`RA-PLA-004`).
15. **Cobertura preliminar:** Faltante; solo existe identificación textual del equipo en el ciclo.
16. **Certeza y límites:** La ausencia se confirmó en entidades/DTO de Planta. Reglas maestras y anexo sustentan el catálogo requerido; atributos no definidos se mantienen abiertos. No se verificaron activos reales.

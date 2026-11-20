---
id: RF-PLA-014
titulo: Implementar agrupación de ciclos por Tanda
tipo: RF
modulo: Planta
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, Planta"
fuente_contraste: "src/planta/entities/ciclo-esterilizacion.entity.ts; src/planta/planta.service.ts"
depende_de: [RF-PLA-005]
bloquea: []
brechas: [B-PLA-008]
historial:
  - version: 0.1
    nota: "Borrador derivado de la ausencia de una entidad y flujo de Tanda distintos del ciclo."
  - version: 0.2
    nota: "Se completa como ficha técnica preliminar de 16 campos; definición de agrupación sigue pendiente de negocio."
---

# RF-PLA-014 — Implementar agrupación de ciclos por Tanda

**Estado:** Borrador, pendiente de análisis y validación.

1. **ID:** `RF-PLA-014`.
2. **Título:** Implementar agrupación de ciclos por Tanda.
3. **Tipo:** RF.
4. **Módulo:** Planta.
5. **Descripción funcional:** Registrar una Tanda como unidad operativa distinta del Ciclo que agrupe operaciones/cargas de Planta con identidad y trazabilidad propias.
6. **Reglas asociadas:** Tanda y Ciclo no son sinónimos; conservación de la relación y de fechas/responsables; no asumir equivalencia uno-a-uno ni multiorden hasta decisión.
7. **Actores / permisos:** Planta crea/consulta tandas y asocia ciclos; Calidad consume la agrupación para evaluación/trazabilidad bajo ámbito. Permisos exactos pendientes.
8. **Datos y entidades:** Tanda con identificador/estado/fecha/responsable y relaciones a ciclo, orden y materiales según cardinalidades por definir.
9. **Flujo preliminar:** Crear tanda → reunir carga/órdenes elegibles → ejecutar uno o más ciclos asociados → conservar eventos → consultar evaluación y certificado desde la tanda.
10. **Criterios de aceptación preliminares:** Tanda se identifica independientemente del ciclo; relación Tanda–Ciclo se valida y consulta; cantidades/materiales no se duplican al agrupar; cambios conservan responsable y tiempo; cardinalidad respeta decisión aprobada.
11. **Evidencia en backend:** El modelo incluye `CicloEsterilizacion` y materiales procesados; no se encontró entidad, servicio ni endpoint `Tanda` en `src/planta/`.
12. **Persistencia e interfaz:** No existe tabla/relación/flujo UI separado; pantallas organizan por ciclos/órdenes.
13. **Brecha asociada:** `B-PLA-008` abierta por ausencia de entidad/agrupación Tanda.
14. **Preguntas abiertas:** Cardinalidades Tanda–Ciclo–Orden, consolidación de cargas, secuenciación, estado, numeración, cierre, auditoría e impacto en Calidad/certificados.
15. **Cobertura preliminar:** Faltante para una unidad Tanda separada; ciclos existen como unidad operativa.
16. **Certeza y límites:** Ausencia confirmada en entidades y servicio de Planta. El anexo nombra Tandas separadas de ciclos pero no establece el modelo; no se presume que sea la tanda física del equipo. Borrador.

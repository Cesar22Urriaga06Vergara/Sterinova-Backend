---
id: RF-PLA-012
titulo: Implementar gestión de archivos adjuntos (Evidencias de ciclo)
tipo: RF
modulo: Planta / Calidad / Documentos
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3 y §5; docs/negocio/reglas-maestras.md, Módulo 5, respuesta 75"
fuente_contraste: "src/planta/entities/ciclo-esterilizacion.entity.ts; src/calidad/; src/certificados/"
depende_de: [RF-PLA-004]
bloquea: []
brechas: [B-PLA-006]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-PLA-006; lista inicial de evidencias según regla maestra, sujeta a RA-PLA-007."
  - version: 0.2
    nota: "Se completa como ficha técnica preliminar de 16 campos; formatos, obligatoriedad y retención siguen sujetos a decisión."
---

# RF-PLA-012 — Implementar gestión de archivos adjuntos (Evidencias de ciclo)

**Estado:** Borrador, pendiente de análisis y validación.

1. **ID:** `RF-PLA-012`.
2. **Título:** Implementar gestión de archivos adjuntos (evidencias de ciclo).
3. **Tipo:** RF.
4. **Módulo:** Planta / Calidad / Documentos.
5. **Descripción funcional:** Adjuntar evidencia digital del proceso y relacionarla con ciclo y, cuando aplique, material/lote/parámetro.
6. **Reglas asociadas:** Conservar original e identidad del archivo; registrar tipo/autor/fecha y vínculo; no confundir adjunto con dato estructurado ni permitir que un archivo reemplace mediciones. Tipos obligatorios quedan en `RA-PLA-007`.
7. **Actores / permisos:** Planta carga evidencia operativa; Calidad consulta/evalúa y adjunta evidencia de decisión; lectura y descarga se limitan por permisos y ámbito.
8. **Datos y entidades:** Archivo/objeto almacenado, hash/metadata, nombre/tipo, autor, fecha, relación con ciclo y opcionalmente material/parámetro, política de retención.
9. **Flujo preliminar:** Subir y validar archivo → crear metadata y relación → consultar/descargar por usuarios autorizados → conservar versión/evidencia con su expediente.
10. **Criterios de aceptación preliminares:** Archivo queda vinculado al expediente correcto y verificable por hash; fallos de carga no dejan metadata huérfana; tipos/tamaño se validan según política; evidencia existente no se sobrescribe; lectura restringida por ámbito.
11. **Evidencia en backend:** Entidades y endpoints de Planta/Calidad revisados no incluyen carga/relación de archivos; `control_biologico` y `control_quimico` guardan texto.
12. **Persistencia e interfaz:** No se identificó entidad de adjuntos para ciclos ni flujo de carga/descarga asociado; integración con almacenamiento y UI aún no diseñada.
13. **Brecha asociada:** `B-PLA-006` abierta por falta de gestión de adjuntos de evidencia.
14. **Preguntas abiertas:** Formatos, tamaño, validación/escaneo, obligatoriedad por método, asociación por nivel, permisos, retención, eliminación, versiones y contingencia (`RA-PLA-007`).
15. **Cobertura preliminar:** Faltante como archivo adjunto; existen algunos resultados de control como texto, no gestión documental.
16. **Certeza y límites:** Ausencia confirmada en entidades/endpoints revisados; lista de tipos viene de reglas maestras y sigue sujeta a decisión. No se evaluó almacenamiento real; borrador.

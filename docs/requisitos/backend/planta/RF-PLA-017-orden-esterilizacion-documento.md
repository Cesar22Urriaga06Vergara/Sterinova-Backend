---
id: RF-PLA-017
titulo: Generar y conservar la orden de esterilización
tipo: RF / Planta / Documentos
modulo: Planta / Documentos
estado: borrador
certeza: confirmado
version: 0.1
fecha_creacion: 2026-11-20
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3 Planta; §7 Documentos generados"
fuente_contraste: "src/planta/planta.controller.ts; src/planta/planta.service.ts; src/planta/entities/ciclo-esterilizacion.entity.ts; SterinovaFrontend/src/app/(erp)/planta/"
depende_de: [RF-PLA-002, RF-PLA-004, RF-PLA-010]
bloquea: []
brechas: [B-PLA-012]
historial:
  - version: 0.1
    nota: "Borrador derivado de §7; el código registra ciclos, pero no se encontró emisión/consulta de un documento de orden de esterilización."
---

# RF-PLA-017 — Generar y conservar la orden de esterilización

**Estado:** Borrador técnico; pendiente de validación.

1. **ID:** `RF-PLA-017`.
2. **Título:** Generar y conservar la orden de esterilización.
3. **Tipo:** RF / Planta / Documentos.
4. **Módulo:** Planta / Documentos.
5. **Descripción funcional:** Generar y conservar el documento de orden de esterilización que acompaña la preparación/ejecución del ciclo, vinculado al ciclo y a las órdenes/materiales de origen. El documento debe reflejar los datos autorizados al momento de su emisión.
6. **Reglas asociadas:** Respetar método contratado, ciclo, cantidades, protocolo versionado y reglas de autorización. La orden documental no sustituye el registro operativo de ciclo ni la evaluación/liberación de Calidad. Correcciones posteriores deben conservar el documento anterior.
7. **Actores / permisos:** Operadores de Planta autorizados para crear/consultar ciclos; permisos específicos para emitir, aprobar o descargar el documento deben definirse en la matriz RBAC.
8. **Datos y entidades:** Ciclo, orden(es), materiales/cantidades, método, equipo, protocolo/version, identificador interno y número físico cuando existan, responsable y datos documentales aprobados. El contenido exacto no está definido en §7.
9. **Flujo preliminar:** Crear ciclo con datos válidos → generar el documento en el momento que negocio determine → congelar snapshot y versión de formato → permitir consulta/descarga bajo ámbito de Planta → conservar versiones/correcciones.
10. **Criterios de aceptación preliminares:** (a) Documento vinculado inequívocamente a ciclo y materiales/órdenes correspondientes. (b) Contenido corresponde al snapshot aprobado. (c) No permite cambiar método contratado ni ampliar cantidades procesadas. (d) Descargas repetidas no cambian el original. (e) Enmienda conserva relación con el documento anterior. (f) Autorización respeta ámbito y separación de responsabilidades.
11. **Fuentes y evidencia actual:** §7 incluye órdenes de esterilización entre los documentos generados. `PlantaController` expone consulta/creación de ciclos y protocolos, no una ruta documental/PDF. `PlantaService` persiste el ciclo y sus cantidades; no se encontró emisión de `DocumentoEmitido` ni vínculo a snapshot/PDF de orden de esterilización. El frontend muestra y crea ciclos, sin vista de descarga del documento.
12. **Persistencia e interfaz:** Existe el registro operativo `CicloEsterilizacion`, pero no una entidad/tipo documental y flujo de generación específicos localizados en el módulo. El diseño deberá separar el snapshot del documento de los datos operativos mutables.
13. **Brecha asociada:** `B-PLA-012` registra que el documento de orden de esterilización exigido en §7 no tiene un flujo de generación/conservación identificado.
14. **Preguntas abiertas:** Contenido y destinatarios; si se emite al crear el ciclo, al preparar la tanda o antes del procesamiento; firma/aprobación requerida; relación con el número físico de máquina, protocolo y multiorden; formato y conservación. Se deriva a `RA-PLA-010`.
15. **Cobertura preliminar:** Faltante para documento emitido. La creación y persistencia del ciclo están cubiertas parcialmente por `RF-PLA-002`, pero no equivalen a una orden documental emitida.
16. **Certeza y límites:** La existencia del ciclo y ausencia de ruta de PDF/DocumentoEmitido se verificaron en el controlador/servicio de Planta y la UI. El anexo no detalla contenido ni momento de emisión; esos puntos requieren decisión y no se infieren.

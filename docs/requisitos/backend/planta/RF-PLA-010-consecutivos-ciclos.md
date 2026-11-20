---
id: RF-PLA-010
titulo: Implementar consecutivo de negocio y número físico de ciclo
tipo: RF
modulo: Planta
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "docs/negocio/reglas-maestras.md, Módulo 5, respuestas 61 y 68"
fuente_contraste: "src/planta/entities/ciclo-esterilizacion.entity.ts; src/planta/dto/create-ciclo.dto.ts; SterinovaFrontend/src/app/(erp)/planta/ciclo/nuevo/page.tsx"
depende_de: [RF-PLA-002]
bloquea: []
brechas: [B-PLA-004]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-PLA-004; requiere decisión de formato y reglas de numeración antes del diseño final."
  - version: 0.2
    nota: "Se completa como ficha técnica preliminar de 16 campos; formatos y retroactividad continúan en RA-PLA-005."
---

# RF-PLA-010 — Implementar consecutivo de negocio y número físico de ciclo

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-PLA-010`.
2. **Título:** Implementar consecutivo de negocio y número físico de ciclo.
3. **Tipo:** RF.
4. **Módulo:** Planta.
5. **Descripción funcional:** Identificar cada ciclo mediante consecutivo interno de negocio y registrar por separado el número físico leído/reportado por el equipo.
6. **Reglas asociadas:** La fuente de reglas indica unicidad del número físico por equipo y año; reproceso conserva vínculo al original y nueva identificación. Ejemplo de formato no se toma como especificación final.
7. **Actores / permisos:** Planta registra/consulta ciclos; generación de consecutivo debe ser automática y atómica. Roles de corrección retroactiva por definir.
8. **Datos y entidades:** Ciclo, consecutivo interno, número físico, equipo, año/fecha, secuencia y ciclo origen de reproceso.
9. **Flujo preliminar:** Crear ciclo → asignar consecutivo interno → registrar número físico → validar unicidad equipo/año → relacionar si es reproceso → conservar ambos en consultas/certificados.
10. **Criterios de aceptación preliminares:** Consecutivos concurrentes no se duplican; duplicado físico en mismo equipo/año se rechaza; el mismo número en otro equipo se resuelve según alcance aprobado; un reproceso obtiene identificador propio y enlace al original.
11. **Evidencia en backend/frontend:** Entidad y DTO de ciclo usan `id` autogenerado sin números operativos separados; formulario de nuevo ciclo no los captura.
12. **Persistencia e interfaz:** No hay columnas para consecutivo interno/número físico ni secuencia para ciclo identificada; debe actualizar API, formulario, consultas y documentos.
13. **Brecha asociada:** `B-PLA-004` abierta; faltan ambos identificadores operativos.
14. **Preguntas abiertas:** Formato/secuencia, reinicio por año, retroactividad, cambios de equipo, reprocesos sucesivos, normalización y tratamiento de identificadores históricos en `RA-PLA-005`.
15. **Cobertura preliminar:** Faltante para identificación de negocio/física; la clave DB no cubre el número registrado en máquina.
16. **Certeza y límites:** Datos actuales revisados en entidad, DTO y formulario; reglas y ejemplo provienen de respuestas de negocio citadas. No se fijan formatos definitivos; borrador.

---
id: RF-PLA-002
titulo: Crear ciclos y asociar órdenes
tipo: RF
modulo: Planta
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, Planta; §6, reglas operativas"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 5, respuestas 61–64; src/planta/; SterinovaFrontend/src/app/(erp)/planta/ciclo/nuevo/page.tsx"
depende_de: [RF-LOG-004, RF-PLA-001]
bloquea: [RF-PLA-006, RF-PLA-010]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-LOG-013 sigue asignada a RF-PLA-006; B-PLA-004 se deriva a RF-PLA-010 y las políticas de numeración a RA-PLA-005."
---

# RF-PLA-002 — Crear ciclos y asociar órdenes

**Fuente principal:** `Sterinova-ERP.md` §3, Planta, creación de ciclos y asociación de varias órdenes.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 5, respuestas 61–64; entidades, DTO, servicio/controlador del backend y formulario de creación del frontend.

1. **ID:** `RF-PLA-002`.
2. **Título:** Crear ciclos y asociar órdenes.
3. **Tipo:** RF.
4. **Módulo:** Planta.
5. **Descripción funcional:** Crear un ciclo con materiales trazables de una o más órdenes elegibles, guardar cantidades procesadas y mantener los vínculos necesarios para seguimiento y calidad.
6. **Reglas de negocio asociadas:** El anexo §3 pide asociación de varias órdenes a un ciclo y distribución de una orden entre varios ciclos. Reglas maestras M5 respuestas 62–63: ciclos multiorden y asignación por materiales/cantidades; respuesta 64 prohíbe cambiar el método contratado. Respuesta 61 distingue consecutivo interno y número físico de ciclo.
7. **Actores y permisos:** Operador autenticado con `planta.ciclos.crear`. El controlador protege `POST /planta/ciclos` con ese permiso.
8. **Datos y relaciones:** `CicloEsterilizacion` tiene un único `orden_id`; `CicloMaterialProcesado` relaciona ciclo y línea de material de esa orden y almacena `cantidad_procesada`. El DTO recibe un `orden_id`, no una colección de órdenes.
9. **Precondiciones y postcondiciones:** El backend exige orden `EN_PLANTA`, operador existente, método coincidente con orden y protocolo compatible. En transacción guarda ciclo, cantidades procesadas, estado de la orden y evento de procesamiento. No soporta varias órdenes en la misma transacción del ciclo.
10. **Criterios de aceptación:** (a) Crear ciclo con una o varias órdenes elegibles. (b) Asociar cada material y cantidad a su orden de origen. (c) Distribuir una orden en varios ciclos sin exceder saldos. (d) Mantener el método contratado. (e) Conservar identificador interno y número físico de ciclo de acuerdo con política aprobada.
11. **Evidencia en backend:** `CicloEsterilizacion.orden_id` y `CreateCicloDto.orden_id` son escalares. `PlantaService.createCiclo` valida `orden.metodo_esterilizacion ?? metodoOrden(quote.tipo_servicio)` contra `dto.metodo` y rechaza discrepancias. El ciclo usa el `id` generado por BD como clave técnica.
12. **Evidencia en BD y frontend:** `CicloMaterialProcesado` guarda líneas vinculadas a un solo ciclo y material de orden. El formulario `planta/ciclo/nuevo/page.tsx` publica un único `orden_id`; el identificador `CIC-AAAA-NNN` y el número físico de máquina no están en su payload ni en la entidad actual. La BD no se inspeccionó directamente.
13. **Brechas derivadas:** El soporte multiorden ya se mantiene en `B-LOG-013` → `RF-PLA-006`. `B-PLA-004` (falta de consecutivo de negocio y número físico) se deriva a `RF-PLA-010`. Esta ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** Formato, reinicio y año aplicable del consecutivo; unicidad/formato del número físico; tratamiento de registros retroactivos. Se derivan a `RA-PLA-005`.
15. **Estado de cobertura:** Parcial. El ciclo de una orden conserva cantidades y bloquea el cambio de método contratado; multiorden y numeración operativa no están implementados.
16. **Nivel de certeza y límites:** Confirmado en fuentes versionadas, servicio, entidades, DTO y formulario revisados. No se verificó una BD desplegada.

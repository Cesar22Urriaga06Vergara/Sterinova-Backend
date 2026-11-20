---
id: RF-PLA-001
titulo: Registrar equipos y disponibilidad
tipo: RF
modulo: Planta
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, Planta; §6, reglas operativas"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 5, respuestas 58–60; src/planta/"
depende_de: []
bloquea: [RF-PLA-007, RF-PLA-008, RF-PLA-009]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-PLA-001 se deriva a RF-PLA-007; B-PLA-002 a RF-PLA-008; B-PLA-003 a RF-PLA-009; las políticas pendientes se derivan a RA-PLA-004."
---

# RF-PLA-001 — Registrar equipos y disponibilidad

**Fuente principal:** `Sterinova-ERP.md` §3, gestión de equipos EtO, vapor y lavandería; §6, regla «Un equipo no disponible no puede utilizarse».

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 5, respuestas 58–60; entidades, DTO y servicio en `src/planta/`.

1. **ID:** `RF-PLA-001`.
2. **Título:** Registrar equipos y disponibilidad.
3. **Tipo:** RF.
4. **Módulo:** Planta.
5. **Descripción funcional:** Mantener catálogo de equipos con identificador trazable, tipo/método, capacidad, ubicación y disponibilidad; impedir programar o registrar ciclos con equipo inhabilitado.
6. **Reglas de negocio asociadas:** El anexo exige gestionar equipos EtO, vapor y lavandería y prohíbe utilizar equipos no disponibles. Las respuestas 59–60 de reglas maestras hacen obligatorio el catálogo de esterilización, con código único, método EtO/Vapor, capacidad, ubicación y estados Operativo/Mantenimiento/Fuera de Servicio. Calibración vencida, mantenimiento y Fuera de Servicio impiden programación/uso. Solo Calidad o Jefe de Planta puede reactivar después de cargar certificado. La clasificación de lavandería y las unidades de capacidad permanecen sin definir.
7. **Actores y permisos:** Jefe de Planta y Calidad administran catálogo/reactivación; operador de Planta selecciona equipo habilitado al registrar operación. Los permisos técnicos concretos se deben alinear con RBAC.
8. **Datos y entidades:** No se encontró entidad `Equipo` en `src/planta/`. `CicloEsterilizacion` persiste `equipo` como texto libre de hasta 100 caracteres y `metodo` como enum `ETO`/`VAPOR`; el estado del ciclo describe el proceso, no la disponibilidad del activo.
9. **Precondiciones y postcondiciones:** Requisito esperado: equipo del catálogo compatible, operativo y con calibración vigente. Implementación actual: al crear ciclo valida orden `EN_PLANTA`, operador existente, método de orden y protocolo compatible; guarda el texto de equipo sin consultar catálogo, disponibilidad o capacidad.
10. **Criterios de aceptación:** (a) Administrar equipos por catálogo con código único, tipo/método, capacidad, ubicación y estado. (b) Seleccionarlos por identificador al programar/crear ciclo. (c) Bloquear equipo en mantenimiento, fuera de servicio o con calibración vencida. (d) Restringir administración/reactivación y registrar certificado y actor. (e) Validar la carga respecto de capacidad en unidades definidas por tipo. (f) Modelar lavandería sin forzarla al ciclo EtO/Vapor.
11. **Evidencia en backend:** `src/planta/entities/ciclo-esterilizacion.entity.ts` define `equipo: varchar(100)` y enum `MetodoEsterilizacion` solo EtO/Vapor. `src/planta/dto/create-ciclo.dto.ts` exige string no vacío. `src/planta/planta.service.ts`, `createCiclo`, valida orden/método/protocolo/cantidades, pero no disponibilidad ni capacidad del equipo.
12. **Evidencia en BD y documentación técnica:** No hay entidad/relación de catálogo en el módulo Planta; el ciclo no enlaza un activo ni conserva estado/capacidad/ubicación/calibración de este. La ausencia de calibración o capacidad en el modelo de ciclo no demuestra cómo esté configurada una BD desplegada; esta ficha contrasta el código versionado.
13. **Brechas derivadas:** `B-PLA-001` se asigna a `RF-PLA-007` (catálogo y tipos de equipos); `B-PLA-002` a `RF-PLA-008` (disponibilidad, mantenimiento y calibración); `B-PLA-003` a `RF-PLA-009` (validación de capacidad). Esta ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** Se derivan a `RA-PLA-004`: política/clasificación de equipos de lavandería; unidades y criterios de capacidad; metadatos, vigencia y evidencia de calibración; roles operativos para programación, administración y reactivación.
15. **Estado de cobertura:** Parcial. El ciclo almacena una etiqueta de equipo, pero no hay catálogo, estado operativo, bloqueo por mantenimiento/calibración ni control de capacidad.
16. **Nivel de certeza y límites:** Confirmado en fuente contractual, reglas maestras y código consultado. No se certifica el estado de una base desplegada ni se modificó código o esquema.

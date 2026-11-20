---
id: RF-PLA-004
titulo: Registrar parámetros, evidencias y protocolos
tipo: RF
modulo: Planta / Calidad
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: 2026-11-18
validador: usuario
fuente_principal: "Sterinova-ERP.md §3 y §5"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 5, respuestas 65–66 y 73–75; src/planta/; src/calidad/; src/certificados/"
depende_de: [RF-PLA-002]
bloquea: [RF-PLA-012, RF-PLA-013]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-PLA-006 se deriva a RF-PLA-012; B-PLA-007 a RF-PLA-013; políticas de evidencia/formato a RA-PLA-007."
---

# RF-PLA-004 — Registrar parámetros, evidencias y protocolos

**Fuente principal:** `Sterinova-ERP.md` §3, registro de parámetros/evidencias; §5, trazabilidad de parámetros registrados y protocolo utilizado.

**Fuente de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 5, respuestas 65–66 y 73–75; entidades, DTO y servicios de Planta, Calidad y Certificados.

1. **ID:** `RF-PLA-004`.
2. **Título:** Registrar parámetros, evidencias y protocolos.
3. **Tipo:** RF.
4. **Módulo:** Planta / Calidad.
5. **Descripción funcional:** Registrar mediciones y controles por ciclo, guardar referencia de la versión de protocolo aplicada, permitir evaluación posterior por Calidad y adjuntar evidencia documental del proceso.
6. **Reglas de negocio asociadas:** Mediciones deben compararse con el protocolo aplicable; la evaluación y liberación requieren decisión explícita de Calidad. El certificado conserva valores, especificaciones y evaluación. Reglas maestras requieren evidencias BI/CI y archivos PDF/CSV de máquina, gráficos y fotografías. `NO_APLICA` requiere justificación y cambios de resultado `NO_CUMPLE` exigen desviación y aprobación.
7. **Actores y permisos:** Operador registra el ciclo; Calidad evalúa, aprueba o rechaza. Aprobación requiere `calidad.aprobar`, contraseña confirmatoria y actor distinto del operador.
8. **Datos y entidades:** `CicloEsterilizacion` guarda temperatura, humedad, presión, tiempos como columnas numéricas; controles biológico/químico como texto; protocolo por `protocolo_version_id`. `CicloParametroEvaluacion` guarda nombre del parámetro, criterio, evaluador y fecha, pero no la medición numérica.
9. **Flujo y precondiciones:** En creación, Planta selecciona versión explícita o la última del método, valida parámetros aplicables y guarda su FK. Calidad consulta el ciclo y protocolo; la aprobación coteja mediciones con rangos y registra evaluaciones, estado, auditoría y certificado. No se encontró flujo para adjuntar evidencias de máquina al ciclo.
10. **Criterios de aceptación:** (a) Conservar mediciones estructuradas con unidades/rangos del protocolo. (b) Mantener la versión exacta del protocolo usada. (c) Registrar evaluación, actor y fecha de Calidad. (d) Bloquear certificado ordinario ante incumplimiento. (e) Adjuntar archivos de evidencia al ciclo/material con autor y fecha. (f) Exigir justificación de `NO_APLICA` y manejar desviaciones sin sobrescribir el resultado original.
11. **Evidencia en backend:** `ciclo-esterilizacion.entity.ts` define campos numéricos y controles textuales. `protocolo-esterilizacion-version.entity.ts` conserva versión y especificaciones JSON. `planta.service.ts` fija `protocolo_version_id`. `calidad.service.ts` evalúa y persiste criterios; `certificados/informacion-tecnica.ts` compara datos con rangos y arma la información técnica.
12. **Evidencia en BD y frontend:** Hay relación FK ciclo→versión de protocolo y registro evaluador/fecha; no hay campo ni endpoint de carga de archivos en los módulos revisados. `NO_APLICA` no incluye justificación en DTO/entidad de evaluación. El certificado genera snapshot técnico al aprobar, no sustituye los archivos fuente de máquina requeridos como evidencia.
13. **Brechas derivadas:** `B-PLA-006` se deriva a `RF-PLA-012` para adjuntos de evidencia; `B-PLA-007` a `RF-PLA-013` para justificar `NO_APLICA`. Esta ficha queda con `brechas: []` por derivación aprobada.
14. **Preguntas abiertas:** Tipos, obligatoriedad por proceso, tamaño, formatos aceptados y retención de evidencias se derivan a `RA-PLA-007`. También requiere definición operativa la justificación por parámetro no aplicable y el flujo de desviaciones.
15. **Estado de cobertura:** Parcial. Mediciones numéricas, referencia de protocolo y evaluación de Calidad existen; faltan adjuntos de evidencia y justificación de `NO_APLICA`.
16. **Nivel de certeza y límites:** Confirmado en fuentes y código versionado revisados. No se verificó el contenido de una base desplegada ni se certificó inmutabilidad física del JSON del protocolo.

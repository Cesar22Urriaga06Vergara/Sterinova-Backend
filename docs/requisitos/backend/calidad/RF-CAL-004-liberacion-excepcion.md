---
id: RF-CAL-004
titulo: Autorizar liberaciones por excepción con evidencia
tipo: RF
modulo: Calidad
estado: faltante
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §6"
fuente_contraste: "docs/negocio/reglas-maestras.md, Módulo 6, respuestas 77 y 80; src/calidad/; src/certificados/; src/rbac/"
depende_de: [RF-CAL-001, RF-CAL-003]
bloquea: [RF-CAL-010, RA-CAL-003]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Faltante. B-CAL-006 deriva a RF-CAL-010 y RA-CAL-003."
---

# RF-CAL-004 — Autorizar liberaciones por excepción con evidencia

**Fuente principal:** `Sterinova-ERP.md` §3 (liberación por excepción, confirmación mediante contraseña) y §6 (aprobación de Calidad previa al despacho).

**Fuentes de contraste:** `docs/negocio/reglas-maestras.md`, Módulo 6, respuestas 77 y 80; servicios de Calidad/Certificados y permisos RBAC.

1. **ID:** `RF-CAL-004`.
2. **Título:** Autorizar liberaciones por excepción con evidencia.
3. **Tipo:** RF.
4. **Módulo:** Calidad.
5. **Descripción funcional:** Permitir liberación excepcional documentada cuando una desviación impide la aprobación ordinaria, con análisis de riesgo, responsables y evidencia, preservando medición y decisión originales.
6. **Reglas asociadas:** Fallo crítico bloquea certificado ordinario; liberación por desviación requiere análisis de riesgo y firma del Director Técnico; conservar marca “Liberado por Desviación”; mantener aprobaciones independientes que correspondan y confirmar mediante contraseña.
7. **Actores y permisos:** RBAC declara `calidad.liberacion_desviacion.autorizar` y `calidad.liberacion_condicionada.autorizar`; no se halló flujo que los consuma. Autoridades concretas y relación con doble aprobación deben respetar RA-CAL-003.
8. **Datos y entidades:** No se identificó entidad para autorización excepcional, análisis de riesgo, desviación asociada, evidencia, aprobadores o marca de liberación.
9. **Flujo:** El proceso ordinario evalúa parámetros y bloquea aprobación si valor/evaluación incumple. No existe ruta alternativa para liberar mediante excepción.
10. **Criterios de aceptación:** Registrar desviación, riesgo, justificación y evidencia; exigir las firmas/confirmaciones aprobadas; preservar resultado no conforme; emitir documento con marca explícita; auditar usuario, cargo, fecha/hora e IP; impedir despacho sin autorización válida.
11. **Evidencia en backend:** `prepararInformacionTecnica` rechaza valores fuera de rango o sin `CUMPLE`. `CalidadService.aprobar` requiere password para aprobación normal, sin override de desviación. No se encontró endpoint de liberación excepcional.
12. **Persistencia e interfaz:** No hay entidad, DTO, endpoint ni pantalla de autorización excepcional; solo permisos RBAC declarados y auditoría de acciones ordinarias.
13. **Brechas derivadas:** `B-CAL-006` se asigna a `RF-CAL-010` para el flujo técnico y `RA-CAL-003` para política de liberación/firmas. Ficha sin brechas propias por derivación aprobada.
14. **Preguntas abiertas:** Diferenciar liberación condicionada de liberación por desviación; definir criterios de elegibilidad, cargos equivalentes/no equivalentes, evidencia y número de aprobadores. Derivadas a `RA-CAL-003`.
15. **Estado de cobertura:** Faltante. Hay bloqueo ordinario y contraseña para aprobación normal, pero no autorización excepcional.
16. **Certeza y límites:** Confirmado en servicio de Calidad, evaluador técnico, controladores y catálogo RBAC inspeccionados. No se verificó BD desplegada ni se ejecutaron pruebas.

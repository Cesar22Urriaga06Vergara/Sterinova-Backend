---
id: RA-CAL-003
titulo: Políticas de liberación por excepción y firmas
tipo: RA
modulo: Calidad / Certificados / Logística
estado: pendiente-de-decision
certeza: pendiente-de-decision
version: 0.1
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, §6; docs/negocio/reglas-maestras.md, Módulo 6, respuestas 77 y 80"
fuente_contraste: "RF-CAL-004; RF-CAL-010; src/rbac/permission-catalog.ts"
depende_de: [RF-CAL-004]
bloquea: [RF-CAL-010]
brechas: [B-CAL-006]
historial:
  - version: 0.1
    nota: "Decisión de negocio derivada de B-CAL-006."
---

# RA-CAL-003 — Políticas de liberación por excepción y firmas

## Preguntas de negocio

1. ¿Qué condiciones permiten liberación condicionada y cuáles liberación por desviación? ¿Son vías distintas?
2. ¿Qué parámetros críticos o tipos de incumplimiento son elegibles para excepción y cuál exige rechazo/reproceso?
3. ¿Qué cargos deben autorizar: Director Técnico, Gerente de Calidad, Jefe de Calidad u otros? ¿Cuándo se requieren aprobaciones independientes múltiples?
4. ¿Qué análisis de riesgo, evidencias y firmas/confirmaciones por contraseña son obligatorios, y qué texto/leyenda debe aparecer en el certificado?
5. ¿Qué efecto tiene una excepción sobre el despacho, seguimiento posterior y cierre de CAPA?

## Impacto

La decisión controla quién puede liberar producto no conforme, cómo se evita normalizar el incumplimiento y qué soporte documental necesita el certificado y la entrega. No se asumen equivalentes cargos ni tipos de liberación.

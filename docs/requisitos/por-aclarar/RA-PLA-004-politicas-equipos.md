---
id: RA-PLA-004
titulo: Políticas de equipos, calibración y capacidad
tipo: RA
modulo: Planta / Calidad
estado: pendiente-de-decision
certeza: pendiente-decision
version: 1.0
fecha_creacion: 2026-11-18
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3 y §6; docs/negocio/reglas-maestras.md, Módulo 5, respuestas 58–60"
fuente_contraste: "RF-PLA-001; RF-PLA-007; RF-PLA-008; RF-PLA-009"
depende_de: [RF-PLA-007, RF-PLA-008, RF-PLA-009]
bloquea: []
brechas: []
historial:
  - version: 1.0
    nota: "Decisión derivada de RF-PLA-001; precisa lavandería, calibración y capacidad antes del diseño detallado."
---

# RA-PLA-004 — Políticas de equipos, calibración y capacidad

## Preguntas para negocio, Planta y Calidad

1. ¿Qué clases, atributos y flujo de estados aplican a los equipos de lavandería? ¿Se administrarán en el mismo catálogo que EtO/Vapor o como tipo independiente?
2. ¿Qué unidades y método de cálculo de capacidad se aplican a cada equipo y proceso? ¿Qué atributos de los materiales permiten computar la carga?
3. ¿Qué certificado y metadatos acreditan calibración vigente, quién puede cargarlos y qué periodicidad aplica? Las reglas existentes no fijan vigencias ni criterios de aceptación.
4. ¿Quién programa o asigna un equipo además de los roles autorizados para administrarlo/reactivarlo?

## Contexto

Las reglas maestras requieren catálogo, capacidad, estado operativo y bloqueo por mantenimiento/calibración. El código actual solo persiste el nombre de equipo en el ciclo. Las respuestas de negocio dejan pendientes las unidades de capacidad y la clasificación de lavandería.

---
id: RNF-OPS-001
titulo: Preparación y operación del ERP en producción
tipo: RNF
modulo: Operación / Infraestructura / Transversal
estado: borrador
certeza: confirmado
version: 0.1
fecha_creacion: 2026-11-20
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §8: Despliegue y operación completa en producción"
fuente_contraste: "docs/CONTEXTO_RAPIDO.md; docs/arquitectura/; docs/manuales/; backend y frontend"
depende_de: []
bloquea: []
brechas: [B-OPS-001]
historial:
  - version: 0.1
    nota: "Borrador creado para hacer trazable el pendiente explícito de producción en §8. Los criterios operativos y objetivos de servicio no están definidos ni aprobados."
---

# RNF-OPS-001 — Preparación y operación del ERP en producción

**Estado:** Borrador de alcance; pendiente de inventario técnico, criterios de aceptación y validación.

1. **ID:** `RNF-OPS-001`.
2. **Título:** Preparación y operación del ERP en producción.
3. **Tipo:** RNF.
4. **Módulo:** Operación / Infraestructura / Transversal.
5. **Descripción:** Definir y demostrar las condiciones bajo las cuales backend, frontend, datos, almacenamiento y servicios dependientes pueden desplegarse y operarse en el entorno productivo acordado.
6. **Reglas asociadas:** El anexo §8 declara pendiente el despliegue y operación completa en producción; no declara que el proyecto esté en producción ni define un nivel de servicio.
7. **Actores / responsables:** Propietario del sistema, responsables técnicos y responsables de operación/soporte por identificar.
8. **Componentes implicados:** Aplicaciones backend y frontend, base de datos, almacenamiento de archivos/PDF, configuración y secretos, integraciones, observabilidad, respaldos y procedimientos operativos; existencia y configuración real por verificar.
9. **Flujo operativo a definir:** Preparar ambiente → desplegar versión → validar salud y dependencias → habilitar uso → monitorear → atender incidente/restaurar o revertir según procedimientos aprobados.
10. **Criterios de aceptación preliminares:** Definir y validar lista de ambientes, estrategia de despliegue y reversa, monitoreo/alertas, respaldo y restauración, respuesta a incidentes, responsables, objetivos de recuperación y criterios de salida a producción. No se asignan valores de disponibilidad, RTO/RPO ni ventanas sin decisión.
11. **Evidencia técnica disponible:** El anexo §8 declara que la operación completa en producción es pendiente. Esta ficha no verificó despliegues, configuración de nube, entornos productivos ni capacidad de recuperación.
12. **Persistencia e infraestructura:** Arquitectura, configuración de producción, topología, retención de datos, respaldos, recuperación y dependencias externas requieren inventario y verificación.
13. **Brecha:** `B-OPS-001` registra que el anexo declara pendiente el despliegue/operación productiva y que no existe en este paquete un criterio de salida de producción aprobado.
14. **Preguntas abiertas:** ¿Qué ambientes se requieren? ¿Quién opera y responde? ¿Qué disponibilidad, recuperación, respaldo, retención, monitoreo y seguridad se exigen? ¿Qué aprobaciones y controles son necesarios para el go-live?
15. **Estado de cobertura:** No evaluado; el documento solo formaliza el pendiente del anexo. No se emite juicio sobre la infraestructura actual.
16. **Certeza y límites:** Confirmado que §8 lista este tema como pendiente. Requisitos concretos y estado de la infraestructura se deben levantar con responsables técnicos y operativos; no se inspeccionó producción.

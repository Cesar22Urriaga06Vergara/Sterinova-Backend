---
id: RF-CER-001
titulo: Emitir certificados por orden y cliente
tipo: RF
modulo: Certificados / Calidad
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §6"
fuente_contraste: "src/certificados/; src/planta/; src/database/migrations/"
depende_de: [RF-CAL-001, RF-PLA-002]
bloquea: [RF-CER-004, RA-CER-001]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-CER-001 se deriva a RF-CER-004; política a RA-CER-001."
---

# RF-CER-001 — Emitir certificados por orden y cliente

**Fuente principal:** `Sterinova-ERP.md` §3 y §6: emisión por orden/cliente; ciclo compartido produce certificados independientes por cliente.

**Fuentes de contraste:** servicios y entidad de Certificados, ciclo de Planta y migración de unicidad.

1. **ID:** `RF-CER-001`.
2. **Título:** Emitir certificados por orden y cliente.
3. **Tipo:** RF.
4. **Módulo:** Certificados / Calidad.
5. **Descripción funcional:** Emitir un certificado por cada cliente y orden representados en un ciclo, preservando asociación y contenido documental por cliente.
6. **Reglas asociadas:** Ciclo compartido entre clientes requiere certificados separados; aprobación de Calidad inicia la emisión y el PDF debe conservar datos congelados.
7. **Actores y permisos:** Calidad aprueba; el flujo de aprobación exige permiso y contraseña. Consulta/descarga del certificado requiere sus permisos RBAC.
8. **Datos y entidades:** Certificado se relaciona con ciclo y orden; cliente se deriva de orden→cotización→cliente. No existe relación directa ciclo/cliente de cardinalidad múltiple.
9. **Flujo:** `CalidadService.aprobar` llama una vez a `emitirDesdeCiclo`; este obtiene un único cliente de la orden, resuelve su formato y crea un documento.
10. **Criterios de aceptación:** Emitir un documento separado por cliente cuando compartan ciclo; cada certificado debe identificar cliente, órdenes/materiales correspondientes y ciclo, con formato/consecutivo independiente.
11. **Evidencia del backend:** `emitirDesdeCiclo` lee `ciclo.orden.cotizacion.cliente` y genera un solo certificado por invocación.
12. **Persistencia y BD:** `ciclo_id` es `OneToOne` y tiene índice/constraint único `UQ_certificados_ciclo_id`, impidiendo más de un certificado por ciclo.
13. **Brechas derivadas:** `B-CER-001` se asigna a `RF-CER-004`; partición por cliente y agrupación se deriva a `RA-CER-001`. Frontmatter sin brechas propias por derivación aprobada.
14. **Preguntas abiertas:** Definir asociación de materiales/cantidades por cliente dentro del ciclo compartido y reglas del formato/consecutivo; quedan en `RA-CER-001`.
15. **Estado de cobertura:** Parcial. Flujo emite para el único cliente de la orden; no soporta cliente múltiple en ciclo ni múltiples certificados por ciclo.
16. **Certeza y límites:** Confirmado en servicio, entidad y migración inspeccionados; no se verificó BD desplegada.

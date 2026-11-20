---
id: RF-CER-004
titulo: Soporte de certificados múltiples para ciclos compartidos
tipo: RF
modulo: Certificados / Planta
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, §6"
fuente_contraste: "src/certificados/entities/certificado-esterilizacion.entity.ts; src/database/migrations/1730750401000-AddQualityCertificates.ts"
depende_de: [RF-CER-001, RA-CER-001]
bloquea: []
brechas: [B-CER-001]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-CER-001."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos; la partición de materiales/cantidades continúa pendiente en RA-CER-001."
---

# RF-CER-004 — Soporte de certificados múltiples para ciclos compartidos

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-CER-004`.
2. **Título:** Soporte de certificados múltiples para ciclos compartidos.
3. **Tipo:** RF.
4. **Módulo:** Certificados / Planta / Calidad.
5. **Descripción funcional:** Emitir certificados separados para cada cliente cubierto por un mismo ciclo compartido y relacionar cada documento con su ciclo, orden, cliente y materiales/cantidades que ampara.
6. **Reglas asociadas:** El certificado de un cliente no debe incluir materiales de otro; conservar snapshot y PDF por documento; no alterar el ciclo histórico. Método de partición de cantidades debe ser el acordado en `RA-CER-001`.
7. **Actores / permisos:** Calidad/usuarios autorizados para aprobar y emitir; consulta/descarga por permisos de Certificados y ámbito del ciclo. La responsabilidad de generar documentos separados debe ser idempotente.
8. **Datos y entidades:** `CertificadoEsterilizacion` con `ciclo_id`, `orden_id`, aprobador, snapshot, token, PDF/hash; relaciones ciclo/orden/cliente y líneas de materiales procesados. El vínculo cliente-documento debe hacerse explícito o ser inequívocamente reconstruible.
9. **Flujo preliminar:** Identificar clientes/órdenes del ciclo → determinar materiales/cantidades de cada cliente conforme a política → emitir un documento por cliente → persistir snapshot, consecutivo, token y PDF independientes.
10. **Criterios de aceptación preliminares:** Un ciclo con N clientes permite N certificados identificables; cada certificado contiene solo la partición asignada; cada documento tiene token y artefacto propios; reintentos no duplican certificados sin control; consultas respetan ámbito.
11. **Evidencia en backend:** La entidad usa `OneToOne` desde certificado a ciclo; la migración añade `UQ_certificados_ciclo_id`. El servicio `emitirDesdeCiclo` crea un certificado por ciclo y deriva cliente desde la orden/cotización asociada.
12. **Persistencia e interfaz:** `snapshot_datos` captura un cliente y materiales de la orden; la interfaz de certificados no presenta partición multi-cliente. Esquema y UX para varios clientes están por diseñar.
13. **Brecha asociada:** `B-CER-001` abierta; el modelo actual no admite certificados independientes para varios clientes del mismo ciclo.
14. **Preguntas abiertas:** `RA-CER-001` debe definir cómo asociar órdenes/clientes al ciclo y distribuir materiales/cantidades, además de tratamiento de casos sin partición inequívoca.
15. **Cobertura preliminar:** Faltante para ciclos compartidos; la emisión ordinaria para un ciclo/cliente sí existe.
16. **Certeza y límites:** La restricción se confirmó en entidad y migración citadas, y la emisión en `CertificadosService`. No se establece un algoritmo de partición sin decisión; ficha en borrador.

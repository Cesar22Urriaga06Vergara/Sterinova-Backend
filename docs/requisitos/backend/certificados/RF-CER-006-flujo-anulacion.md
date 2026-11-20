---
id: RF-CER-006
titulo: Implementar flujo de anulación y reemplazo de certificados
tipo: RF
modulo: Certificados
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3"
fuente_contraste: "src/certificados/certificados.controller.ts; src/certificados/certificados.service.ts; src/certificados/entities/certificado-esterilizacion.entity.ts"
depende_de: [RF-CER-003, RA-CER-002]
bloquea: []
brechas: [B-CER-003]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-CER-003."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos; distingue la validación pública existente del flujo administrativo ausente."
---

# RF-CER-006 — Implementar flujo de anulación y reemplazo de certificados

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-CER-006`.
2. **Título:** Implementar flujo de anulación y reemplazo de certificados.
3. **Tipo:** RF.
4. **Módulo:** Certificados.
5. **Descripción funcional:** Permitir anular un certificado con autorización y motivo, conservando el registro y documento originales, y emitir un nuevo certificado de reemplazo relacionado cuando la política lo permita.
6. **Reglas asociadas:** Nunca borrar ni modificar silenciosamente el documento original; el reemplazo es un registro nuevo con vínculo explícito y referencia al motivo. La consulta pública debe mostrar estado vigente/anulado coherente.
7. **Actores / permisos:** Actor de Calidad/administración documental autorizado, con separación de funciones y permisos definidos en `RA-CER-002`; consulta pública solo mediante token y datos publicados permitidos.
8. **Datos y entidades:** Certificado original, estado, motivo, actor/fecha, aprobador, relación reemplaza/reemplazado-por, snapshots, versiones, PDF/hash y token de validación.
9. **Flujo preliminar:** Solicitar anulación → validar autoridad/justificación → registrar decisión conservando original → emitir reemplazo como nuevo documento si procede → actualizar validez pública de original y reemplazo.
10. **Criterios de aceptación preliminares:** Anulación no elimina original ni invalida su evidencia histórica; reemplazo queda enlazado y no comparte token/identidad documental; consulta pública identifica estado; acciones quedan auditadas; operación no autorizada se rechaza.
11. **Evidencia en backend:** El controlador solo expone consultas, descarga y validación pública. `validarToken` interpreta estado `Anulado`, pero no existe ruta/servicio para cambiar estado o crear reemplazo.
12. **Persistencia e interfaz:** La entidad tiene campo `estado`, snapshot, PDF/hash y token, pero no relación de reemplazo ni historial de decisión; la interfaz no expone anulación o reemplazo.
13. **Brecha asociada:** `B-CER-003` abierta; se deriva el flujo ausente a este requisito.
14. **Preguntas abiertas:** `RA-CER-002` debe definir motivos, quién solicita/aprueba, doble aprobación, documentos sustitutos, estados, validez del token original y conservación.
15. **Cobertura preliminar:** Parcial: consulta pública contempla un estado anulado, pero faltan las mutaciones y el vínculo de reemplazo.
16. **Certeza y límites:** Confirmado en controlador, servicio y entidad revisados; no se verificó operación desplegada. La política de anulación/reemplazo no se infiere; borrador.

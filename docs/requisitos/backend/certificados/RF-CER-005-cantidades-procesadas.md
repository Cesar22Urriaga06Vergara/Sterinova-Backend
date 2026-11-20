---
id: RF-CER-005
titulo: Corrección de cantidades procesadas en snapshot de certificado
tipo: RF
modulo: Certificados / Planta
estado: borrador
certeza: confirmado
version: 0.2
fecha_creacion: 2026-11-19
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3, §7"
fuente_contraste: "src/certificados/certificados.service.ts; src/planta/entities/ciclo-material-procesado.entity.ts"
depende_de: [RF-CER-002, RA-CER-001]
bloquea: []
brechas: [B-CER-002]
historial:
  - version: 0.1
    nota: "Borrador derivado de B-CER-002."
  - version: 0.2
    nota: "Se amplía como ficha técnica preliminar de 16 campos, separando cantidad del ciclo de cantidad total de la orden."
---

# RF-CER-005 — Corrección de cantidades procesadas en snapshot de certificado

**Estado:** Borrador, pendiente de validación.

1. **ID:** `RF-CER-005`.
2. **Título:** Corrección de cantidades procesadas en snapshot de certificado.
3. **Tipo:** RF.
4. **Módulo:** Certificados / Planta.
5. **Descripción funcional:** El snapshot del certificado debe declarar la cantidad efectivamente procesada en el ciclo certificado, no la cantidad total ordenada o recibida cuando el trabajo se distribuyó entre ciclos.
6. **Reglas asociadas:** Conservar material, lote, unidad, orden/cliente y cantidad del ciclo; no duplicar cantidades de otros ciclos; los ciclos rechazados/abortados y reprocesos siguen `RF-PLA-011` y políticas de `RA-PLA-006`.
7. **Actores / permisos:** Emisión por Calidad tras la aprobación del ciclo; el consumidor del certificado consulta el snapshot autorizado.
8. **Datos y entidades:** `CicloMaterialProcesado` (`ciclo_id`, `orden_servicio_material_id`, `cantidad_procesada`) vincula ciclo y línea de orden; snapshot `CertificadoEsterilizacion.snapshot_datos.materiales` incluye material/lote/cantidad.
9. **Flujo:** Obtener las líneas procesadas del ciclo → resolver datos del material/orden → validar suma y pertenencia → congelar en snapshot → generar PDF/hash dentro de la emisión.
10. **Criterios de aceptación preliminares:** Para órdenes repartidas entre ciclos, cada certificado muestra solo las cantidades del ciclo correspondiente; suma de snapshots no excede material recibido/ordenado; el PDF reproduce exactamente el snapshot persistido; el total de orden no se presenta como procesado por un ciclo.
11. **Evidencia en backend:** `CertificadosService.emitirDesdeCiclo` construye `materiales` desde `ciclo.orden.materiales` y copia `cantidad` de cada línea. No consulta `ciclos_materiales_procesados`, aunque esa entidad conserva cantidades por ciclo.
12. **Persistencia e interfaz:** Snapshot JSON y PDF/hash existen; el registro por ciclo/material está persistido, pero no se usa al construir el snapshot en el código revisado.
13. **Brecha asociada:** `B-CER-002` abierta; el documento puede atribuir al ciclo toda la cantidad de la línea de orden.
14. **Preguntas abiertas:** Definir partición por cliente en ciclos compartidos (`RA-CER-001`), redondeo/unidad, casos de líneas históricas sin registros de cantidad y tratamiento de corrección/reemisión.
15. **Cobertura preliminar:** Parcial: hay snapshot y cantidades efectivas por ciclo en persistencia, pero la consulta que alimenta el certificado usa cantidad de orden.
16. **Certeza y límites:** Confirmado en `CertificadosService` y `CicloMaterialProcesado`. No se verificaron datos desplegados ni reconciliación histórica; diseño de reparación queda pendiente.

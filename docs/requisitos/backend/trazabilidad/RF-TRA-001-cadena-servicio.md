---
id: RF-TRA-001
titulo: Reconstrucción de la cadena cliente-cotización-operación-certificado-entrega
tipo: RF / Trazabilidad
modulo: Transversal: Comercial, Logística, Planta y Certificados
estado: parcial
certeza: confirmado
version: 1.1
fecha_creacion: 2026-11-20
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §3 Certificados; §5 Trazabilidad"
fuente_contraste: "src/ordenes-servicio/entities/; src/planta/entities/; src/certificados/entities/; src/logistica/"
depende_de: []
bloquea: []
brechas: [B-TRA-001]
historial:
  - version: 1.0
    nota: "Análisis técnico presentado en chat y recontrastado con ambos repositorios el 2026-11-20; pendiente de validación explícita de la ficha."
  - version: 1.1
    nota: "Se precisa que la entidad Entrega declarada no está conectada al flujo operativo revisado y se detallan los enlaces aún incompletos."
---

# RF-TRA-001 — Reconstrucción de la cadena cliente–cotización–operación–certificado–entrega

**Fuente principal:** `Sterinova-ERP.md` §5, Trazabilidad, que enumera doce elementos reconstruibles desde el cliente y la cotización hasta materiales entregados/devueltos y responsables; §3, Certificados, que exige asociación por orden/cliente, materiales de varios ciclos y certificados separados para clientes de ciclos compartidos.

**Fuentes de contraste:** entidades de orden, eventos, ciclos, certificados y entregas; consultas de Certificados y Logística.

1. **ID:** `RF-TRA-001`.
2. **Título:** Reconstrucción de la cadena cliente–cotización–operación–certificado–entrega.
3. **Tipo:** RF / Trazabilidad.
4. **Módulo:** Transversal: Comercial, Logística, Planta y Certificados.
5. **Descripción funcional:** Reconstruir quién solicitó el servicio, cotización de origen, materiales recibidos y lotes/cantidades que llegaron a Planta, tanda/ciclo, parámetros/protocolo, decisiones de Calidad, aprobaciones/rechazos, certificado, entrega/devolución y responsables.
6. **Reglas asociadas:** Conservar relaciones y eventos entre etapas; respetar permisos y ámbitos; mantener trazabilidad de recepciones y entregas parciales; vincular certificados por orden/cliente y agregar ciclos cuando corresponda; conservar certificados separados por cliente en ciclos compartidos; identificar responsables de cada operación.
7. **Actores y permisos:** Usuarios operativos autorizados según permiso y ámbito; el alcance de una vista integral debe seguir esos controles.
8. **Datos y entidades:** Cliente, cotización, orden, materiales, eventos logísticos, ciclos, certificados y entregas.
9. **Flujo:** Cliente → cotización → orden → recepción/eventos → ciclos → certificado → entrega.
10. **Criterios de aceptación:** Desde un identificador del servicio, reconstruir los doce elementos enumerados en §5 cuando existan; presentar fechas y responsables; enlazar materiales, cantidades, lotes, tanda/ciclo, parámetros, protocolo, decisiones y certificado; agrupar materiales de ciclos según orden/cliente sin mezclar certificados de clientes distintos; distinguir aprobados, rechazados, entregados y devueltos; señalar etapas faltantes; denegar elementos fuera del ámbito autorizado.
11. **Evidencia backend:** `OrdenServicio` enlaza cotización y `CicloEsterilizacion` enlaza una orden; `CicloMaterialProcesado` asocia ciclo con material de orden. `CertificadoEsterilizacion` enlaza ciclo y orden. Logística persiste `OrdenServicioEvento` por orden, pero `Entrega` está declarada sin servicio/controlador/migración operativa identificados; la ruta activa de entrega usa el evento `ENTREGA_CLIENTE`. Las consultas permanecen repartidas por módulo.
12. **Persistencia y alcance:** No se confirmó una consulta única de extremo a extremo. Los eventos guardan parte del detalle en JSON; `CicloEsterilizacion` admite una orden por ciclo; `Entrega` no constituye una fuente operativa verificada; las líneas de recepción no están persistidas por el servicio revisado. Las cantidades de certificado requieren reconciliación con `CicloMaterialProcesado` según `RF-CER-002`/`RF-CER-005`.
13. **Brechas derivadas:** `B-TRA-001`: implementar y verificar una consulta integral de trazabilidad con enlaces, hitos, responsables, fechas, etapas faltantes y autorización por ámbito.
14. **Preguntas abiertas:** El identificador inicial de búsqueda (orden, cotización, cliente o certificado) y los perfiles autorizados para la vista integral deben precisarse durante el diseño. Los artefactos logísticos y la orden documental de esterilización tienen requisitos derivados propios en `RF-LOG-022`, `RF-LOG-023` y `RF-PLA-017`; sus decisiones de contenido incluyen `RA-LOG-002` y `RA-PLA-010`.
15. **Estado de cobertura:** Parcial; hay relaciones y consultas por módulo, sin vista integral confirmada.
16. **Certeza y límites:** Requisito confirmado en §5. Las relaciones descritas se contrastaron con entidades y servicios citados; no se inspeccionó una base desplegada ni se probó reconstrucción integral por datos reales. El flujo multiorden, recepción por línea y ciclo de vida de Entrega siguen asociados a fichas derivadas pendientes.

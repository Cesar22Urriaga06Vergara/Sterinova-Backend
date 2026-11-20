---
id: RN-CER-001
titulo: Emitir certificados separados para clientes de un ciclo compartido
tipo: RN
modulo: Certificados / Planta / Calidad
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-19
fecha_validacion: 2026-11-19
validador: usuario
fuente_principal: "Sterinova-ERP.md §3, §6"
fuente_contraste: "src/certificados/; src/planta/; src/database/migrations/"
depende_de: [RF-CER-001, RF-CER-002]
bloquea: [RF-CER-004, RA-CER-001]
brechas: []
historial:
  - version: 1.0
    nota: "Validado como Parcial. B-CER-001 se mantiene en RF-CER-004; políticas en RA-CER-001."
---

# RN-CER-001 — Emitir certificados separados para clientes de un ciclo compartido

**Fuente principal:** `Sterinova-ERP.md` §3 y §6: un ciclo compartido produce certificados separados por cliente.

**Fuentes de contraste:** `CertificadosService`, entidades ciclo/certificado y migración con unicidad de `ciclo_id`.

1. **ID:** `RN-CER-001`.
2. **Título:** Emitir certificados separados para clientes de un ciclo compartido.
3. **Tipo:** RN.
4. **Módulo:** Certificados / Planta / Calidad.
5. **Enunciado:** Si un ciclo contiene materiales de varios clientes, emitir un certificado independiente y restringido a cada cliente y su material procesado.
6. **Reglas asociadas:** Mantener separación de datos, orden, lotes y cantidades; un certificado por cliente dentro del ciclo.
7. **Actores y permisos:** Calidad aprueba el ciclo; emisión debe conservar cliente/alcance y evitar exposición cruzada.
8. **Datos y entidades:** Un ciclo tiene relación con una orden; certificado apunta a ciclo y orden; el cliente se deriva de la cotización de esa orden. No hay relación ciclo-cliente múltiple.
9. **Flujo y validación actual:** `emitirDesdeCiclo` toma un solo cliente desde orden→cotización y crea un certificado. No hay iteración/partición multi-cliente.
10. **Criterios de aceptación:** Emitir un documento separado por cliente, incluir solo su parte del ciclo y vincular cliente, orden, lotes, cantidades y ciclo.
11. **Evidencia del backend:** La emisión resuelve `ciclo.orden.cotizacion.cliente` y no busca más clientes/órdenes asociados al ciclo.
12. **Persistencia y BD:** `ciclo_id` es OneToOne y tiene clave única, impidiendo varios certificados por ciclo. Ciclos multiorden están derivados separadamente a RF-PLA-006, pero eso no resuelve multi-cliente ni certificados.
13. **Brechas derivadas:** `B-CER-001` permanece asignada a `RF-CER-004`; políticas de partición a `RA-CER-001`. Frontmatter sin brechas propias por derivación aprobada.
14. **Preguntas abiertas:** Precisar partición de materiales/cantidades, órdenes de un mismo cliente y forma de asignar versión documental; `RA-CER-001`.
15. **Estado de cobertura:** Parcial. Un solo cliente por orden/ciclo tiene soporte; ciclo compartido por varios clientes no está implementado.
16. **Certeza y límites:** Confirmado en servicio, entidades y migración inspeccionados; no se consultó una BD desplegada.

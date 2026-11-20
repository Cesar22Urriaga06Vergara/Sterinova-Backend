---
id: RNF-SEG-001
titulo: Validación de autorización y ámbito en backend
tipo: RNF / Seguridad
modulo: Seguridad transversal
estado: parcial
certeza: confirmado
version: 1.1
fecha_creacion: 2026-11-20
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §4 Seguridad"
fuente_contraste: "src/auth/jwt.strategy.ts; src/rbac/authorization.guard.ts; src/rbac/rbac-authorization.service.ts; src/app.module.ts"
depende_de: []
bloquea: []
brechas: [B-SEG-001]
historial:
  - version: 1.0
    nota: "Análisis técnico presentado en chat y recontrastado con el código el 2026-11-20; pendiente de validación explícita de la ficha."
  - version: 1.1
    nota: "Se añade evidencia de una consulta de documento logístico que no propaga el ámbito al servicio; requiere revisión de autorización por recurso."
---

# RNF-SEG-001 — Validación de autorización y ámbito en backend

**Fuente principal:** `Sterinova-ERP.md` §4, Seguridad: ámbitos, validación de sesión, revalidación de permisos en backend y autorización real en el API.

**Fuentes de contraste:** guard global de JWT y autorización, estrategia JWT y servicio RBAC.

1. **ID:** `RNF-SEG-001`.
2. **Título:** Validación de autorización y ámbito en backend.
3. **Tipo:** RNF / Seguridad.
4. **Módulo:** Seguridad transversal.
5. **Descripción funcional:** El backend comprueba identidad, permiso y ámbito del recurso en cada operación protegida.
6. **Reglas asociadas:** Denegar por defecto; validar sesión y permisos en backend; obtener identidad y concesiones de fuentes del servidor; limitar consultas al ámbito autorizado; no confiar en rol, ámbito ni creador enviados por el cliente.
7. **Actores y permisos:** Usuarios autenticados con permisos y ámbitos vigentes según RBAC.
8. **Datos y entidades:** Usuario activo, asignaciones, roles, permisos, ámbitos jerárquicos y ámbito persistido del recurso.
9. **Flujo:** JWT → validación del usuario → guards → carga de concesiones vigentes → evaluación de permiso/ámbito → filtro del recurso o rechazo.
10. **Criterios de aceptación:** Sin sesión válida se responde 401; sin permiso, 403; recurso fuera de ámbito no se expone; el ámbito solicitado solo restringe concesiones existentes.
11. **Evidencia backend:** `JwtStrategy` comprueba usuario activo y `password_version`. `PermissionGuard` obtiene el contexto RBAC en cada solicitud; `AuthorizationGuard` es global y deniega rutas sin política explícita. Se identificó una ruta que requiere revisión por recurso: `GET /logistica/documentos-emitidos/:id/pdf` exige `logistica.ordenes.ver`, pero el controlador no pasa `request.rbac` a `findDocumentoEmitidoByConsecutivo`, cuya búsqueda filtra solo por tipo y consecutivo. Las rutas marcadas públicas en los controladores revisados son login, restablecimiento con token, validación pública de certificado y health; no se identificó otra ruta pública de datos operativos. `/health/ready` informa estado de base de datos, almacenamiento y renderer PDF, por lo que su exposición en producción requiere confirmación de operación. No se confirmó acceso cruzado ni exposición externa en ejecución.
12. **Persistencia y alcance:** El backend consulta roles, permisos, asignaciones y ámbitos RBAC. `x-scope-id` selecciona o acota un ámbito autorizado, no otorga permisos.
13. **Brechas derivadas:** `B-SEG-001`: completar y verificar la cobertura de autorización por permiso y ámbito en todas las rutas privadas, incluyendo el filtrado de consultas y la descarga del documento logístico señalado en el campo 11.
14. **Preguntas abiertas:** Confirmar si `/health/ready` debe seguir expuesto públicamente o limitarse a una red/sonda de infraestructura; completar el inventario de rutas y verificar filtrado de recurso/ámbito, incluida la descarga de documentos logísticos.
15. **Estado de cobertura:** Parcial; el núcleo de sesión/RBAC está implementado y la cobertura transversal requiere completarse.
16. **Certeza y límites:** El requisito contractual está confirmado en §4. La cobertura parcial se basa en guards, estrategia, servicio RBAC, composición global y la ruta logística señalada. No se inventariaron exhaustivamente todas las rutas ni se probaron accesos cruzados de la API completa; la ruta se considera hallazgo estático pendiente de comprobación dinámica.

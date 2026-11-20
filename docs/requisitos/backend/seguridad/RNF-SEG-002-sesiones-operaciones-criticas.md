---
id: RNF-SEG-002
titulo: Protección de sesiones y operaciones críticas
tipo: RNF / Seguridad
modulo: Seguridad y autenticación
estado: parcial
certeza: confirmado
version: 1.0
fecha_creacion: 2026-11-20
fecha_validacion: null
validador: null
fuente_principal: "Sterinova-ERP.md §4 Seguridad; §3 Calidad"
fuente_contraste: "src/auth/; src/calidad/calidad.service.ts; src/cotizaciones/; SterinovaFrontend/src/lib/api.ts; SterinovaFrontend/src/app/login/page.tsx"
depende_de: [RNF-SEG-001]
bloquea: []
brechas: [B-005-03]
historial:
  - version: 1.0
    nota: "Análisis técnico presentado en chat y recontrastado con ambos repositorios el 2026-11-20; pendiente de validación explícita de la ficha."
---

# RNF-SEG-002 — Protección de sesiones y operaciones críticas

**Fuente principal:** `Sterinova-ERP.md` §4, Seguridad (JWT, validación de sesión, separación de responsabilidades, confirmación por contraseña y auditoría); §3, Calidad (confirmación mediante contraseña y aprobaciones independientes).

**Fuentes de contraste:** módulo/controlador de autenticación, estrategia JWT, servicio de contraseña, servicios de aprobación y cliente/login de SterinovaFrontend.

1. **ID:** `RNF-SEG-002`.
2. **Título:** Protección de sesiones y operaciones críticas.
3. **Tipo:** RNF / Seguridad.
4. **Módulo:** Seguridad y autenticación.
5. **Descripción funcional:** Proteger credenciales y sesiones, limitar intentos de autenticación y aplicar controles adicionales a las operaciones críticas definidas por el negocio.
6. **Reglas asociadas:** Validar sesión JWT y permisos en backend; conservar separación de responsabilidades; exigir confirmación por contraseña para aprobaciones críticas; rechazar operaciones no autorizadas y mantener trazabilidad sin registrar secretos.
7. **Actores y permisos:** Usuarios autenticados; la confirmación adicional no sustituye permisos ni ámbito.
8. **Datos y entidades:** Hash de contraseña, JWT, versión de contraseña, usuario activo, intentos y eventos de auditoría.
9. **Flujo:** Login limitado → emisión JWT → comprobación de firma, vencimiento, usuario y versión en solicitudes → autorización → reautenticación cuando la operación lo exija.
10. **Criterios de aceptación:** Rechazar tokens vencidos, usuarios inactivos y versiones obsoletas; limitar intentos; no guardar secretos en auditoría; no ejecutar una operación crítica ante confirmación inválida.
11. **Evidencia backend/frontend:** JWT de 8 horas; `JwtStrategy` revalida usuario activo y versión de contraseña. Login y restablecimiento limitan a cinco intentos por minuto; hay un límite global. `verifyPassword` existe y se usa en aprobación de Calidad, pero no en toda operación crítica. El login frontend guarda el access token en `localStorage`; ante 401 lo elimina y redirige a login.
12. **Persistencia y alcance:** Sesión backend stateless mediante JWT, sin refresh token ni sesión persistida identificados. La versión de contraseña permite invalidar tokens tras actualizar credenciales. La persistencia del token de acceso en `localStorage` debe considerarse al definir la política de sesión.
13. **Brechas derivadas:** `B-005-03`: definir las operaciones que requieren confirmación por contraseña y aplicar el control en cada una. No se registra contraseña en auditoría.
14. **Preguntas abiertas:** La clasificación funcional de operaciones críticas y si la confirmación será por operación o temporal quedan sujetas a la política acordada; el alcance funcional se mantiene como pendiente dentro de la brecha.
15. **Estado de cobertura:** Parcial; controles de sesión y login implementados, confirmación adicional no generalizada.
16. **Certeza y límites:** El requisito contractual se contrasta con §§3–4. La evidencia técnica se verificó en `AuthModule`, `AuthController`, `JwtStrategy`, usos localizados de `verifyPassword`, `SterinovaFrontend/src/lib/api.ts` y el login. El anexo no especifica duración del JWT ni límites de intentos; son controles observados, no requisitos contractuales. La ficha queda pendiente de validación explícita; no se auditó la configuración de proxy/infraestructura que puede afectar el rate limit por IP.

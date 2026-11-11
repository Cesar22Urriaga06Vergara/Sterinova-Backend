> **ARCHIVO HISTÓRICO.** No usar como política vigente. Consulte el [índice activo](../../../README.md).

# Autenticación JWT – Sterinova-Backend

- Fecha: 2026-11-10
- Fuente: `src/auth/*.ts`, `src/app.module.ts`, `src/users/entities/user.entity.ts`.
- Estado: ✅ consolidado por inspección estática.

## Flujo actual

1. El cliente envía `POST /auth/login` con `email` y `password`.
2. `AuthController.login()` invoca `AuthService.validateUser()`.
3. Se compara la contraseña con `bcrypt.compare(password, user.password_hash)`.
4. Si es válida, `AuthService.login(user)` crea el payload JWT con:
   - `sub` -> id de usuario
   - `email` -> correo
   - `rol` -> rol actual del usuario
5. El valor devuelto por el backend ofrece:
   - `access_token` (JWT firmado)
   - `user` (payload público sin `password_hash`)

## Payload JWT

`AuthService.login()` firma este payload:

```ts
const payload = { sub: user.id, email: user.email, rol: user.rol };
```

`JwtStrategy` valida la firma con `JWT_SECRET` y en `validate()` devuelve a la request:

```ts
{
  (id, email, rol);
}
```

## Propagación a los servicios

- El guard global `APP_GUARD` usa `JwtAuthGuard` en `src/app.module.ts`.
- `JwtAuthGuard` hereda de `AuthGuard('jwt')` y ignora la validación solo con `@Public()`.
- Los controladores reciben `@Req() request` con `request.user.id`/`request.user.rol`.
- Para autorizaciones por scope, `AuthorizationGuard` carga `request.rbac` mediante `RbacAuthorizationService.getContext()`.

## Expiración y revocación

- No se observan endpoints de refresh ni logout en el backend.
- No se detecta blacklist/revocación de tokens en `src/auth/` ni `src/common/`.
- El guard se apoya en `jwt` nativo de `passport-jwt` con expiración definida por la firma del token; no hay implementación explícita de refresh token en esta base.
- `No aplica / no existe` para refresh token, logout y blacklist.

## Variables de entorno relevantes

- `JWT_SECRET` -> obligatorio para la validación JWT; si falta, `JwtStrategy` lanza error.
- `DB_*` y `CORS_ORIGINS` -> configuración de la app, no de autenticación en sí.
- Se evita mostrar valores reales; los ejemplos de entorno deben llevar `<REDACTADO>`.

## Persistencia en frontend

La app frontend guarda el token en `localStorage`:

```ts
localStorage.setItem('access_token', data.access_token);
```

La instancia de Axios añade el header:

```ts
config.headers.Authorization = `Bearer ${token}`;
```

En 401, el frontend limpia almacenamiento y redirige a `/login`.

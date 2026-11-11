# Checklist de verificación operativa — Sterinova ERP

> **Estado:** vigente (plan de verificación futura).
> **Verificado contra:** documentación y código inventariado el 6 de noviembre de 2026; la lista no se ejecutó.
> **Alcance:** comprobaciones y evidencias a recopilar en ambiente controlado antes de valorar operación.
> **No cubre:** ejecución, aprobación de cambios, despliegue o validación de producción.
> **Fuente canónica de:** tareas de preparación operativa posteriores a la auditoría.

> Esta lista define qué verificar; no se ejecutó durante el cierre documental. Usar staging o un ambiente de prueba con respaldo, credenciales autorizadas y responsables identificados. No registrar valores de secretos en evidencias.

## 1. Base de datos

- [ ] En cada ambiente controlado, ejecutar `npm run migration:show` y archivar salida con ambiente, fecha y versión del código.
- [ ] Confirmar en configuración que `synchronize: false` y `migrationsRun: false`.
- [ ] Conciliar las 11 migraciones registradas con las filas de historial de esa base; no asumir que todas están aplicadas.
- [ ] Consultar `secuencias_consecutivos`; documentar secuencia, certificados existentes y siguiente número calculado antes de emitir.
- [ ] Confirmar respaldo previo, retención y restauración probada antes de cualquier DDL.
- [ ] Registrar migraciones pendientes, incompatibilidades y plan de recuperación sin ejecutar en producción.

## 2. Pruebas

- [ ] Backend: ejecutar `npm run test` y archivar resumen, versión y código de salida.
- [ ] Backend: ejecutar `npm run test:e2e` en entorno controlado y archivar configuración/salida sin credenciales.
- [ ] Frontend: acordar y documentar comando para ejecutar pruebas `.mjs`; `package.json` no declara script `test`.
- [ ] Registrar cobertura obtenida y compararla con el objetivo que defina el equipo; no inferir cobertura a partir de cantidad de archivos.

## 3. Autenticación y autorización

- [ ] Verificar presencia y política de rotación de `JWT_SECRET` sin mostrar el valor.
- [ ] Confirmar en API desplegada que no existe `/auth/seed`; verificar que el primer Admin se aprovisiona mediante el flujo CLI autorizado y no por una ruta HTTP de seed.
- [ ] En ambiente limpio, ejecutar `bootstrap:admin` con credenciales de prueba y verificar la longitud mínima sin guardar contraseña en logs.
- [ ] Probar acceso permitido/denegado para Admin, Comercial, Logística, Planta y Calidad en endpoints representativos; guardar matriz de resultado.
- [ ] Verificar respuesta `401` y limpieza de sesión frontend.

## 4. PDFs y certificados

- [ ] Configurar `PDF_RENDER_SECRET` con al menos 32 caracteres, compartido entre backend/frontend por gestor de secretos; no usar prefijo público.
- [ ] Confirmar que `PDF_RENDER_BASE_URL` o `FRONTEND_INTERNAL_URL` resuelve desde backend al frontend interno esperado.
- [ ] Definir `PDF_STORAGE_PATH`, permisos, persistencia, respaldo y política de retención por ambiente.
- [ ] En staging con datos de prueba, emitir cotización y certificado; verificar `pdf_url`, `hash_pdf` y `pdf_renderer_version` sin exponer tokens.
- [ ] Validar el QR de certificado contra `GET /certificados/validar/:token` con datos no productivos.
- [ ] Obtener aceptación visual de PDFs frente a formatos aprobados; registrar documento/versión, navegador/render y responsable.

## 5. Frontend

- [ ] Definir `NEXT_PUBLIC_API_URL` por ambiente y resolver la llamada de login que usa URL local fija.
- [ ] Confirmar que el cliente envía Bearer y limpia sesión ante `401`.
- [ ] Comparar navegación por rol en `navigation.ts` con permisos API; no usar visibilidad UI como control de acceso.
- [ ] Acordar si `FARMACEUTICO` y `FABRICANTE` deben estar disponibles en el selector y verificar correspondencia API/UI.
- [ ] Sustituir contadores estáticos del dashboard por fuente real o etiquetarlos como provisionales antes del uso operativo.
- [ ] Probar teclado, foco, estados vacío/carga/error/éxito/sesión y responsive en las pantallas críticas.

## 6. Despliegue

- [ ] Definir CORS por ambiente y confirmar orígenes web esperados.
- [ ] Revisar almacenamiento de secretos, permisos mínimos, rotación y ausencia de valores en logs.
- [ ] Confirmar persistencia/compartición de PDFs entre instancias y plan de recuperación.
- [ ] Configurar y comprobar observabilidad (logs, métricas, trazas, alertas) y respaldos; documentar herramienta y responsable.
- [ ] Acordar staging, ventana, criterios de aceptación, aprobación y rollback antes de producción.

## 7. Documentación

- [ ] Actualizar fuente canónica cuando cambien rutas, migraciones, roles, tipos de cotización o contratos PDF.
- [ ] Mantener una sola fuente canónica por tema según la [revisión de calidad documental](../archivo/2026-11-10/estado-proyecto/revision-calidad-documental.md).
- [ ] Archivar evidencia de cada ambiente sin secretos, datos personales innecesarios ni tokens.
- [ ] Revisar históricos y enlaces cruzados al menos una vez por release.

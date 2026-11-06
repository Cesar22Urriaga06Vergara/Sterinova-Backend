# ADR 001: Evidencias y firmas en ciclos de esterilización

- **Estado:** Propuesta para decisión del negocio
- **Fecha:** 2026-11-06
- **Contexto:** Sterinova registra ciclos y certificados de esterilización, pero hoy no hay entidades para evidencias adjuntas ni firmas de operador/cliente. La aprobación crea un certificado con snapshot y hash del PDF; esto no conserva la tirilla original ni demuestra una firma.

## Decisión propuesta

**Opción B: implementar evidencias y firmas en una fase futura**, condicionada a que Calidad, Operaciones y el responsable regulatorio definan qué evidencia se exige, quién firma, el alcance probatorio y los tiempos de conservación. La necesidad es plausible en un proceso regulado, pero el negocio aún debe confirmar requisitos legales y operativos. La decisión final corresponde al negocio.

No se recomienda Opción A: descartar permanentemente estas capacidades dejaría sin resolver la trazabilidad de evidencia primaria y aceptación del servicio. Tampoco se recomienda Opción C sin requisitos aprobados: diseñar hoy la validez de firmas, consentimiento, almacenamiento y retención sería una decisión regulatoria no sustentada.

## Diseño propuesto para la fase futura

- Tabla `evidencias_ciclo`: `id`, `ciclo_id`, `tipo`, nombre MIME, tamaño, clave de almacenamiento, SHA-256, `subida_por`, `created_at` y metadatos operativos no sensibles. No almacenar binarios en la base relacional.
- Tabla `firmas_ciclo`: `id`, `ciclo_id`, `firmante_tipo` (operador/cliente), `firmante_id` nullable, nombre declarado, método de firma, hash del documento firmado, fecha UTC, identificador de consentimiento y metadatos de verificación. Una imagen de firma manuscrita no debe presentarse como firma criptográfica.
- Almacenamiento inicialmente local solo para desarrollo. Producción deberá usar objeto privado compatible con S3, cifrado en tránsito y reposo, políticas IAM de mínimo privilegio, URLs temporales y retención versionada. La selección del proveedor queda pendiente de decisión de infraestructura.
- Calcular SHA-256 al recibir el archivo y volver a verificarlo al descargar. Guardar la clave opaca, nunca una ruta proporcionada por el usuario. Los hashes detectan cambios, pero por sí solos no prueban autoría ni evitan sustitución del registro.
- Vincular los eventos de carga, verificación y firma a la auditoría transaccional. Definir límites de tipo/tamaño, análisis antimalware, consentimiento, expiración y procedimiento de borrado antes de habilitar cargas.

## Consecuencias

La fase actual no modifica el esquema de ciclos para almacenar evidencias o firmas. Se evita afirmar que el certificado, su snapshot o un sello gráfico equivalen a una firma digital. La fase futura requiere aprobación de negocio/regulatoria e infraestructura antes de migrar datos.

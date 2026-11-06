# Auditoría de dependencias — Fase 1

Fecha: 2026-11-06

## Resultado

| Revisión | Hallazgos | Resultado |
|---|---:|---|
| Escaneo inicial con `npm audit`, después de agregar las dependencias de seguridad y Swagger | 9: 2 altos, 5 moderados y 2 bajos | Hallazgos en `@nestjs/mau` y en la cadena de TypeORM (`glob`/`minimatch`), además de dependencias del CLI de Nest. |
| Después de `npm audit fix` sin `--force` y retirar `@nestjs/mau` | 3 moderados | Sin hallazgos altos ni bajos. Los 3 restantes están asociados a `glob`/`minimatch`, transitivos de TypeORM. |

Se retiró `@nestjs/mau` porque no estaba referenciado por código ni scripts del repositorio. Su árbol transitivo incluía `tmp` y `undici`, responsables de los hallazgos altos. `npm audit fix` aplicó las actualizaciones compatibles disponibles en el rango configurado.

## Hallazgos pendientes

Npm propone TypeORM `1.1.2` para eliminar los avisos moderados de `glob` y `minimatch`, lo que constituye un cambio mayor desde TypeORM `0.3.31`. No se aplicó ese salto porque puede romper compatibilidad con entidades, migraciones y `@nestjs/typeorm`; requiere una migración revisada en una fase separada.

La actualización compatible del CLI produjo avisos `EBADENGINE`: `@nestjs/schematics@12.0.13` declara Node `^22.22.3 || ^24.15.0 || >=26`, mientras el entorno de esta ejecución usa Node `24.13.0`. `npm run build` sí compiló correctamente en este entorno. Conviene alinear Node con la versión mínima requerida o fijar herramientas compatibles antes de actualizar el entorno de CI.

## Comandos ejecutados

- `npm audit`
- `npm audit fix` (sin `--force`; el entorno tenía `npm_config_force=true`, por lo que se anuló para esta ejecución)
- `npm uninstall @nestjs/mau`
- `npm audit` después de los cambios

Estado final del último escaneo: **3 vulnerabilidades moderadas; 0 altas, 0 críticas**.

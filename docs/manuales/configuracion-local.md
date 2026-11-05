# Configuración local del backend

## Requisitos

Instala Node.js, npm y MariaDB. Crea una base de datos vacía y configura el acceso local. Redis no es requisito para el backend actual.

## Variables de entorno

Crea un archivo .env en la raíz del backend:

~~~env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
DB_DATABASE=sterinova
JWT_SECRET=define_un_secreto_local
~~~

El aprovisionamiento del administrador requiere además ADMIN_NAME, ADMIN_EMAIL y ADMIN_PASSWORD. No publiques secretos reales en documentación o ejemplos versionados.

## Arranque

~~~powershell
npm install
npm run migration:show
npm run migration:run
npm run start:dev
~~~

La API queda disponible en http://localhost:3001. Revisa migration:show y respalda una base que ya tenga datos antes de ejecutar migraciones.

## Primer administrador

Con ADMIN_NAME, ADMIN_EMAIL y ADMIN_PASSWORD definidos en el entorno, ejecuta:

~~~powershell
npm run bootstrap:admin
~~~

El comando falla si la cuenta ya existe. No hay credenciales predefinidas que deban publicarse en esta guía.
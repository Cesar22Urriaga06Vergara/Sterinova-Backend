import path from 'node:path';
import { AppDataSource } from '../database/data-source.js';
import { seedIcontec } from '../sellos/seed-icontec.js';

if (
  AppDataSource.options.database !== 'sterinova' ||
  !['localhost', '127.0.0.1'].includes(
    String((AppDataSource.options as { host?: string }).host),
  )
) {
  throw new Error('Este inicializador solo se ejecuta sobre sterinova local');
}
await AppDataSource.initialize();
try {
  if (await AppDataSource.showMigrations())
    throw new Error(
      'Aplique las migraciones pendientes antes de inicializar ICONTEC',
    );
  const image = path.resolve(
    process.argv[2] ??
      '../frontend_sterinova/public/certificaciones-icontec-iqnet.jpeg',
  );
  const result = await seedIcontec(AppDataSource, image);
  console.log(
    JSON.stringify({
      sello_id: result.sello_id,
      version_id: result.version_id,
      sha256: result.sha256,
      integridad: 'verificada',
    }),
  );
} finally {
  await AppDataSource.destroy();
}

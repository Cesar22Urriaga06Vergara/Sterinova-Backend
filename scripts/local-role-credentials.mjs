import { readFile } from 'node:fs/promises';

export const LOCAL_ROLE_CREDENTIALS_PATH = 'docs/local/CREDENCIALES_PRUEBAS_LOCAL.md';

export async function readLocalRoleCredentials() {
  let contents;
  try {
    contents = await readFile(LOCAL_ROLE_CREDENTIALS_PATH, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return {};
    throw error;
  }

  const credentials = {};
  for (const line of contents.split(/\r?\n/)) {
    const columns = line.split('|').map((column) => column.trim());
    if (columns.length < 7 || !/^\d+$/.test(columns[1])) continue;

    const [, id, profile, email, password, scope] = columns;
    if (!email.endsWith('@sterinova.local') || !password) continue;

    credentials[email] = {
      id: Number(id),
      code: profile,
      password,
      scope,
    };
  }

  return credentials;
}

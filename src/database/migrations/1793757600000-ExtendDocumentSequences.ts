import type { MigrationInterface, QueryRunner } from 'typeorm';

const CERTIFICATE_SEQUENCE = 'certificado_esterilizacion';
const QUOTE_PREFIXES = [
  'COT-CMI',
  'COT-LAV',
  'COT-CEMFA',
  'COT-CMED',
  'COT-CME',
  'COT-IND',
];

function highestSuffix(consecutivos: string[], prefix: string): string {
  let highest = 0n;
  const expectedPrefix = `${prefix}-`;
  for (const consecutivo of consecutivos) {
    if (!consecutivo.startsWith(expectedPrefix)) continue;
    const suffix = consecutivo.slice(expectedPrefix.length);
    if (!/^\d+$/.test(suffix)) continue;
    if (BigInt(suffix) > highest) highest = BigInt(suffix);
  }
  return highest.toString();
}

async function upsertSequence(
  queryRunner: QueryRunner,
  nombre: string,
  minimumValue: string,
) {
  const rows: Array<{ ultimo_valor: string | number }> = await queryRunner.query(
    'SELECT ultimo_valor FROM secuencias_consecutivos WHERE nombre = ?',
    [nombre],
  );
  if (rows.length) {
    const stored = BigInt(rows[0].ultimo_valor);
    const minimum = BigInt(minimumValue);
    if (stored < minimum) {
      await queryRunner.query(
        'UPDATE secuencias_consecutivos SET ultimo_valor = ? WHERE nombre = ?',
        [minimum.toString(), nombre],
      );
    }
    return;
  }
  await queryRunner.query(
    'INSERT INTO secuencias_consecutivos (nombre, ultimo_valor) VALUES (?, ?)',
    [nombre, minimumValue],
  );
}

export class ExtendDocumentSequences1793757600000 implements MigrationInterface {
  name = 'ExtendDocumentSequences1793757600000';
  transaction = false;

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE certificados_esterilizacion MODIFY consecutivo VARCHAR(20) NOT NULL',
    );
    await queryRunner.query(
      'ALTER TABLE secuencias_consecutivos MODIFY ultimo_valor BIGINT UNSIGNED NOT NULL',
    );

    const certificates: Array<{ max_value: string | number | null }> =
      await queryRunner.query(`
        SELECT MAX(CAST(consecutivo AS UNSIGNED)) AS max_value
        FROM certificados_esterilizacion
      `);
    await upsertSequence(
      queryRunner,
      CERTIFICATE_SEQUENCE,
      String(certificates[0]?.max_value ?? '0'),
    );

    for (const prefix of QUOTE_PREFIXES) {
      const consecutivos: Array<{ consecutivo: string }> = await queryRunner.query(
        'SELECT consecutivo FROM cotizaciones WHERE consecutivo LIKE ?',
        [`${prefix}-%`],
      );
      const highest = highestSuffix(
        consecutivos.map(({ consecutivo }) => consecutivo),
        prefix,
      );
      await upsertSequence(queryRunner, `cotizacion:${prefix}`, highest);
    }
  }

  async down(): Promise<void> {
    throw new Error(
      'La ampliación de las secuencias es irreversible; no se reduce el rango ni se recalculan números emitidos.',
    );
  }
}

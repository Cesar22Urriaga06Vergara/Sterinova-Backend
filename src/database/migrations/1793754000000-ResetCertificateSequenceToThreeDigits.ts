import type { MigrationInterface, QueryRunner } from 'typeorm';

const SEQUENCE_NAME = 'certificado_esterilizacion';

export class ResetCertificateSequenceToThreeDigits1793754000000 implements MigrationInterface {
  name = 'ResetCertificateSequenceToThreeDigits1793754000000';
  transaction = false;

  async up(queryRunner: QueryRunner): Promise<void> {
    const certificates: Array<{ total: number }> = await queryRunner.query(
      'SELECT COUNT(*) AS total FROM certificados_esterilizacion',
    );
    if (Number(certificates[0]?.total ?? 0) > 0) {
      throw new Error(
        'No se reinicia la secuencia: ya hay certificados emitidos. Conciliarlos antes del cambio a consecutivos de tres dígitos.',
      );
    }

    await queryRunner.query(
      'ALTER TABLE certificados_esterilizacion MODIFY consecutivo CHAR(3) NOT NULL',
    );

    const sequences: Array<{ nombre: string }> = await queryRunner.query(
      'SELECT nombre FROM secuencias_consecutivos WHERE nombre = ?',
      [SEQUENCE_NAME],
    );
    if (sequences.length) {
      await queryRunner.query(
        'UPDATE secuencias_consecutivos SET ultimo_valor = 0 WHERE nombre = ?',
        [SEQUENCE_NAME],
      );
    } else {
      await queryRunner.query(
        'INSERT INTO secuencias_consecutivos (nombre, ultimo_valor) VALUES (?, 0)',
        [SEQUENCE_NAME],
      );
    }
  }

  async down(): Promise<void> {
    throw new Error(
      'El reinicio de consecutivos es irreversible y no se revierte automáticamente.',
    );
  }
}

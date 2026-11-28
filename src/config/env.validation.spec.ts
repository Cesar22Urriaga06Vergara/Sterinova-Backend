import { describe, expect, it } from 'vitest';
import { validateEnvironment } from './env.validation.js';

describe('validateEnvironment', () => {
  it('requires a database password in production', () => {
    expect(() => validateEnvironment({
      NODE_ENV: 'production',
      DB_HOST: 'mariadb',
      DB_PORT: '3306',
      DB_USERNAME: 'sterinova',
      DB_PASSWORD: ' ',
      DB_DATABASE: 'sterinova',
      JWT_SECRET: 'j'.repeat(32),
      PDF_RENDER_SECRET: 'p'.repeat(32),
      CORS_ORIGINS: 'https://app.example.com',
    })).toThrow(/DB_PASSWORD/);
  });

  it('normalizes valid production ports and origins', () => {
    const config = validateEnvironment({
      NODE_ENV: 'production',
      DB_HOST: 'mariadb',
      DB_PORT: '3306',
      DB_USERNAME: 'sterinova',
      DB_PASSWORD: 'database-secret',
      DB_DATABASE: 'sterinova',
      JWT_SECRET: 'j'.repeat(32),
      PDF_RENDER_SECRET: 'p'.repeat(32),
      CORS_ORIGINS: 'https://app.example.com/',
      PORT: '3002',
    });

    expect(config).toMatchObject({
      DB_PORT: 3306,
      PORT: 3002,
      CORS_ORIGINS: 'https://app.example.com',
    });
  });
});

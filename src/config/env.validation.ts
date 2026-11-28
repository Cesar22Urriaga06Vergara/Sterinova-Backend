const REQUIRED_PRODUCTION_VARIABLES = [
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_DATABASE',
  'JWT_SECRET',
  'PDF_RENDER_SECRET',
  'CORS_ORIGINS',
] as const;

function readOptionalPort(name: string, value: unknown): number | undefined {
  if (value === undefined || value === '') return undefined;

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65_535) {
    throw new Error(`${name} must be an integer between 1 and 65535`);
  }
  return parsed;
}

function parseOrigins(value: unknown): string[] {
  if (typeof value !== 'string') return [];

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) => {
      let parsed: URL;
      try {
        parsed = new URL(origin);
      } catch {
        throw new Error(`CORS_ORIGINS contains an invalid URL: ${origin}`);
      }

      if (parsed.pathname !== '/' || parsed.search || parsed.hash) {
        throw new Error(`CORS_ORIGINS must contain origins without paths: ${origin}`);
      }
      if (parsed.protocol !== 'https:' && parsed.hostname !== 'localhost') {
        throw new Error(`CORS_ORIGINS must use HTTPS outside localhost: ${origin}`);
      }
      return parsed.origin;
    });
}

export function validateEnvironment(config: Record<string, unknown>) {
  const isProduction = config.NODE_ENV === 'production';
  const missing = isProduction
    ? REQUIRED_PRODUCTION_VARIABLES.filter((name) => {
        const value = config[name];
        return typeof value !== 'string' || value.trim() === '';
      })
    : [];

  if (missing.length > 0) {
    throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);
  }

  const jwtSecret = typeof config.JWT_SECRET === 'string' ? config.JWT_SECRET.trim() : '';
  if (isProduction && jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters in production');
  }

  const pdfSecret =
    typeof config.PDF_RENDER_SECRET === 'string' ? config.PDF_RENDER_SECRET.trim() : '';
  if (isProduction && pdfSecret.length < 32) {
    throw new Error('PDF_RENDER_SECRET must contain at least 32 characters in production');
  }

  const port = readOptionalPort('PORT', config.PORT) ?? 3002;
  const dbPort = readOptionalPort('DB_PORT', config.DB_PORT);
  const corsOrigins = parseOrigins(config.CORS_ORIGINS);

  if (isProduction && corsOrigins.length === 0) {
    throw new Error('CORS_ORIGINS must contain at least one allowed origin in production');
  }

  return {
    ...config,
    PORT: port,
    ...(dbPort === undefined ? {} : { DB_PORT: dbPort }),
    CORS_ORIGINS: corsOrigins.join(','),
  };
}

export function getAllowedCorsOrigins(value: string | undefined): string[] {
  return parseOrigins(value);
}

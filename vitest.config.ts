import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // Resolves the path aliases declared in tsconfig.json, including the ones
  // added by `nest g library`.
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['**/*.spec.ts'],
    coverage: {
      include: ['src/cotizaciones/**/*.ts', 'src/calidad/**/*.ts', 'src/certificados/**/*.ts'],
      thresholds: {
        'src/cotizaciones/**/*.ts': { lines: 70, branches: 60 },
        'src/calidad/**/*.ts': { lines: 70, branches: 60 },
        'src/certificados/**/*.ts': { lines: 70, branches: 60 },
      },
    },
  },
});

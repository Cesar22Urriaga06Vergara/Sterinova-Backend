import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['test/rbac-*.integration-spec.ts'],
    fileParallelism: false,
  },
});

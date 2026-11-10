import { PERMISSION_CATALOG, isPermissionCode } from './permission-catalog.js';

describe('catálogo de anulaciones', () => {
  it.each(['crear', 'aprobar', 'ver'])(
    'registra %s como permiso dinámico',
    (action) => {
      const code = `solicitudes_anulacion.${action}`;
      expect(isPermissionCode(code)).toBe(true);
      expect(PERMISSION_CATALOG.find((p) => p.code === code)).toMatchObject({
        isDynamic: true,
      });
    },
  );
});

import { PERMISSION_CATALOG, isPermissionCode } from './permission-catalog.js';

describe('product catalog permission', () => {
  it('recognizes product management as a commercial capability', () => {
    expect(isPermissionCode('productos.gestionar')).toBe(true);
    expect(PERMISSION_CATALOG.find(({ code }) => code === 'productos.gestionar'))
      .toMatchObject({
        module: 'comercial',
        label: 'Administrar el catálogo de productos y servicios',
      });
  });
});

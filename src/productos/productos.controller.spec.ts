import { REQUIRED_PERMISSION_KEY } from '../rbac/require-permission.decorator.js';
import { ProductosController } from './productos.controller.js';

describe('ProductosController permissions', () => {
  it('protects catalog management and quote lookup with separate permissions', () => {
    expect(
      Reflect.getMetadata(
        REQUIRED_PERMISSION_KEY,
        ProductosController.prototype.findAll,
      ),
    ).toBe('productos.gestionar');
    expect(
      Reflect.getMetadata(
        REQUIRED_PERMISSION_KEY,
        ProductosController.prototype.searchForCreation,
      ),
    ).toBe('cotizaciones.crear');
    expect(
      Reflect.getMetadata(
        REQUIRED_PERMISSION_KEY,
        ProductosController.prototype.searchForEditing,
      ),
    ).toBe('cotizaciones.editar');
  });
});

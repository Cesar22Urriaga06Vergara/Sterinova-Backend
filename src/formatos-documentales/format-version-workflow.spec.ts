import { EstadoVersionFormato as Estado } from './entities/formato-versiones.entity.js';
import {
  canObsoleteFormatVersion,
  canTransitionFormatVersion,
} from './format-version-workflow.js';

describe('format version workflow', () => {
  it('only publishes an approved version', () => {
    expect(
      canTransitionFormatVersion(Estado.APROBADA, Estado.PUBLICADA),
    ).toBe(true);
    expect(
      canTransitionFormatVersion(Estado.BORRADOR, Estado.PUBLICADA),
    ).toBe(false);
  });

  it('does not transition an obsolete version back into use', () => {
    expect(
      canTransitionFormatVersion(Estado.OBSOLETA, Estado.PUBLICADA),
    ).toBe(false);
  });

  it('keeps current or client-assigned versions publishable', () => {
    expect(canObsoleteFormatVersion(true, false)).toBe(false);
    expect(canObsoleteFormatVersion(false, true)).toBe(false);
    expect(canObsoleteFormatVersion(false, false)).toBe(true);
  });
});

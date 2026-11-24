import { TipoServicioCotizacion } from './entities/tipo-servicio.enum.js';
import {
  canonicalFormatFor,
  FormatoCanonicoCotizacion,
  quotePrefixFor,
} from './canonical-quote-format.js';

describe('canonical quote format compatibility', () => {
  it.each([
    [
      TipoServicioCotizacion.INDUSTRIAL_ETO,
      FormatoCanonicoCotizacion.SERV_ETO_FARMA,
      'COT-CEMFA',
    ],
    [
      TipoServicioCotizacion.FARMACEUTICO,
      FormatoCanonicoCotizacion.SERV_ETO_FARMA,
      'COT-CEMFA',
    ],
    [
      TipoServicioCotizacion.FABRICANTE,
      FormatoCanonicoCotizacion.SERV_ETO_FAB,
      'COT-CMED',
    ],
    [
      TipoServicioCotizacion.INSTITUCIONAL_ETO,
      FormatoCanonicoCotizacion.SERV_ETO_INST,
      'COT-CME',
    ],
    [
      TipoServicioCotizacion.INSTITUCIONAL_VAPOR,
      FormatoCanonicoCotizacion.SERV_VAPOR_INST,
      'COT-CME',
    ],
    [
      TipoServicioCotizacion.LAVANDERIA,
      FormatoCanonicoCotizacion.SERV_LAV_FARMA,
      'COT-LAV',
    ],
    [
      TipoServicioCotizacion.INSUMOS,
      FormatoCanonicoCotizacion.VENTA_INSUMOS,
      'COT-CMI',
    ],
  ])('maps legacy %s to %s with prefix %s', (legacy, canonical, prefix) => {
    expect(canonicalFormatFor(legacy)).toBe(canonical);
    expect(quotePrefixFor(legacy)).toBe(prefix);
  });
});

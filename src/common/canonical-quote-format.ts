import { TipoServicioCotizacion } from './tipo-servicio-cotizacion.js';

/** Presentation/document taxonomy. Persisted quote values remain legacy-compatible. */
export enum FormatoCanonicoCotizacion {
  SERV_ETO_FARMA = 'SERV_ETO_FARMA',
  SERV_ETO_FAB = 'SERV_ETO_FAB',
  SERV_ETO_INST = 'SERV_ETO_INST',
  SERV_VAPOR_INST = 'SERV_VAPOR_INST',
  SERV_LAV_FARMA = 'SERV_LAV_FARMA',
  VENTA_INSUMOS = 'VENTA_INSUMOS',
}

export type TipoServicioFormatoCotizacion =
  TipoServicioCotizacion | FormatoCanonicoCotizacion;
export const TIPOS_FORMATO_COTIZACION = [
  ...Object.values(TipoServicioCotizacion),
  ...Object.values(FormatoCanonicoCotizacion),
];

export const CANONICAL_FORMAT_METADATA: Record<
  FormatoCanonicoCotizacion,
  { prefix: string; title: string; subtitle: string; intro: string }
> = {
  [FormatoCanonicoCotizacion.SERV_ETO_FARMA]: {
    prefix: 'COT-CEMFA',
    title: 'ESTERILIZACIÓN INDUSTRIAL',
    subtitle: 'Cotización de Servicios',
    intro:
      'En atención a su solicitud, nos permitimos presentar nuestra cotización correspondiente al servicio de esterilización industrial con Óxido de Etileno (EtO) de Sterinova, dirigido al procesamiento de productos que requieren este método de esterilización. Nuestro servicio está orientado a brindar soluciones confiables y adaptadas a las características y necesidades de cada producto y proceso.',
  },
  [FormatoCanonicoCotizacion.SERV_ETO_FAB]: {
    prefix: 'COT-CMED',
    title: 'ESTERILIZACIÓN INDUSTRIAL',
    subtitle: 'Cotización de Servicios',
    intro:
      'En atención a su solicitud, nos permitimos presentar nuestra cotización correspondiente al servicio de esterilización industrial con Óxido de Etileno (EtO) de Sterinova, dirigido al procesamiento de productos que requieren este método de esterilización. Nuestro servicio está orientado a brindar soluciones confiables y adaptadas a las características y necesidades de cada producto y proceso.',
  },
  [FormatoCanonicoCotizacion.SERV_ETO_INST]: {
    prefix: 'COT-CME',
    title: 'ESTERILIZACIÓN INSTITUCIONAL EtO',
    subtitle: 'Cotización de Servicios',
    intro:
      'En atención a su solicitud, nos permitimos presentar nuestra cotización correspondiente al servicio de esterilización institucional con Óxido de Etileno (EtO) de Sterinova, orientado a atender requerimientos de esterilización de productos compatibles con este método, especialmente en situaciones de contingencia. Nuestro servicio busca brindar una solución oportuna y confiable, de acuerdo con las necesidades y condiciones particulares de cada cliente.',
  },
  [FormatoCanonicoCotizacion.SERV_VAPOR_INST]: {
    prefix: 'COT-CME',
    title: 'ESTERILIZACIÓN INSTITUCIONAL VAPOR',
    subtitle: 'Cotización de Servicios',
    intro:
      'En atención a su solicitud, nos permitimos presentar nuestra cotización correspondiente al servicio de esterilización institucional con vapor de Sterinova, orientado a atender requerimientos de esterilización de productos compatibles con este método, especialmente en situaciones de contingencia. Nuestro servicio busca brindar una solución oportuna y confiable, de acuerdo con las necesidades y condiciones particulares de cada cliente.',
  },
  [FormatoCanonicoCotizacion.SERV_LAV_FARMA]: {
    prefix: 'COT-LAV',
    title: 'LAVANDERIA DOTACIÓN FARMACÉUTICA',
    subtitle: 'Cotización de Servicios',
    intro:
      'En atención a su solicitud, nos permitimos presentar nuestra cotización correspondiente al servicio de lavandería de dotación farmacéutica de Sterinova, orientado al lavado y acondicionamiento de prendas y elementos utilizados en ambientes farmacéuticos y áreas que requieren condiciones especiales de procesamiento.',
  },
  [FormatoCanonicoCotizacion.VENTA_INSUMOS]: {
    prefix: 'COT-CMI',
    title: 'VENTA DE INSUMOS',
    subtitle: 'Cotización de insumos',
    intro:
      'En atención a su solicitud, nos permitimos presentar nuestra cotización correspondiente a la línea de venta de insumos de Sterinova, especializada en soluciones para procesos de esterilización y monitoreo.',
  },
};

/** Legacy INDUSTRIAL_ETO is the generic EtO format; specific legacy values remain distinct. */
export const LEGACY_TO_CANONICAL_FORMAT: Record<
  TipoServicioCotizacion,
  FormatoCanonicoCotizacion
> = {
  [TipoServicioCotizacion.INDUSTRIAL_ETO]:
    FormatoCanonicoCotizacion.SERV_ETO_FARMA,
  [TipoServicioCotizacion.FARMACEUTICO]:
    FormatoCanonicoCotizacion.SERV_ETO_FARMA,
  [TipoServicioCotizacion.FABRICANTE]: FormatoCanonicoCotizacion.SERV_ETO_FAB,
  [TipoServicioCotizacion.INSTITUCIONAL_ETO]:
    FormatoCanonicoCotizacion.SERV_ETO_INST,
  [TipoServicioCotizacion.INSTITUCIONAL_VAPOR]:
    FormatoCanonicoCotizacion.SERV_VAPOR_INST,
  [TipoServicioCotizacion.LAVANDERIA]: FormatoCanonicoCotizacion.SERV_LAV_FARMA,
  [TipoServicioCotizacion.INSUMOS]: FormatoCanonicoCotizacion.VENTA_INSUMOS,
};

export function canonicalFormatFor(
  tipo: TipoServicioCotizacion,
): FormatoCanonicoCotizacion {
  return LEGACY_TO_CANONICAL_FORMAT[tipo];
}

export function quotePrefixFor(tipo: TipoServicioCotizacion): string {
  return CANONICAL_FORMAT_METADATA[canonicalFormatFor(tipo)].prefix;
}

export const LEGACY_SERVICES_BY_CANONICAL: Record<
  FormatoCanonicoCotizacion,
  TipoServicioCotizacion[]
> = {
  [FormatoCanonicoCotizacion.SERV_ETO_FARMA]: [
    TipoServicioCotizacion.FARMACEUTICO,
    TipoServicioCotizacion.INDUSTRIAL_ETO,
  ],
  [FormatoCanonicoCotizacion.SERV_ETO_FAB]: [TipoServicioCotizacion.FABRICANTE],
  [FormatoCanonicoCotizacion.SERV_ETO_INST]: [
    TipoServicioCotizacion.INSTITUCIONAL_ETO,
  ],
  [FormatoCanonicoCotizacion.SERV_VAPOR_INST]: [
    TipoServicioCotizacion.INSTITUCIONAL_VAPOR,
  ],
  [FormatoCanonicoCotizacion.SERV_LAV_FARMA]: [
    TipoServicioCotizacion.LAVANDERIA,
  ],
  [FormatoCanonicoCotizacion.VENTA_INSUMOS]: [TipoServicioCotizacion.INSUMOS],
};

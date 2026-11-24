/**
 * Estados del ciclo de vida de una cotización.
 *
 * Secuencia documentada (reglas-maestras M3 §6; hoja de ruta D03–D05):
 * Borrador → APROBADA → EMITIDA → ACEPTADA_CLIENTE.
 * La anulación se solicita desde APROBADA o EMITIDA. EN_REVISION y ENVIADA
 * permanecen reservados; el servicio actual no los asigna.
 *
 * Nota: el valor 'APROBADA' se conserva tal cual para mantener compatibilidad
 * con el contrato RBAC vigente y con los registros existentes; el flujo
 * objetivo separa la aprobación interna (APROBADA) de la aceptación del
 * cliente (ACEPTADA_CLIENTE).
 */
export enum EstadoCotizacion {
  BORRADOR = 'Borrador',
  EN_REVISION = 'EN_REVISION',
  APROBADA = 'APROBADA',
  ENVIADA = 'ENVIADA',
  ACEPTADA_CLIENTE = 'ACEPTADA_CLIENTE',
  EMITIDA = 'EMITIDA',
  ANULADA = 'ANULADA',
}

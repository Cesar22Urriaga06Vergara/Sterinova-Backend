/**
 * Operational projections.
 *
 * Operational areas (Planta, Logística, Calidad) need the service data to
 * execute their work (order, materials, client, protocol); they do not need
 * the commercial terms of the quote. The quote entity also loads its items
 * eagerly, and items carry unit prices, so the eager loading is disabled
 * together with the commercial columns.
 *
 * Rule: roles-y-permisos §2/§11 — exclude commercial columns in SELECT and DTO.
 */
export const COTIZACION_OPERATIVA = {
  id: true,
  consecutivo: true,
  fecha: true,
  tipo_servicio: true,
  version: true,
  estado: true,
  cliente_id: true,
  scope_id: true,
  creador_id: true,
  fecha_emision: true,
  tiempo_despacho: true,
  transporte: true,
} as const;

export const CLIENTE_OPERATIVO = {
  id: true,
  razon_social: true,
  nit: true,
  contacto: true,
  telefono: true,
  email: true,
  direccion: true,
  cargo: true,
  ciudad: true,
} as const;

export const ORDEN_OPERATIVA = {
  id: true,
  scope_id: true,
  creador_id: true,
  metodo_esterilizacion: true,
  version: true,
  consecutivo: true,
  acta_consecutivo: true,
  formato_orden_version_id: true,
  formato_acta_version_id: true,
  cotizacion_id: true,
  fecha_programada: true,
  estado: true,
  conductor_asignado: true,
  vehiculo_placa: true,
  observaciones: true,
  created_at: true,
} as const;

export const MATERIAL_OPERATIVO = {
  id: true,
  orden_id: true,
  cotizacion_item_id: true,
  posicion: true,
  descripcion: true,
  referencia: true,
  lote: true,
  cantidad: true,
  cantidad_recibida: true,
  cajas_recibidas: true,
  empaque: true,
  muestras_retencion: true,
  muestras_cliente: true,
  muestras_laboratorio: true,
  created_at: true,
  updated_at: true,
} as const;

export const ITEM_OPERATIVO = {
  id: true,
  producto_id: true,
  tipo_item: true,
  categoria: true,
  codigo: true,
  referencia: true,
  metodo: true,
  presentacion: true,
  marca: true,
  descripcion: true,
  unidad: true,
  cantidad: true,
  cotizacion_id: true,
} as const;

export const CICLO_OPERATIVO = {
  id: true,
  scope_id: true,
  fecha_esterilizacion: true,
  tiempo_secado: true,
  protocolo_version_id: true,
  orden_id: true,
  equipo: true,
  metodo: true,
  operador_id: true,
  temperatura: true,
  humedad: true,
  presion: true,
  tiempo_exposicion: true,
  tiempo_aireacion: true,
  control_biologico: true,
  control_quimico: true,
  fecha_proceso: true,
  estado: true,
  revisado_por: true,
  revisado_en: true,
  motivo_rechazo: true,
  reproceso_calidad_autorizado_por_id: true,
  reproceso_calidad_autorizado_at: true,
  reproceso_calidad_motivo: true,
  reproceso_planta_autorizado_por_id: true,
  reproceso_planta_autorizado_at: true,
  reproceso_planta_motivo: true,
  ciclo_correccion_de_id: true,
} as const;

export const USUARIO_OPERATIVO = {
  id: true,
  nombre: true,
  apellido: true,
  cargo: true,
} as const;

export const PROTOCOLO_OPERATIVO = {
  id: true,
  metodo: true,
  version: true,
  especificaciones_json: true,
  motivo: true,
  creado_por_id: true,
  created_at: true,
} as const;

/** Quote relation with its client, without commercial columns. */
export const COTIZACION_CON_CLIENTE = {
  ...COTIZACION_OPERATIVA,
  cliente: CLIENTE_OPERATIVO,
} as const;

/** Quote relation with its client and its items, without prices. */
export const COTIZACION_CON_ITEMS = {
  ...COTIZACION_OPERATIVA,
  cliente: CLIENTE_OPERATIVO,
  items: ITEM_OPERATIVO,
} as const;

/** Order relation with its quote (operational) and its materials. */
export const ORDEN_CON_COTIZACION = {
  ...ORDEN_OPERATIVA,
  cotizacion: COTIZACION_CON_CLIENTE,
  materiales: MATERIAL_OPERATIVO,
} as const;

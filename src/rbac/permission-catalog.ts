/** Action identifiers belong to implemented capabilities; role names are configuration. */
export const PERMISSION_CATALOG = [
  {
    code: 'tasas_fiscales.gestionar',
    module: 'configuracion',
    label: 'Publicar versiones de tasas fiscales',
  },
  {
    code: 'usuarios.ver',
    module: 'accesos',
    label: 'Consultar usuarios del ámbito',
  },
  {
    code: 'usuarios.identidad.gestionar',
    module: 'accesos',
    label: 'Gestionar identidades globales',
  },
  {
    code: 'asignaciones.gestionar',
    module: 'accesos',
    label: 'Gestionar asignaciones delegadas',
  },
  {
    code: 'roles.gestionar',
    module: 'accesos',
    label: 'Configurar roles y sus permisos',
  },
  {
    code: 'ambitos.gestionar',
    module: 'accesos',
    label: 'Configurar estructura organizativa',
  },
  { code: 'clientes.ver', module: 'comercial', label: 'Consultar clientes' },
  { code: 'clientes.crear', module: 'comercial', label: 'Crear clientes' },
  { code: 'clientes.editar', module: 'comercial', label: 'Editar clientes' },
  {
    code: 'clientes.importar',
    module: 'comercial',
    label: 'Importar clientes',
  },
  {
    code: 'clientes.eliminar',
    module: 'comercial',
    label: 'Eliminar clientes sin referencias',
  },
  {
    code: 'cotizaciones.ver',
    module: 'comercial',
    label: 'Consultar cotizaciones comerciales',
  },
  {
    code: 'cotizaciones.crear',
    module: 'comercial',
    label: 'Crear borradores de cotización',
  },
  {
    code: 'cotizaciones.editar',
    module: 'comercial',
    label: 'Editar borradores de cotización',
  },
  {
    code: 'cotizaciones.eliminar',
    module: 'comercial',
    label: 'Eliminar borradores de cotización',
  },
  {
    code: 'cotizaciones.previsualizar',
    module: 'comercial',
    label: 'Previsualizar cotizaciones',
  },
  {
    code: 'cotizaciones.emitir',
    module: 'comercial',
    label: 'Emitir cotizaciones',
  },
  {
    code: 'cotizaciones.descargar',
    module: 'comercial',
    label: 'Descargar cotizaciones oficiales',
  },
  {
    code: 'cotizaciones.aceptar',
    module: 'comercial',
    label: 'Registrar aceptación del cliente',
  },
  {
    code: 'logistica.cotizaciones_disponibles.ver',
    module: 'logistica',
    label: 'Consultar expedientes disponibles para Logística',
  },
  {
    code: 'logistica.ordenes.ver',
    module: 'logistica',
    label: 'Consultar órdenes logísticas',
  },
  {
    code: 'logistica.ordenes.crear',
    module: 'logistica',
    label: 'Crear órdenes logísticas',
  },
  {
    code: 'logistica.ordenes.cambiar_estado',
    module: 'logistica',
    label: 'Avanzar órdenes logísticas',
  },
  {
    code: 'planta.ordenes.ver',
    module: 'planta',
    label: 'Consultar órdenes de Planta',
  },
  {
    code: 'planta.ciclos.ver',
    module: 'planta',
    label: 'Consultar ciclos de Planta',
  },
  {
    code: 'planta.ciclos.crear',
    module: 'planta',
    label: 'Registrar ciclos de Planta',
  },
  {
    code: 'calidad.ciclos.ver',
    module: 'calidad',
    label: 'Consultar ciclos para Calidad',
  },
  {
    code: 'calidad.aprobar',
    module: 'calidad',
    label: 'Aprobar ciclos de Calidad',
  },
  {
    code: 'calidad.rechazar',
    module: 'calidad',
    label: 'Rechazar ciclos de Calidad',
  },
  {
    code: 'certificados.ver',
    module: 'calidad',
    label: 'Consultar certificados',
  },
  {
    code: 'certificados.descargar',
    module: 'calidad',
    label: 'Descargar certificados oficiales',
  },
  {
    code: 'auditoria.ver',
    module: 'auditoria',
    label: 'Consultar eventos de auditoría',
  },
  {
    code: 'formatos.ver',
    module: 'documentos',
    label: 'Consultar formatos documentales',
  },
  {
    code: 'formatos.crear',
    module: 'documentos',
    label: 'Crear formatos documentales',
  },
  {
    code: 'formatos.editar',
    module: 'documentos',
    label: 'Editar formatos documentales',
  },
  {
    code: 'formatos.eliminar',
    module: 'documentos',
    label: 'Eliminar formatos sin referencias',
  },
  {
    code: 'formatos.versiones.crear',
    module: 'documentos',
    label: 'Crear versiones de formato',
  },
  {
    code: 'formatos.versiones.editar',
    module: 'documentos',
    label: 'Editar versiones borrador',
  },
  {
    code: 'formatos.versiones.publicar',
    module: 'documentos',
    label: 'Gestionar estados de versión',
  },
  {
    code: 'sellos.ver',
    module: 'documentos',
    label: 'Consultar sellos de certificación',
  },
  {
    code: 'sellos.crear',
    module: 'documentos',
    label: 'Crear sellos de certificación',
  },
  {
    code: 'sellos.editar',
    module: 'documentos',
    label: 'Editar sellos de certificación',
  },
  {
    code: 'sellos.desactivar',
    module: 'documentos',
    label: 'Desactivar sellos de certificación',
  },
] as const;

export type PermissionCode = (typeof PERMISSION_CATALOG)[number]['code'];
const knownPermissions = new Set<string>(
  PERMISSION_CATALOG.map(({ code }) => code),
);

export function isPermissionCode(value: string): value is PermissionCode {
  return knownPermissions.has(value);
}

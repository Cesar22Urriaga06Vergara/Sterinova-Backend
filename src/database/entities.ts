import { OrdenServicioMaterial } from '../ordenes-servicio/entities/orden-servicio-material.entity.js';
import { ProtocoloEsterilizacionVersion } from '../planta/entities/protocolo-esterilizacion-version.entity.js';
import { CicloParametroEvaluacion } from '../planta/entities/ciclo-parametro-evaluacion.entity.js';
import { SelloCertificacionVersion } from '../sellos/entities/sello-certificacion-version.entity.js';
import { User } from '../users/entities/user.entity.js';
import { PasswordResetToken } from '../users/entities/password-reset-token.entity.js';
import { TasaFiscal } from '../tasas-fiscales/entities/tasa-fiscal.entity.js';
import { Cliente } from '../clientes/entities/cliente.entity.js';
import { Cotizacion } from '../cotizaciones/entities/cotizacion.entity.js';
import { SolicitudAnulacion } from '../cotizaciones/entities/solicitud-anulacion.entity.js';
import { CotizacionItem } from '../cotizaciones/entities/cotizacion-item.entity.js';
import { OrdenServicio } from '../ordenes-servicio/entities/orden-servicio.entity.js';
import { CicloEsterilizacion } from '../planta/entities/ciclo-esterilizacion.entity.js';
import { CertificadoEsterilizacion } from '../certificados/entities/certificado-esterilizacion.entity.js';
import { SecuenciaConsecutivos } from '../documentos/entities/secuencia-consecutivos.entity.js';
import { FormatosDocumentales } from '../formatos-documentales/entities/formatos-documentales.entity.js';
import { FormatoVersiones } from '../formatos-documentales/entities/formato-versiones.entity.js';
import { FormatoAsignacionesCliente } from '../formatos-documentales/entities/formato-asignaciones-cliente.entity.js';
import { Auditoria } from '../auditoria/entities/auditoria.entity.js';
import { SelloCertificacion } from '../sellos/entities/sello-certificacion.entity.js';
import { RbacScope, RbacScopeClosure } from '../rbac/entities/scope.entity.js';
import { RbacRole, RbacPermission, RbacRolePermission } from '../rbac/entities/role.entity.js';
import { RbacUserRoleAssignment, RbacPlatformOwner } from '../rbac/entities/user-role-assignment.entity.js';

export const STERINOVA_ENTITIES = [
  OrdenServicioMaterial,
  ProtocoloEsterilizacionVersion,
  CicloParametroEvaluacion,
  SelloCertificacionVersion,

  TasaFiscal,
  User,
  PasswordResetToken,
  Cliente,
  Cotizacion,
  SolicitudAnulacion,
  CotizacionItem,
  OrdenServicio,
  CicloEsterilizacion,
  CertificadoEsterilizacion,
  SecuenciaConsecutivos,
  FormatosDocumentales,
  FormatoVersiones,
  FormatoAsignacionesCliente,
  Auditoria,
  SelloCertificacion,
  RbacScope,
  RbacScopeClosure,
  RbacRole,
  RbacPermission,
  RbacRolePermission,
  RbacUserRoleAssignment,
  RbacPlatformOwner,
];

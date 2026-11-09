import { User } from '../users/entities/user.entity.js';
import { Cliente } from '../clientes/entities/cliente.entity.js';
import { Cotizacion } from '../cotizaciones/entities/cotizacion.entity.js';
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
  User,
  Cliente,
  Cotizacion,
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

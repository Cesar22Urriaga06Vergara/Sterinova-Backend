import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { getMetadataArgsStorage } from 'typeorm';
import { User } from '../users/entities/user.entity.js';
import { AuthService } from '../auth/auth.service.js';
import { ClientesController } from '../clientes/clientes.controller.js';
import { LogisticaController } from '../logistica/logistica.controller.js';
import { PlantaController } from '../planta/planta.controller.js';
import { CalidadController } from '../calidad/calidad.controller.js';
import { REQUIRED_PERMISSION_KEY } from './require-permission.decorator.js';
describe('single RBAC authority', () => {
 it('does not map a legacy role column', () => {
  expect(getMetadataArgsStorage().columns.filter(c=>c.target===User).map(c=>c.propertyName)).not.toContain('rol');
 });
 it('never copies an injected legacy role into login or JWT', () => {
  const service=new AuthService({} as never,{sign:(p:unknown)=>p} as never);
  const result=service.login({id:1,rol:'Admin',password_version:1} as never);
  expect(result.user).not.toHaveProperty('rol');expect(result.access_token).not.toHaveProperty('rol');
 });
 it.each([[ClientesController,'findAll','clientes.ver'],[LogisticaController,'findAllOrdenes','logistica.ordenes.ver'],[PlantaController,'findCiclos','planta.ciclos.ver'],[CalidadController,'aprobar','calidad.aprobar']] as const)('requires an explicit action on %s.%s',(controller,method,permission)=>{
  expect(Reflect.getMetadata(REQUIRED_PERMISSION_KEY,(controller.prototype as any)[method])).toBe(permission);
 });
});

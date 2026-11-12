import 'reflect-metadata';
import { ForbiddenException, type ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizationGuard, PermissionGuard } from './authorization.guard.js';
import { ScopedPermissions, RequirePermission } from './require-permission.decorator.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { RequireSession } from './require-session.decorator.js';
@ScopedPermissions() class Resource { @RequirePermission('clientes.ver') list(){} forgotten(){} @Public() public(){} }
class Legacy { @SetMetadata('roles',['Admin']) list(){} }
class Session { @RequireSession() list(){} }
const ctx=(controller:any, method='list', user:any={id:1,rol:'Admin'})=>({getClass:()=>controller,getHandler:()=>controller.prototype[method],switchToHttp:()=>({getRequest:()=>({user,headers:{}})})}) as ExecutionContext;
describe('single fail-closed authorization guard',()=>{
 it('denies obsolete roles even for Admin',async()=>{
  const guard=new AuthorizationGuard(new Reflector(),{} as never);
  await expect(guard.canActivate(ctx(Legacy))).rejects.toMatchObject({status:403});
 });
 it('propagates a permission denial without fallback',async()=>{
  const guard=new AuthorizationGuard(new Reflector(),{canActivate:async()=>{throw new ForbiddenException();}} as never);
  await expect(guard.canActivate(ctx(Resource))).rejects.toMatchObject({status:403});
 });
 it('denies missing action metadata',async()=>{
  const permission=new PermissionGuard(new Reflector(),{} as never);
  await expect(permission.canActivate(ctx(Resource,'forgotten'))).rejects.toMatchObject({status:403});
 });
 it.each([undefined,0,-1,'1',1.5])('requires a valid persisted identity: %s',async id=>{
  const guard=new PermissionGuard(new Reflector(),{} as never);
  await expect(guard.canActivate(ctx(Resource,'list',{id}))).rejects.toMatchObject({status:401});
 });
 it('allows explicit public exceptions and authenticated session routes',async()=>{
  const guard=new AuthorizationGuard(new Reflector(),{} as never);
  expect(await guard.canActivate(ctx(Resource,'public',null))).toBe(true);
  expect(await guard.canActivate(ctx(Session))).toBe(true);
  await expect(guard.canActivate(ctx(Session,'list',null))).rejects.toMatchObject({status:401});
 });
});

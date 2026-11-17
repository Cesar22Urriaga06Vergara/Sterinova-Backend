import { describe, it, expect } from 'vitest';
import { resourceWhere, creationScope } from './resource-access.js';
const context={permission:'clientes.ver',policy:{userId:8,scopeIds:[2],ownScopeIds:[3]},resourceScopeIds:[2,3]} as const;
describe('SQL resource predicates',()=>{
 it('keeps OWN bound to its own scope and persisted actor',()=>{
  const rows=resourceWhere(context as never,{id:4});
  expect(rows).toHaveLength(2);expect(rows[0]).not.toHaveProperty('creador_id');expect(rows[1]).toHaveProperty('creador_id',8);
  expect(rows.every(r=>r.id===4)).toBe(true);
 });
 it('denies missing or empty context',()=>{
  expect(()=>resourceWhere(undefined as never)).toThrow();
  expect(()=>resourceWhere({...context,policy:{userId:8,scopeIds:[],ownScopeIds:[]}} as never)).toThrow();
 });
 it('does not guess among multiple creation scopes',()=>expect(()=>creationScope(context as never)).toThrow());
 it('derives the creation scope from the anchor resource',()=>{
  expect(creationScope(context as never,3)).toBe(3);
 });
 it('rejects an unauthorized anchor even with only one eligible scope',()=>{
  expect(()=>creationScope({...context,policy:{userId:8,scopeIds:[2],ownScopeIds:[]},resourceScopeIds:[2]} as never,9)).toThrow();
 });
 it('never relocates an anchored resource through x-scope-id',()=>{
  expect(()=>creationScope({...context,scopeId:2} as never,3)).toThrow();
  expect(creationScope({...context,scopeId:3} as never,3)).toBe(3);
 });
 it('rejects an anchor outside eligible scopes when several exist',()=>{
  expect(()=>creationScope(context as never,9)).toThrow();
 });
 it('auto-selects the single eligible scope without anchor',()=>{
  expect(creationScope({...context,policy:{userId:8,scopeIds:[2],ownScopeIds:[]},resourceScopeIds:[2]} as never)).toBe(2);
 });
 it('auto-selects the unique DEPARTMENT scope among several',()=>{
  const multi={...context,resourceScopes:[{id:2,kind:'DEPARTMENT'},{id:3,kind:'TEAM'}]} as never;
  expect(creationScope(multi)).toBe(2);
 });
 it('honors an explicit x-scope-id narrowing',()=>{
  expect(creationScope({...context,scopeId:3} as never)).toBe(3);
  expect(()=>creationScope({...context,scopeId:9} as never)).toThrow();
 });
});

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
});

import { resourceWhere, creationScope } from '../rbac/resource-access.js';
import type { PermissionContext } from '../rbac/rbac-authorization.service.js';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, QueryFailedError, Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity.js';
import { CreateClienteDto } from './dto/create-cliente.dto.js';
import { UpdateClienteDto } from './dto/update-cliente.dto.js';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clientesRepository: Repository<Cliente>,
  ) {}

  create(createClienteDto: CreateClienteDto, access: PermissionContext): Promise<Cliente> {
    const cliente = this.clientesRepository.create({ ...createClienteDto, scope_id: creationScope(access), creador_id: access.policy.userId });
    return this.clientesRepository.save(cliente);
  }

  async bulk(
    createClienteDtos: CreateClienteDto[],
    access: PermissionContext,
  ): Promise<{ imported: number; skipped: number }> {
    const uniqueClients = new Map<string, CreateClienteDto>();
    let skipped = 0;
    for (const cliente of createClienteDtos) {
      if (uniqueClients.has(cliente.nit)) {
        skipped += 1;
      } else {
        uniqueClients.set(cliente.nit, cliente);
      }
    }

    let pending = [...uniqueClients.values()];
    if (pending.length === 0) {
      return { imported: 0, skipped };
    }

    const existing = await this.clientesRepository.find({
      where: { nit: In(pending.map(({ nit }) => nit)) },
    });
    const existingNits = new Set(existing.map(({ nit }) => nit));
    const filteredClients = pending.filter(({ nit }) => !existingNits.has(nit));
    skipped += pending.length - filteredClients.length;
    pending = filteredClients;

    while (pending.length > 0) {
      try {
        await this.clientesRepository.save(
          this.clientesRepository.create(pending.map(dto => ({...dto, scope_id: creationScope(access), creador_id: access.policy.userId}))),
        );
        return { imported: pending.length, skipped };
      } catch (error) {
        if (!this.isDuplicateNitError(error)) {
          throw error;
        }

        const nowExisting = await this.clientesRepository.find({
          where: { nit: In(pending.map(({ nit }) => nit)) },
        });
        const nowExistingNits = new Set(nowExisting.map(({ nit }) => nit));
        const retry = pending.filter(({ nit }) => !nowExistingNits.has(nit));
        if (retry.length === pending.length) {
          throw error;
        }

        skipped += pending.length - retry.length;
        pending = retry;
      }
    }

    return { imported: 0, skipped };
  }

  private isDuplicateNitError(error: unknown): boolean {
    return (
      error instanceof QueryFailedError &&
      typeof error.driverError === 'object' &&
      error.driverError !== null &&
      'code' in error.driverError &&
      error.driverError.code === 'ER_DUP_ENTRY'
    );
  }

  findAll(access: PermissionContext): Promise<Cliente[]> {
    return this.clientesRepository.find({
      where: resourceWhere<Cliente>(access),
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number, access: PermissionContext): Promise<Cliente> {
    const cliente = await this.clientesRepository.findOne({ where: resourceWhere<Cliente>(access, { id }) });
    if (!cliente) {
      throw new NotFoundException(`Cliente #${id} no encontrado`);
    }
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto, access: PermissionContext): Promise<Cliente> {
    const cliente = await this.findOne(id, access);
    Object.assign(cliente, updateClienteDto);
    return this.clientesRepository.save(cliente);
  }

  async remove(id: number, access: PermissionContext): Promise<{ message: string }> {
    const cliente = await this.findOne(id, access);
    await this.clientesRepository.remove(cliente);
    return { message: `Cliente #${id} eliminado` };
  }
}

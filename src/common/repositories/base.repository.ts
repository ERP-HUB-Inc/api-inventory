import {
  Repository,
  FindManyOptions,
  FindOneOptions,
  DeepPartial,
  SelectQueryBuilder,
} from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  withDeleted?: boolean;
}

@Injectable()
export class BaseRepository<T> {
  protected limit: number = 15;
  protected offset: number = 0;

  constructor(protected readonly repository: Repository<T>) {}

  // ============================
  // 🔍 READ OPERATIONS
  // ============================

  findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  findById(id: string): Promise<T | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  // ============================
  // 📝 WRITE OPERATIONS
  // ============================

  create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) throw new NotFoundException(`Entity with id "${id}" not found.`);
    const updated = this.repository.merge(entity, data);
    return this.repository.save(updated);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Entity with id "${id}" not found.`);
    }
  }

  // Soft delete (if supported by the entity)
  async softDelete(id: string): Promise<void> {
    const result = await this.repository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Entity with id "${id}" not found.`);
    }
  }

  // ============================
  // 📊 UTILITY METHODS
  // ============================

  count(options?: FindManyOptions<T>): Promise<number> {
    return this.repository.count(options);
  }

  protected getQueryBuilder(alias: string): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(alias);
  }

  /**
   * Finds and paginates results with optional filters.
   */
  async paginateAndFilter(
    alias: string,
    options: PaginationOptions = {},
    applyFilters?: (qb: SelectQueryBuilder<T>) => void
  ): Promise<{ data: T[]; total: number }> {
    const qb = this.getQueryBuilder(alias);

    // Apply filters
    if (applyFilters) {
      applyFilters(qb);
    }

    // Soft delete handling
    if (options.withDeleted) {
      qb.withDeleted();
    }

    // Ordering
    if (options.orderBy) {
      qb.orderBy(`${alias}.${options.orderBy}`, options.orderDirection ?? 'ASC');
    }

    // Pagination
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const offset = (page - 1) * limit;

    qb.skip(offset).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }
}

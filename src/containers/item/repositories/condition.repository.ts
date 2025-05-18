import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@common/repositories/base.repository';
import { ProductCondition } from '@item/entities/condition.entity';

@Injectable()
export class ConditionRepository extends BaseRepository<ProductCondition> {
  constructor(@InjectRepository(ProductCondition) readonly repository: Repository<ProductCondition>) {
    super(repository);
  }
}

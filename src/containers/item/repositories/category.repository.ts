import { BaseRepository } from '@common/repositories/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '@item/entities/index';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
  constructor(@InjectRepository(Category) readonly repository: Repository<Category>) {
    super(repository);
  }
}

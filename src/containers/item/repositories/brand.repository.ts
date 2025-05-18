import { BaseRepository } from '@common/repositories/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from '@item/entities/index';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class BrandRepository extends BaseRepository<Brand> {
  constructor(@InjectRepository(Brand) readonly repository: Repository<Brand>) {
    super(repository);
  }
}

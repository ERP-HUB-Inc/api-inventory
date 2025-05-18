import { BaseRepository } from '@common/repositories/base.repository';
import { Attribute } from '@item/entities/attribute.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AttributeRepository  extends BaseRepository<Attribute>  {
  constructor(@InjectRepository(Attribute) readonly repository: Repository<Attribute>) {
    super(repository);
  }
}

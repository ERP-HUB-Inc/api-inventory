import BaseRepository from '../../../core/common/repositories/BaseRepository';
import ProductTag from '../entities/ProductTag';
import { EntityRepository } from 'typeorm';
import Brand from '../entities/Brand';

@EntityRepository(ProductTag)
export default class ProductTagRepository extends BaseRepository {
  entityName: string = 'ProductTag';

  selectField: string[] = [
    'id',
    'tagId',
    'productId',
    'status',
    'createdAt',
    'updatedAt',
  ];

  constructor() {
    super();
  }
}

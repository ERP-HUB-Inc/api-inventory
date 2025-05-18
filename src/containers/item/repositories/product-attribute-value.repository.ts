import BaseRepository from '../../../core/common/repositories/BaseRepository';
import ProductAttributeValue from '../entities/ProductAttributeValue';
import { EntityRepository } from 'typeorm';

@EntityRepository(ProductAttributeValue)
export default class ProductAttributeValueRepository extends BaseRepository {
  entityName: string = 'ProductAttributeValue';

  selectField: string[] = [
    'id',
    'productAttributeId',
    'name',
    'description',
    'status',
    'createdAt',
    'updatedAt',
  ];

  constructor() {
    super();
  }
}

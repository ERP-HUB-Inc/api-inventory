import BaseRepository from '../../../core/common/repositories/BaseRepository';
import ProductTax from '../entities/ProductTax';
import { EntityRepository } from 'typeorm';

@EntityRepository(ProductTax)
export default class ProductTaxRepository extends BaseRepository {
  entityName: string = 'ProductTax';

  selectField: string[] = [
    'id',
    'taxId',
    'productId',
    'rate',
    'status',
    'createdAt',
    'updatedAt',
  ];

  constructor() {
    super();
  }
}

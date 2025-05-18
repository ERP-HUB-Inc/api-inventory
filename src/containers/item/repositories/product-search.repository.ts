import BaseRepository from '../../../core/common/repositories/BaseRepository';
import { EntityRepository } from 'typeorm';
import Product from '../entities/Product';

@EntityRepository(Product)
export default class ProductSearchRepository extends BaseRepository {
  entityName: string = 'Product';

  selectField: string[] = [
    'id',
    'clientId',
    'categoryId',
    'brandId',
    'stockUnitId',
    'image',
    'serialType',
    'barcode',
    'quantity',
    'reorderPoint',
    'factoryCost',
    'cost',
    'price',
    'isAvialableSale',
    'isPublic',
    'type',
    'status',
    'createdAt',
    'updatedAt',
  ];

  constructor() {
    super();
  }
}

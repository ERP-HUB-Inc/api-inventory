import BaseRepository from '../../../core/common/repositories/BaseRepository';
import ProductPackage from '../entities/ProductPackage';
import { EntityRepository } from 'typeorm';

@EntityRepository(ProductPackage)
export default class ProductPackageRepository extends BaseRepository {
  entityName: string = 'ProductPackage';

  selectField: string[] = [
    'id',
    'productId',
    'rawProductId',
    'quantity',
    'status',
    'createdAt',
    'updatedAt',
  ];

  constructor() {
    super();
  }
}

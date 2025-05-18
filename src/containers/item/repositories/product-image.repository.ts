import BaseRepository from '../../../core/common/repositories/BaseRepository';
import ProductImage from '../entities/ProductImage';
import { EntityRepository } from 'typeorm';

@EntityRepository(ProductImage)
export default class ProductImageRepository extends BaseRepository {
  entityName: string = 'ProductImage';

  selectField: string[] = [
    'id',
    'productId',
    'image',
    'order',
    'status',
    'createdAt',
    'updatedAt',
  ];

  constructor() {
    super();
  }
}

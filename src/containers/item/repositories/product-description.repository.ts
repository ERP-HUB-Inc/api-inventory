import BaseRepository from '../../../core/common/repositories/BaseRepository';
import ProductDescription from '../entities/ProductDescription';
import { EntityRepository } from 'typeorm';
import Brand from '../entities/Brand';

@EntityRepository(ProductDescription)
export default class ProductDescriptionRepository extends BaseRepository {
  entityName: string = 'ProductDescription';

  selectField: string[] = [
    'id',
    'productId',
    'languageId',
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

import BaseRepository from '../../../core/common/repositories/BaseRepository';
import ProductTypeDescription from '../entities/ProductTypeDescription';
import { EntityRepository } from 'typeorm';

@EntityRepository(ProductTypeDescription)
export default class ProductTypeDescriptionRepository extends BaseRepository {
  entityName: string = 'ProductTypeDescription';

  selectField: string[] = [
    'id',
    'productTypeId',
    'languageId',
    'name',
    'description',
    'status',
    'createdAt',
    'updatedAt',
  ];
}

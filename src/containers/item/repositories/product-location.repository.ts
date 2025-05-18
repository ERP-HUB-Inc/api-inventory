import BaseRepository from '../../../core/common/repositories/BaseRepository';
import ProductLocation from '../entities/ProductLocation';
import { EntityRepository } from 'typeorm';

@EntityRepository(ProductLocation)
export default class ProductLocationRepository extends BaseRepository {
  entityName: string = 'ProductLocation';

  selectField: string[] = [
    'id',
    'locationId',
    'clientId',
    'productVariantId',
    'quantity',
    'status',
    'createdAt',
    'updatedAt',
  ];
}

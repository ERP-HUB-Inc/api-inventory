import BaseRepository from '../../../core/common/repositories/BaseRepository';
import Filter from '../../../core/common/filters';
import ProductLog from '../entities/ProductLog';
import { EntityRepository } from 'typeorm';

@EntityRepository(ProductLog)
export default class ProductLogRepository extends BaseRepository {
  entityName: string = 'ProductLog';

  selectField: string[] = [
    'id',
    'userId',
    'productVariantId',
    'name',
    'description',
    'status',
    'createdAt',
    'updatedAt',
  ];

  constructor() {
    super();
  }

  async findMany(filter: Filter): Promise {
    const entities: string[] = ['User'];

    const conditionString = `${this.entityName}.productVariantId = :productVariantId`;
    const conditionObject = { productVariantId: filter.condition['id'] };

    return await this.findManyQueryBuilder(
      ProductLog,
      [
        {
          entityName: entities[0],
          relation: 'user',
          select: ['id', 'userName', 'fullName'],
        },
      ],
      filter,
      [conditionString, conditionObject],
    ).getManyAndCount();
  }
}

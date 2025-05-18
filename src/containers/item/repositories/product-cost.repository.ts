import BaseRepository from '../../../core/common/repositories/BaseRepository';
import Filter from '../../../core/common/filters';
import ProductCost from '../entities/ProductCost';
import { EntityRepository } from 'typeorm';

@EntityRepository(ProductCost)
export default class ProductCostRepository extends BaseRepository {
  entityName: string = 'ProductCost';

  selectField: string[] = [
    'id',
    'productVariantId',
    'purchaseOrderId',
    'userId',
    'date',
    'cost',
    'status',
    'createdAt',
    'updatedAt',
  ];

  constructor() {
    super();
  }

  async findMany(filter: Filter): Promise {
    const entities: string[] = ['User', 'PurchaseOrder'];

    const conditionString = `${this.entityName}.productVariantId = :productVariantId`;
    const conditionObject = { productVariantId: filter.condition['id'] };

    return await this.findManyQueryBuilder(
      ProductCost,
      [
        {
          entityName: entities[0],
          relation: 'user',
          select: ['id', 'userName', 'fullName'],
        },
        {
          entityName: entities[1],
          relation: 'purchaseOrder',
          select: ['id', 'number'],
        },
      ],
      filter,
      [conditionString, conditionObject],
    ).getManyAndCount();
  }
}

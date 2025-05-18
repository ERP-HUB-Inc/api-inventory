import BaseRepository from '../../../core/common/repositories/BaseRepository';
import ProductAttribute from '../entities/ProductAttribute';
import { RecordStatus } from '../../../core/setting/enums';
import Filter from '../../../core/common/filters';
import { EntityRepository } from 'typeorm';

@EntityRepository(ProductAttribute)
export default class ProductAttributeRepository extends BaseRepository {
  entityName: string = 'ProductAttribute';

  selectField: string[] = [
    'id',
    'productId',
    'attributeId',
    'sort',
    'clientId',
    'status',
    'createdAt',
    'updatedAt',
  ];

  constructor() {
    super();
  }

  async findManyProductAttributes(productId: string, filter: Filter): Promise {
    const entities: string[] = ['Attribute', 'ProductAttributeValue'];

    return await this.findManyQueryBuilder(
      ProductAttribute,
      [
        {
          entityName: entities[0],
          relation: 'attribute',
          select: ['id', 'name'],
        },
        {
          entityName: entities[1],
          relation: 'attributeValues',
          select: ['id', 'name'],
          condition: [
            `${entities[1]}.status = :attributeValueStatus`,
            { attributeValueStatus: RecordStatus.Active },
          ],
        },
      ],
      filter,
      [`${this.entityName}.productId = :productId`, { productId }],
    ).getManyAndCount();
  }

  async findAllProductAttributes(filter: Filter): Promise {
    const entities: string[] = ['Attribute', 'ProductAttributeValue'];

    return await this.findManyQueryBuilder(
      ProductAttribute,
      [
        {
          entityName: entities[0],
          relation: 'attribute',
          select: ['id', 'name'],
        },
        {
          entityName: entities[1],
          relation: 'attributeValues',
          select: ['id', 'name'],
          condition: [
            `${entities[1]}.status = :attributeValueStatus`,
            { attributeValueStatus: RecordStatus.Active },
          ],
        },
      ],
      filter,
    ).getManyAndCount();
  }
}

import ProductAttributeValueRepository from '../repositories/ProductAttributeValueRepository';
import ProductAttributeRepository from '../repositories/ProductAttributeRepository';
import AttributeRepository from '../repositories/AttributeRepository';
import ProductAttributeValue from '../entities/ProductAttributeValue';
import BaseService from '../../../core/common/services/BaseService';
import ProductRepository from '../repositories/ItemRepository';
import { ModelStatus } from '../../../../enums/ModelStatus';
import ProductAttribute from '../entities/ProductAttribute';
import { getCustomRepository, getManager } from 'typeorm';
import Filter from '../../../core/common/filters';
import { Service } from 'typedi';

@Service()
export default class ProductAttributeService extends BaseService {
  private productRepository: ProductRepository;
  private attributeRepository: AttributeRepository;
  private productAttributeRepository: ProductAttributeRepository;
  private productAttributeValueRepository: ProductAttributeValueRepository;

  constructor() {
    super();
    this.repository = getCustomRepository(ProductAttributeRepository);
    this.productAttributeRepository = getCustomRepository(
      ProductAttributeRepository,
    );
    this.productRepository = getCustomRepository(ProductRepository);
    this.attributeRepository = getCustomRepository(AttributeRepository);
    this.productAttributeValueRepository = getCustomRepository(
      ProductAttributeValueRepository,
    );
  }

  async findManyAttributes(id, filter: Filter) {
    this.productAttributeRepository.clientId = this.clientId;
    const results =
      await this.productAttributeRepository.findManyProductAttributes(
        id,
        filter,
      );
    return this.responses(results[0], results[1]);
  }

  async findAllProductAttributes(filter: Filter) {
    this.productAttributeRepository.clientId = this.clientId;
    const results =
      await this.productAttributeRepository.findAllProductAttributes(filter);
    return this.responses(results[0], results[1]);
  }

  private async saveRecord(data: ProductAttribute, condition?: object) {
    await getManager().transaction(async (manager) => {
      // SAVE PRODUCT ATTRIBUTE
      let attribute = new ProductAttribute();
      if (condition == null || condition['id'] == null) {
        attribute = Object.assign(attribute, data);
        attribute.id = await this.repository.generateUUId();

        if (data['sort'] == null || data['sort'] == 0) {
          const resultCount = await this.repository.findMany({
            clientId: data.clientId,
            condition: {
              productId: data.productId,
              status: ModelStatus.ACTIVE,
            },
          });
          attribute.sort = resultCount == null ? 0 : resultCount.length;
        }
      } else {
        attribute = await this.repository.findOneByFieldName({
          id: condition['id'],
        });
        attribute = Object.assign(attribute, data);
      }

      const resultAttribute = await manager.save(
        this.repository.entityName,
        attribute,
      );

      // SAVE PRODUCT ATTRIBUTE VALUE
      const attributeValueString = 'values';
      const attributeValues = data[attributeValueString];
      if (attributeValueString in data && Array.isArray(attributeValues)) {
        const length = attributeValues.length;
        for (var i = 0; i < length; i++) {
          let attributeValue: ProductAttributeValue = null;
          if (attributeValues[i].id == null || attributeValues[i].id == '') {
            attributeValue = new ProductAttributeValue();
            attributeValue.productAttributeId = resultAttribute.id;
            attributeValue.name = attributeValues[i].name;
            attributeValue.description = attributeValues[i].description;
            attributeValue.id =
              await this.productAttributeValueRepository.generateUUId(i + 1);
          } else {
            attributeValue =
              await this.productAttributeValueRepository.findOneByFieldName({
                id: attributeValues[i].id,
              });
            attributeValue.name = attributeValues[i].name;
            attributeValue.description = attributeValues[i].description;
            attributeValue.status =
              attributeValues[i].status == null
                ? ModelStatus.ACTIVE
                : attributeValues[i].status;
          }
          const resultProductDescription = await manager.save(
            this.productAttributeValueRepository.entityName,
            attributeValue,
          );
          attributeValues[i] = resultProductDescription;
        }
      }

      data = resultAttribute;
    });

    return data;
  }

  async create(data: ProductAttribute) {
    return this.response(await this.saveRecord(data));
  }

  async update(data: ProductAttribute, condition: object) {
    return this.response(await this.saveRecord(data, condition));
  }
}

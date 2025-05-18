import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { ProductAttribute } from './product-attribute.entity';

@Entity('ProductAttributeValue')
export class ProductAttributeValue extends BaseEntity {
  @Column()
  productAttributeId: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => ProductAttribute, (productAttribute) => productAttribute.attributeValues)
  productAttribute: ProductAttribute;
}

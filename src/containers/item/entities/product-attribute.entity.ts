import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Attribute } from './attribute.entity';
import { BaseEntity } from '@common/entities/base.entity';
import { Product } from './product.entity';
import { ProductAttributeValue } from './product-attribute-value.entity';

@Entity('ProductAttribute')
export class ProductAttribute extends BaseEntity {
  @Column()
  productId: string;

  @Column()
  attributeId: string;

  @Column()
  sort: number;

  @OneToOne(() => Attribute)
  @JoinColumn()
  attribute: Attribute;

  @ManyToOne(() => Product, (product) => product.productAttributes)
  product: Product;

  @OneToMany(() => ProductAttributeValue, (productAttributeValue) => productAttributeValue.productAttribute,
  )
  attributeValues: ProductAttributeValue[];
}

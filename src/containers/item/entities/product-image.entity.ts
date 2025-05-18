import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { Product } from './product.entity';

@Entity('ProductImage')
export class ProductImage extends BaseEntity {
  @Column()
  productId: string;

  @Column()
  image: string;

  @Column()
  order: number;

  @ManyToOne(() => Product, product => product.productImages)
  product: Product;
}

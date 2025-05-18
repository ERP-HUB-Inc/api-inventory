import { Column, Entity, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('ProductPackage')
export class ProductPackage extends BaseEntity {
  @Column()
  productId: string;

  @Column()
  rawProductId: string;

  @Column()
  quantity: number;

  @OneToOne(() => ProductVariant)
  @JoinColumn()
  rawProduct: ProductVariant;

  @ManyToOne(() => ProductVariant, (productVariant) => productVariant.productPackages)
  product: ProductVariant;
}

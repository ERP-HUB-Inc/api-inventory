import { Column, Entity, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { ProductVariant } from './product-variant.entity';
import Promotion from './promotion.entity';

@Entity('ProductDiscount')
export class ProductDiscount extends BaseEntity {
  @Column()
  promotionId: string;

  @Column()
  productId: string;

  @Column()
  productVariantId: string;

  @Column()
  variantName: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column()
  dateStart: Date;

  @Column()
  dateEnd: Date;

  @OneToOne(() => ProductVariant)
  @JoinColumn()
  productVariant: ProductVariant;

  @ManyToOne(() => Promotion, (promotion: Promotion) => promotion.productDiscount)
  promotion: Promotion;
}

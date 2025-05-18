import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  ManyToOne
} from 'typeorm';
import { PromotionCriteria } from './promotion-criteria.entity';
import { ProductVariant } from './product-variant.entity';
import { BaseEntity } from '@common/entities/base.entity';

@Entity('PromotionCriteriaProduct')
export class PromotionCriteriaProduct extends BaseEntity  {
  @Column()
  promotionId: string;

  @Column()
  promotionCriteriaId: string;

  @Column()
  productId: string;

  @Column()
  productVariantId: string;

  @Column()
  productName: string;

  @Column()
  barcode: string;

  @Column()
  type: string;

  @OneToOne(() => ProductVariant, (productVariant: ProductVariant) => productVariant.promotionCriteriaProduct)
  @JoinColumn()
  productVariant: ProductVariant;

  @ManyToOne(() => PromotionCriteria, (promotionCriteria: PromotionCriteria) => promotionCriteria.buyQuantity,)
  @JoinColumn({ name: 'promotionCriteriaId' })
  buyCriteria: PromotionCriteria;

  @ManyToOne(() => PromotionCriteria, (promotionCriteria: PromotionCriteria) => promotionCriteria.thenGetProducts)
  @JoinColumn({ name: 'promotionCriteriaId' })
  thenCriteria: PromotionCriteria;
}

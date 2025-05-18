import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { Location } from './location.entity';
import { PromotionCriteria } from './promotion-criteria.entity';
import { ProductDiscount } from './product-discount.entity';

@Entity('Promotion')
export class Promotion extends BaseEntity {
  static BASIC = 'basic';
  static ADVANCE = 'advance';
  static DISCOUNT_TYPE = {
    AMOUNT: 0,
    PERCENTAGE: 1,
  };

  @Column()
  locationId: string;

  @Column()
  name: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ type: 'enum', enum: ['basic', 'advance'] })
  type: string;

  @Column()
  discount: number;

  @Column()
  discountType: number;

  @Column({ type: 'enum', enum: ['all', 'specific'] })
  targetProduct: string;

  @Column({ default: 0 })
  isFeatured: number;

  @OneToMany(() => ProductDiscount, (productDiscount) => productDiscount.promotion)
  productDiscount: ProductDiscount[];

  @OneToMany(() => PromotionCriteria, (promotionCriteria) => promotionCriteria.promotion)
  promotionCriterias: PromotionCriteria[];

  @ManyToOne(() => Location)
  @JoinColumn()
  location: Location;

  promotionCriteria: PromotionCriteria;
}

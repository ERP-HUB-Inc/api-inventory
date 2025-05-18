import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { PromotionCriteriaProduct } from './promotion-criteria-product.entity';
import { Promotion } from './promotion.entity';

@Entity('PromotionCriteria')
export class PromotionCriteria extends BaseEntity {
  static BUY_FOLLOWING_ITEMS = 'BUY_ITEMS';
  static SPEND_WITH_AMOUNT = 'SPEND_AMOUNT';
  static GET_ITEMS = 'GET_ITEMS';
  static SAVE_AMOUNT = 'SAVE_AMOUNT';
  static WHEN_TARGET = { ALL: 'all', SPECIFIC: 'specific' };
  static THEN_TARGET = { ALL: 'all', SPECIFIC: 'specific' };

  @Column()
  promotionId: string;

  @Column()
  when: string;

  @Column()
  whenTarget: string;

  @Column()
  buyQuantity: number;

  @Column()
  spendAmount: number;

  @Column()
  then: string;

  @Column()
  getQuantity: number;

  @Column()
  getPercentage: number;

  @Column()
  getAmount: number;

  @Column()
  thenTarget: string;

  @ManyToOne(() => Promotion, (promotion) => promotion.promotionCriterias)
  promotion: Promotion;

  @OneToMany(() => PromotionCriteriaProduct, (promotionCriteriaProducts) => promotionCriteriaProducts.buyCriteria)
  whenBuyProducts: PromotionCriteriaProduct[];

  @OneToMany(() => PromotionCriteriaProduct, (promotionCriteriaProducts) => promotionCriteriaProducts.thenCriteria)
  thenGetProducts: PromotionCriteriaProduct[];
}

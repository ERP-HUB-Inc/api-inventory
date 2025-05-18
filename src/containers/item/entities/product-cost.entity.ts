import { Column, Entity, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { ProductVariant } from './product-variant.entity';
import { User } from './user.entity';

@Entity('ProductCost')
export class ProductCost extends BaseEntity {
  @Column()
  productVariantId: string;

  @Column()
  purchaseOrderId: string;

  @Column()
  userId: string;

  @Column()
  date: Date;

  @Column()
  cost: number;

  @ManyToOne(() => ProductVariant, (productVariant: ProductVariant) => productVariant.productCosts)
  productVariant: ProductVariant;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}

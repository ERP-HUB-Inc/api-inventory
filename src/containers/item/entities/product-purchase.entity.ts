import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('ProductPurchase')
export class ProductPurchase extends BaseEntity {
  @Column()
  purchaseOrderId: string;

  @Column()
  supplierId: string;

  @Column()
  productVariantId: string;

  @Column()
  orderDate: Date;

  @Column()
  quantity: number;

  @Column()
  cost: number;

  @Column()
  expiredDate: Date;
}

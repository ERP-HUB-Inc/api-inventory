import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { StockCount } from '.';
import { BaseEntity } from '@common/entities/base.entity';
import { Product } from '@item/entities/product.entity';
import { ProductVariant } from '@item/entities/index';

@Entity('StockCountEntry')
export class StockCountEntry extends BaseEntity {
  @Column()
  stockCountId: string;

  @Column()
  productId: string;

  @Column()
  productVariantId: string;

  @Column()
  expected: number;

  @Column()
  count: number;

  @Column()
  cost: number;

  @OneToMany(() => StockCount, (stockCount) => stockCount.stockCountEntries)
  stockCount: StockCount;

  @OneToOne(() => Product)
  @JoinColumn()
  product: Product;

  @OneToOne(() => ProductVariant)
  @JoinColumn()
  productVariant: ProductVariant;
}

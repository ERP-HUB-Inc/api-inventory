import { Column, Entity, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { StockAdjustment } from './stock-adjustment.entity';
import { ProductVariant } from '@item/entities/product-variant.entity';
import { BaseEntity } from '@common/entities/base.entity';

@Entity('StockAdjustmentEntry')
export class StockAdjustmentEntry extends BaseEntity {
  @Column()
  stockAdjustmentId: string;

  @Column()
  productVariantId: string;

  @Column()
  productName: string;

  @Column()
  variantName: string;

  @Column()
  barcode: string;

  @Column()
  currentQuantity: number;

  @Column()
  adjustQuantity: number;

  @Column()
  unitId: string;

  @ManyToOne(() => StockAdjustment, (stockAdjustment) => stockAdjustment.details)
  stockAdjustment: StockAdjustment;

  @OneToOne(() => ProductVariant)
  @JoinColumn()
  productVariant: ProductVariant;
}

import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Expose } from 'class-transformer';
import { BaseEntity } from '@common/entities/base.entity';
import { PromotionCriteriaProduct } from './promotion-criteria-product.entity';
import { ProductLocation } from './product-location.entity';
import { ProductPackage } from './product-package.entity';
import { ProductCost } from './product-cost.entity';
import { ProductLog } from './product-log.entity';
import { Product } from './product.entity';

@Entity('ProductVariant')
export class ProductVariant extends BaseEntity {
  @Column()
  @Expose()
  productId: string;

  @Column()
  @Expose()
  clientId: string;

  @Column()
  @Expose()
  productAttributeValueId: string;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  image: string;

  @Column()
  @Expose()
  cost: number;

  @Column()
  @Expose()
  price: number;

  @Column()
  @Expose()
  wholePrice: number;

  @Column()
  @Expose()
  distributePrice: number;

  @Column()
  @Expose()
  quantity: number;

  @Column()
  @Expose()
  reorderPoint: number;

  @Column()
  @Expose()
  factoryCost: number;

  @Column()
  @Expose()
  barcode: string;

  @Column()
  @Expose()
  isAutoGenerateBarcode: number;

  @Column()
  @Expose()
  sku: string;

  @Column()
  @Expose()
  isAutoGenerateSKU: number;

  @OneToMany(() => ProductLocation, (productLocation) => productLocation.productVariant)
  @Expose()
  productLocations: ProductLocation[];

  @OneToMany(() => ProductPackage, (productPackage: ProductPackage) => productPackage.rawProduct)
  @Expose()
  productPackages: ProductPackage[];

  @ManyToOne(() => Product, (product) => product.productVariants)
  @Expose()
  product: Product;

  @OneToMany(() => ProductLog, (productLog) => productLog.productVariant)
  @Expose()
  ProductLogs: ProductLog[];

  @OneToMany(() => ProductCost, (productCost: ProductCost) => productCost.productVariant)
  @Expose()
  productCosts: ProductCost[];

  @OneToOne(() => PromotionCriteriaProduct, (promotionCriteriaProduct: PromotionCriteriaProduct) => promotionCriteriaProduct.productVariant)
  @Expose()
  promotionCriteriaProduct: PromotionCriteriaProduct;

  getAvgCost(newStockQuantity: number, newStockCost: number) {
    return ((this.quantity * this.cost + newStockQuantity * newStockCost) / (this.quantity + newStockQuantity));
  }
}

import {
  Column,
  Entity,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { Expose } from 'class-transformer';
import { ProductAttribute } from './product-attribute.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';
import { ProductTag } from './product-tag.entity';
import { ProductCondition } from './condition.entity';
import { Category } from './category.entity';
import { Supplier } from './supplier.entity';
import { Brand } from './bran.entity';
import { Unit } from './unit.entity';
import { BaseEntity } from '@common/entities/base.entity';

@Entity('Product')
export class Product extends BaseEntity {
  @ManyToMany(() => Product)
  @JoinTable({
    name: 'ProductPackage',
    joinColumns: [{ name: 'productId' }],
    inverseJoinColumns: [{ name: 'rawProductId' }],
  })
  rawProducts: Product[];

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'ProductPackage',
    joinColumns: [{ name: 'rawProductId' }],
    inverseJoinColumns: [{ name: 'productId' }],
  })
  products: Product[];

  @Column()
  clientId: string;

  @Column()
  @Expose()
  categoryId: string;

  @Column()
  @Expose()
  brandId: string;

  @Column()
  @Expose()
  unitOfMeasurementId: string;

  @Column()
  @Expose()
  stockUnitId: string;

  @Column()
  @Expose()
  sellUnitId: string;

  @Column()
  @Expose()
  unitConversion: number;

  @Column()
  @Expose()
  defaultLocationId: string;

  @Column()
  @Expose()
  taxId: string;

  @Column()
  @Expose()
  supplierId: string;

  @Column()
  @Expose()
  preferredSupplierId: string;

  @Column()
  @Expose()
  manufacturerId: string;

  @Column()
  @Expose()
  supplierItemCode: string;

  @Column()
  @Expose()
  purchasePrice: number;

  @Column()
  @Expose()
  supplierPercentage: number;

  @Column()
  @Expose()
  conditionId: string;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  namekm: string;

  @Column()
  @Expose()
  namebm: string;

  @Column()
  @Expose()
  minPrice: number;

  @Column()
  @Expose()
  description: string;

  @Column()
  @Expose()
  specification: string;

  @Column()
  @Expose()
  highlightTag: string;

  @Column()
  @Expose()
  image: string;

  @Column()
  @Expose()
  videoUrl: string;

  @Column()
  @Expose()
  enableInventoryTracking: boolean;

  @Column()
  @Expose()
  serialType: number;

  @Column()
  @Expose()
  reorderPoint: number;

  @Column()
  @Expose()
  soldQuantity: number;

  @Column()
  @Expose()
  shippingFee: number;

  @Column()
  @Expose()
  tag: string;

  @Column()
  @Expose()
  isAvialableSale: boolean;

  @Column()
  @Expose()
  isPublic: boolean;

  @Column()
  @Expose()
  isSplittable: boolean;

  @Column({ default: false })
  @Expose()
  enableDescription: boolean;

  @Column()
  @Expose()
  warrantyDuration: number;

  @Column()
  @Expose()
  warrantyDurationType: string;

  @Column()
  @Expose()
  isFeatured: boolean;

  @Column()
  @Expose()
  isAutoGenerateBarcode: number;

  @Column()
  @Expose()
  isAutoGenerateSKU: number;

  @Column()
  @Expose()
  type: number;

  @Column()
  @Expose()
  productOption: number;

  @ManyToOne(() => Brand, (brand) => brand.products)
  brand: Brand;

  @OneToOne(() => Unit)
  @JoinColumn()
  unitOfMeasurement: Unit;

  @OneToOne(() => Unit)
  @JoinColumn()
  stockUnit: Unit;

  @OneToOne(() => Unit)
  @JoinColumn()
  sellUnit: Unit;

  @OneToOne(() => ProductCondition)
  @JoinColumn()
  condition: ProductCondition;

  @OneToOne(() => Supplier)
  @JoinColumn()
  supplier: Supplier;

  @ManyToOne(() => Category, (Category) => Category.products)
  category: Category;

  @OneToMany(() => ProductImage, (productImage) => productImage.product)
  productImages: ProductImage[];

  @OneToMany(() => ProductTag, (productTag) => productTag.productToProductTag)
  productTagToProduct: ProductTag[];

  @OneToMany(() => ProductAttribute, productAttribute => productAttribute.product)
  productAttributes: ProductAttribute[];

  @OneToMany(() => ProductVariant, (productVariant) => productVariant.product)
  productVariants: ProductVariant[];

  barcode: string;

  sku: string;

  price: number;

  wholePrice: number;

  distributePrice: number;

  factoryCost: number;
}

import {
    Column,
    Entity,
    OneToMany,
    ManyToMany,
    JoinTable,
    ManyToOne,
    OneToOne,
    JoinColumn,
    PrimaryColumn,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { Expose, Transform } from "class-transformer";
import Category from "./Category";
import Tag from "./Tag";
import Condition from "./Condition";
import Brand from "./Brand";
import ProductAttribute from "./ProductAttribute";
import Supplier from "./Supplier";
import ProductImage from "./ProductImage";
import ProductTag from "./ProductTag";
import ProductVariant from "./ProductVariant";
import Unit from "./Unit";
import Tax from "../../../sales/setting/models/Tax";
import Model from "../../../core/common/models/Model";
// import { UUIDBinary } from "../../../../utils/uuid-buffer";

@Entity("Product")
export default class Product extends Model {

    // @PrimaryColumn('binary', { length: 16 })
    // @Transform(({ value }) => { console.log("Dddd:", value.length); return UUIDBinary.getInstance().fromBuffer(value) })
    // id: Buffer;

    @ManyToMany(() => Tag)
    @JoinTable({
        name: "ProductTag",
        joinColumns: [
            { name: 'productId' }
        ],
        inverseJoinColumns: [
            { name: 'tagId' }
        ]
    })
    tags: Tag[];

    @ManyToMany(() => Product)
    @JoinTable({
        name: "ProductPackage",
        joinColumns: [
            { name: 'productId' }
        ],
        inverseJoinColumns: [
            { name: 'rawProductId' }
        ]
    })
    rawProducts: Product[];

    @ManyToMany(() => Product)
    @JoinTable({
        name: "ProductPackage",
        joinColumns: [
            { name: 'rawProductId' }
        ],
        inverseJoinColumns: [
            { name: 'productId' }
        ]
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

    // @Column({ default: 1, comment: "1=active, 0=deactive" })
    // @Expose()
    // status: number = 1;

    // @CreateDateColumn()
    // createdAt: Date;

    // @UpdateDateColumn()
    // updatedAt: Date;

    @ManyToOne(() => Brand, brand => brand.products)
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

    @OneToOne(() => Condition)
    @JoinColumn()
    condition: Condition;

    @OneToOne(() => Supplier)
    @JoinColumn()
    supplier: Supplier;

    @ManyToOne(() => Category, Category => Category.products)
    category: Category;

    @OneToMany(() => ProductImage, productImage => productImage.product)
    productImages: ProductImage[];

    @OneToOne(() => Tax)
    @JoinColumn()
    tax: Tax;

    @OneToMany(() => ProductTag, productTag => productTag.productToProductTag)
    productTagToProduct: ProductTag[];

    @OneToMany(() => ProductAttribute, productAttribute => productAttribute.product)
    productAttributes: ProductAttribute[];

    @OneToMany(() => ProductVariant, productVariant => productVariant.product)
    productVariants: ProductVariant[];

    barcode: string;

    sku: string;

    price: number;

    wholePrice: number;

    distributePrice: number;

    factoryCost: number;
    
}

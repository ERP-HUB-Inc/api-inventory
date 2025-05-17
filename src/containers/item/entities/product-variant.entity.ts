import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    OneToOne
} from "typeorm";
import { Expose } from "class-transformer";
import Product from "./Product";
import PromotionCriteriaProduct from "./PromotionCriteriaProduct";
import ProductLocation from "./ProductLocation";
import ProductPackage from "./ProductPackage";
import ProductLog from "./ProductLog";
import ProductCost from "./ProductCost";
import Model from "../../../core/common/models/Model";
import TransactionEntry from "../../../sales/transaction/models/TransactionEntry";
import PurchaseOrderEntry from "../../purchase/models/PurchaseOrderEntry";
import QuotationEntry from "../../../sales/quotation/models/QuotationEntry";
import Serial from "../../../sales/transaction/models/Serial";

@Entity("ProductVariant")
export default class ProductVariant extends Model {
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

    @OneToMany(() => ProductLocation, productLocation => productLocation.productVariant)
    @Expose()
    productLocations: ProductLocation[];

    @OneToMany(() => ProductPackage, productPackage => productPackage.rawProduct)
    @Expose()
    productPackages: ProductPackage[];

    @ManyToOne(() => Product, product => product.productVariants)
    @Expose()
    product: Product;

    @OneToMany(() => TransactionEntry, transactionEntry => transactionEntry.productVariant)
    @Expose()
    transactionEntries: TransactionEntry[];

    @OneToMany(() => PurchaseOrderEntry, purchaseOrderEntry => purchaseOrderEntry.productVariant)
    @Expose()
    purchaseOrderEntries: PurchaseOrderEntry[];

    @OneToMany(() => QuotationEntry, quotationEntry => quotationEntry.productVariant)
    @Expose()
    quotationEntries: QuotationEntry[];

    @OneToMany(() => Serial, serial => serial.productVariant)
    @Expose()
    serials: Serial[];

    @OneToMany(() => ProductLog, productLog => productLog.productVariant)
    @Expose()
    ProductLogs: ProductLog[];

    @OneToMany(() => ProductCost, productCost => productCost.productVariant)
    @Expose()
    productCosts: ProductCost[];

    @OneToOne(() => PromotionCriteriaProduct, promotionCriteriaProduct => promotionCriteriaProduct.productVariant)
    @Expose()
    promotionCriteriaProduct: PromotionCriteriaProduct;

    getAvgCost(newStockQuantity: number, newStockCost: number) {
        return ((this.quantity * this.cost) + (newStockQuantity * newStockCost)) / (this.quantity + newStockQuantity);
    }
}
import {
    Column,
    Entity,
    OneToMany,
    PrimaryColumn,
    OneToOne,
    JoinColumn
} from "typeorm";
import { StockCount } from ".";
import Product from "../../item/entities/Product";
import ProductVariant from "../../item/entities/ProductVariant";

@Entity("StockCountEntry")
export class StockCountEntry {

    @PrimaryColumn()
    id: string;

    @Column()
    clientId: string;

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

    @Column()
    status: string;//UNCOUNTED, COUNTED, INCLUDE, EXCLUDE

    @OneToMany(() => StockCount, stockCount => stockCount.stockCountEntries)
    stockCount: StockCount;

    @OneToOne(() => Product)
    @JoinColumn()
    product: Product;

    @OneToOne(() => ProductVariant)
    @JoinColumn()
    productVariant: ProductVariant;
}
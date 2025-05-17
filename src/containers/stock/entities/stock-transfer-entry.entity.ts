import {
    Column,
    Entity,
    ManyToOne,
    OneToOne,
    JoinColumn
} from "typeorm";
import { StockTransfer } from ".";
import ProductVariant from "../../item/entities/ProductVariant";
import Model from "../../../core/common/models/Model";

@Entity("StockTransferEntry")
export class StockTransferEntry extends Model {

    @Column()
    stockTransferId: string;

    @Column()
    productVariantId: string;

    @Column()
    productName: string;

    @Column()
    variantName: string;

    @Column()
    barcode: string;

    @Column()
    transferQuantity: number;

    @Column()
    receiveQuantity: number;

    @Column()
    price: number;

    @Column()
    unitId: string ;

    @ManyToOne(() => StockTransfer, stockTransfer => stockTransfer.stockTransferEntries)
    stockTransfer: StockTransfer;

    @OneToOne(() => ProductVariant)
    @JoinColumn()
    productVariant: ProductVariant;
}
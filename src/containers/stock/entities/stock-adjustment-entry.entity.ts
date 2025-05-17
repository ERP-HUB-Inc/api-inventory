import {
    Column,
    Entity,
    ManyToOne,
    OneToOne,
    JoinColumn
} from "typeorm";
import { StockAdjustment } from ".";
import Model from "../../../core/common/models/Model";
import ProductVariant from "../../item/entities/ProductVariant";

@Entity("StockAdjustmentEntry")
export class StockAdjustmentEntry extends Model {

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

    @ManyToOne(() => StockAdjustment, stockAdjustment => stockAdjustment.details)
    stockAdjustment: StockAdjustment;

    @OneToOne(() => ProductVariant)
    @JoinColumn()
    productVariant: ProductVariant;

    isApprove: number;
}
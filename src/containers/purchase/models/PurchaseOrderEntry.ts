import {
    Column,
    Entity,
    ManyToOne,
    OneToOne,
    JoinColumn
} from "typeorm";
import PurchaseOrder from "./PurchaseOrder";
import Model from "../../../core/common/models/Model";
import ProductVariant from "../../item/entities/ProductVariant";
import Unit from "../../item/entities/Unit";

@Entity("PurchaseOrderEntry")
export default class PurchaseOrderEntry extends Model {

    @Column()
    clientId: string;

    @Column()
    purchaseOrderId: string;

    @Column()
    productName: string;

    @Column()
    variantName: string;

    @Column()
    productVariantId: string;

    @Column()
    requestQuantity: number;

    @Column()
    receiveQuantity: number;

    @Column()
    returnQuantity: number;

    @Column()
    price: number;

    @Column()
    unitId: string;

    @Column()
    unitName: string;

    @ManyToOne(() => PurchaseOrder, purchaseOrder => purchaseOrder.purchaseOrderEntries)
    purchaseOrder: PurchaseOrder;

    @OneToOne(() => Unit)
    @JoinColumn()
    unit: Unit;

    @OneToOne(() => ProductVariant)
    @JoinColumn()
    productVariant: ProductVariant;

}
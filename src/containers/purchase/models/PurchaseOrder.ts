import {
    Column,
    Entity,
    OneToMany,
    ManyToOne,
    OneToOne,
    JoinColumn
} from "typeorm";
import Model from "../../../core/common/models/Model";
import PurchaseOrderEntry from "./PurchaseOrderEntry";
import Supplier from "../../item/entities/Supplier";
import Location from "../../../core/setting/models/Location";
import User from "../../../core/setting/models/User";

@Entity("PurchaseOrder")
export default class PurchaseOrder extends Model {

    @Column()
    clientId: string;

    @Column()
    supplierId: string;

    @Column()
    locationId: string;

    @Column()
    userId: string;

    @Column()
    receiverId: string;

    @Column()
    referenceId: string;

    @Column()
    deliveryDueDate: Date;

    @Column()
    invoiceNo: string;

    @Column()
    name: string;

    @Column()
    number: string;

    @Column()
    referenceNo: string;

    @Column()
    supplierName: string;

    @Column()
    shippingFee: number;

    @Column()
    requestTotal: number;

    @Column()
    returnTotal: number;

    @Column()
    receiveTotal: number;

    @Column()
    step: number;

    @Column()
    type: number;

    @Column()
    status: number;

    @Column()
    payTermNumber: number;

    @Column()
    payTermType: string;

    @Column()
    paymentDueDate: Date;

    @Column()
    description: string;

    @OneToOne(() => PurchaseOrder)
    @JoinColumn()
    reference: PurchaseOrder;

    @OneToMany(() => PurchaseOrderEntry, purchaseOrderEntry => purchaseOrderEntry.purchaseOrder)
    purchaseOrderEntries: PurchaseOrderEntry[];

    @ManyToOne(() => Supplier, supplier => supplier.id)
    supplier: Supplier;

    @ManyToOne(() => Location, location => location.id)
    location: Location;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn()
    receiver: User;

    isReceivePartial: number;

    isAutoReceive: boolean;

}
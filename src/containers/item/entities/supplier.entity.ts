import { Column, Entity, OneToMany } from "typeorm";
import Model from "../../../core/common/models/Model";
import PurchaseOrder from "../../purchase/models/PurchaseOrder";

@Entity("Supplier")
export default class Supplier extends Model {

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    clientId: string;

    @Column()
    phoneNumber: string;

    @Column()
    email: string;

    @OneToMany(() => PurchaseOrder, purchaseOrder => purchaseOrder.supplierId)
    purchaseOrders: PurchaseOrder[];
}
import {
    Column,
    Entity,
    PrimaryColumn
} from "typeorm";

@Entity("ProductPurchase")
export default class ProductPurchase {
    @PrimaryColumn()
    id: string;

    @Column()
    clientId: string;

    @Column()
    purchaseOrderId: string;

    @Column()
    supplierId: string;

    @Column()
    productVariantId: string;

    @Column()
    orderDate: Date;

    @Column()
    quantity: number;

    @Column()
    cost: number;

    @Column()
    expiredDate: Date;
    
}
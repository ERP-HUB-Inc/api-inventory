import { Length, Max } from "class-validator";
import { Column, Entity, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import User from "../../../core/setting/models/User";
import PurchaseOrder from "../../purchase/models/PurchaseOrder";
import Model from "../../../core/common/models/Model";
import Product from "./Product";
import ProductVariant from "./ProductVariant";


@Entity("ProductCost")
export default class ProductCost extends Model {

    // @Column()
    // @Length(0, 50)
    // productId: string = "";

    @Column()
    @Length(0, 50)
    productVariantId: string = "";

    @Column()
    @Length(0, 50)
    purchaseOrderId: string = "";

    @Column()
    @Length(0, 50)
    userId: string = "";

    @Column()
    clientId: string;

    @Column()
    date: Date;

    @Column()
    @Max(10)
    cost: number;

    @ManyToOne(type => ProductVariant, productVariant => productVariant.productCosts)
    productVariant: ProductVariant;

    @OneToOne(type => User)
    @JoinColumn()
    user: User;

    @OneToOne(type => PurchaseOrder)
    @JoinColumn()
    purchaseOrder: PurchaseOrder;
}
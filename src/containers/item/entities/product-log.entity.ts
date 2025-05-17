import {Length} from "class-validator";
import {Column, Entity, ManyToOne, OneToOne, JoinColumn} from "typeorm";
import Model from "../../../core/common/models/Model";
import User from "../../../core/setting/models/User";
import ProductVariant from "./ProductVariant";

@Entity("ProductLog")
export default class ProductLog extends Model {

    @Column()
    @Length(0, 50)
    userId: string = "";

    @Column()
    @Length(0, 50)
    clientId: string = "";

    @Column()
    @Length(0, 50)
    productVariantId: string = "";

    @Column()
    @Length(0, 100)
    name: string = "";

    @Column()
    @Length(0, 255)
    description: string = "";

    @ManyToOne(type => ProductVariant, productVariant => productVariant.ProductLogs)
    productVariant: ProductVariant;

    @OneToOne(type => User)
    @JoinColumn()
    user: User;
}
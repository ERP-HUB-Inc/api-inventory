import {
    Column,
    Entity,
    OneToOne,
    JoinColumn
} from "typeorm";
import Model from "../../../core/common/models/Model";
import Tax from "../../../sales/setting/models/Tax";

@Entity("ProductTax")
export default class ProductTax extends Model {

    @Column()
    taxId: string;

    @Column()
    productId: string;

    @Column()
    rate: number;

    @OneToOne(type => Tax)
    @JoinColumn({name: "taxId"})
    tax: Tax
}
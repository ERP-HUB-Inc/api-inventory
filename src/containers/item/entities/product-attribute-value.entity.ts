import { Length } from "class-validator";
import { Column, Entity, ManyToOne } from "typeorm";
import Model from "../../../core/common/models/Model";
import ProductAttribute from "./ProductAttribute";

@Entity("ProductAttributeValue")
export default class ProductAttributeValue extends Model {

    @Column()
    @Length(0, 40)
    productAttributeId: string = "";

    @Column()
    @Length(0, 100)
    name: string = "";

    @Column()
    @Length(0, 255)
    description: string = "";

    @Column()
    clientId: string;

    tempPAVId: number;

    @ManyToOne(type => ProductAttribute, productAttribute => productAttribute.attributeValues)
    productAttribute: ProductAttribute;

}
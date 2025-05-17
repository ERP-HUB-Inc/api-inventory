import {
    Column,
    Entity,
    OneToMany,
    ManyToOne,
    JoinColumn,
    OneToOne
} from "typeorm";
import Product from "./Product";
import ProductAttributeValue from "./ProductAttributeValue";
import Attribute from "./Attribute";
import Model from "../../../core/common/models/Model";

@Entity("ProductAttribute")
export default class ProductAttribute extends Model {

    @Column()
    clientId: string;
    
    @Column()
    productId: string;

    @Column()
    attributeId: string;

    @Column()
    sort: number;

    @OneToOne(() => Attribute)
    @JoinColumn()
    attribute: Attribute;

    @ManyToOne(() => Product, product => product.productAttributes)
    product: Product;

    @OneToMany(() => ProductAttributeValue, productAttributeValue => productAttributeValue.productAttribute)
    attributeValues: ProductAttributeValue[];
}
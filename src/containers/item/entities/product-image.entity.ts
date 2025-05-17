import { Length, Max } from "class-validator";
import { Column, Entity, ManyToOne } from "typeorm";
import Model from "../../../core/common/models/Model";
import Product from "./Product";

@Entity("ProductImage")
export default class ProductImage extends Model {

    @Column()
    @Length(0, 50)
    productId: string = "";

    @Column()
    @Length(0, 255)
    image: string = "";

    @Column()
    @Max(2)
    order: number;

    @ManyToOne(type => Product, product => product.productImages)
    product: Product
}
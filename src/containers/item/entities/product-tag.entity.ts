import { Length } from "class-validator";
import {
    Column,
    Entity,
    OneToOne,
    ManyToOne,
    JoinColumn
} from "typeorm";
import Product from "./Product";
import Tag from "./Tag";
import Model from "../../../core/common/models/Model";

@Entity("ProductTag")
export default class ProductTag extends Model {

    @OneToOne(type => Product)
    @JoinColumn()
    product: Product;

    @OneToOne(type => Tag)
    @JoinColumn()
    tag: Tag;

    @Column()
    @Length(0, 50)
    tagId: string = "";

    @Column()
    @Length(0, 50)
    productId: string = "";

    @ManyToOne(type => Tag, tag => tag.tagToProductTags)
    @JoinColumn({ name: "tagId" })
    productTagToTag: Tag;

    @ManyToOne(type => Product, product => product.productTagToProduct)
    @JoinColumn({ name: "productId" })
    productToProductTag: Product;
}
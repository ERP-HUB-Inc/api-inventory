import { Length } from "class-validator";
import { Column, Entity, ManyToMany, JoinTable, OneToMany, OneToOne, JoinColumn } from "typeorm";
import Model from "../../../core/common/models/Model";
import Product from "./Product";
import ProductTag from "./ProductTag";

@Entity("Tag")
export default class Tag extends Model {

    @ManyToMany(type => Product)
    @JoinTable({
        name: "ProductTag",
        joinColumns: [
            { name: 'tagId' }
        ],
        inverseJoinColumns: [
            { name: 'productId' }
        ]
    })
    products: Product[];

    @Column()
    @Length(0, 255)
    tag: string = "";

    //@OneToOne(type => ProductTag)
    //@JoinColumn()
    //productTag: ProductTag;

    @OneToMany(type => ProductTag, productTag => productTag.productTagToTag)
    @JoinColumn({ name: "id" })
    tagToProductTags: ProductTag[];


}
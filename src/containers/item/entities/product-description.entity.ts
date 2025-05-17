import { Column, Entity, ManyToOne } from "typeorm";
import Model from "../../../core/common/models/Model";
import Product from "./Product";

@Entity("ProductDescription")
export default class ProductDescription extends Model {

    @Column()
    productId: string;

    @Column()
    name: string = "";

    @Column()
    description: string = "";

    @Column()
    languageId: string;
}
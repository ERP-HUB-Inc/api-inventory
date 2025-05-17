import { Column, Entity } from "typeorm";
import Model from "../../../core/common/models/Model";

@Entity("ProductTypeDescription")
export default class ProductTypeDescription extends Model {

    @Column()
    productTypeId: string;

    @Column()
    languageId: string;

    @Column()
    name: string;

    @Column()
    description: string;
}
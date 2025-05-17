import { Length } from "class-validator";
import { Column, Entity } from "typeorm";
import Model from "../../../core/common/models/Model";

@Entity("Attribute")
export default class Attribute extends Model {

    @Column()
    clientId: string;

    @Column()
    name: string;

    @Column()
    description: string;
}
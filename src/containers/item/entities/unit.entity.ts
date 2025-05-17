import {
    Column,
    Entity
} from "typeorm";
import Model from "../../../core/common/models/Model";

@Entity("Unit")
export default class Unit extends Model {

    @Column()
    name: string;

    @Column()
    multiple: number;

    @Column()
    label: string;

    @Column()
    isSystem: number = 0;

    @Column()
    isDefault: number;

    @Column()
    clientId: string;
}
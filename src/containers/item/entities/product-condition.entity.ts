import {
    Column,
    Entity,
    PrimaryColumn
} from "typeorm";

@Entity("ProductCondition")
export default class ProductCondition {
    @PrimaryColumn()
    id: string;

    @Column()
    clientId: string;

    @Column()
    name: string;
}
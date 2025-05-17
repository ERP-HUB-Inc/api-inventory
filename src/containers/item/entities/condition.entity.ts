import {
    Column,
    Entity,
    PrimaryColumn
} from "typeorm";

@Entity("ProductCondition")
export default class Condition {
    @PrimaryColumn()
    id: string;
    
    @Column()
    clientId: string;

    @Column()
    name: string;

    @Column()
    status: number;
}
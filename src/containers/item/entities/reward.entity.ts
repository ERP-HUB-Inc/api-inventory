import {
    Column,
    Entity,
    ManyToOne,
    PrimaryColumn
} from "typeorm";
import LoyaltyProgram from "./LoyaltyProgram";

@Entity("Reward")
export default class Reward {
    @PrimaryColumn()
    id: string;

    @Column()
    clientId: string;

    @Column()
    loyaltyProgramId: string;

    @Column()
    name: string;

    @Column()
    type: string;//Gift, Discount by Percentage, Discount by Value

    @Column()
    cost: number;

    @ManyToOne(() => LoyaltyProgram, loyaltyProgram => loyaltyProgram.rewards)
    loyaltyProgram: LoyaltyProgram;
}
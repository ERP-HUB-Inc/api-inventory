import {
    Column,
    Entity,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
    CreateDateColumn
} from "typeorm";
import Reward from "./Reward";

@Entity("LoyaltyProgram")
export default class LoyaltyProgram {
    @PrimaryColumn()
    id: string;

    @Column()
    clientId: string;

    @Column()
    locationId: string;

    @Column()
    name: string;

    @Column()
    pointPerAmount: number;

    @Column()
    pointPerOrder: number;

    @Column()
    pointPerProduct: number;

    @Column()
    pointIncreament: number;

    @OneToMany(() => Reward, reward => reward.loyaltyProgram)
    rewards: Reward[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
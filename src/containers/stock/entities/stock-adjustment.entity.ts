import {
    Column,
    Entity,
    OneToMany,
    OneToOne,
    JoinColumn
} from "typeorm";
import { StockAdjustmentEntry } from ".";
import Model from "../../../core/common/models/Model";
import Location from "../../../core/setting/models/Location";
import User from "../../../core/setting/models/User";

@Entity("StockAdjustment")
export class StockAdjustment extends Model {

    @Column()
    clientId: string;

    @Column()
    locationId: string;

    @Column()
    userId: string;

    @Column()
    approverId: string;

    @Column()
    subject: string;

    @Column()
    description: string;

    @Column()
    type: string;

    @Column()
    step: number;

    @OneToOne(() => Location)
    @JoinColumn()
    location: Location;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @OneToOne(() => User)
    @JoinColumn()
    approver: User;

    @OneToMany(() => StockAdjustmentEntry, stockAdjustmentEntry => stockAdjustmentEntry.stockAdjustment)
    details: StockAdjustmentEntry[];
}
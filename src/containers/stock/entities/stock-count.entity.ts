import {
    Column,
    Entity,
    OneToMany,
    PrimaryColumn,
    OneToOne,
    JoinColumn
} from "typeorm";
import { StockCountEntry } from ".";
import Location from "../../../core/setting/models/Location";

@Entity("StockCount")
export class StockCount {

    @PrimaryColumn()
    id: string;

    @Column()
    clientId: string;

    @Column()
    locationId: string;

    @Column()
    name: string;

    @Column()
    startDate: string;

    @Column()
    startTime: string;

    @Column()
    endDate: string;

    @Column()
    endTime: string;

    @Column()
    type: string;//PARTIAL, FULL

    @Column()
    status: string;//IN_PROGRESS, PAUSE, COMPLETED

    @OneToMany(() => StockCountEntry, stockCountEntry => stockCountEntry.stockCount)
    stockCountEntries: StockCountEntry[];

    @OneToOne(() => Location)
    @JoinColumn()
    location: Location;

    uncounted: number;

    counted: number;

    unmatched: number;

    matched: number;

    all: number;
}
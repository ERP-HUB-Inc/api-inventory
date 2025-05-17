import {
    Column,
    Entity,
    OneToMany,
    PrimaryColumn,
    CreateDateColumn,
    UpdateDateColumn, OneToOne, JoinColumn
} from "typeorm";
import { ConsignmentEntry } from ".";
import Location from "../../../core/setting/models/Location";
import Supplier from "../../item/entities/Supplier";

@Entity("Consignment")
export class Consignment {

    @PrimaryColumn()
    id: string;

    @Column()
    clientId: string;

    @Column()
    locationId: string;

    @Column()
    supplierId: string;

    @Column()
    description: string;

    @Column()
    date: string;

    @Column()
    status: string;//Draft,Received,Returned

    @OneToMany(() => ConsignmentEntry, consignmentEntry => consignmentEntry.consignment)
    consignmentEntries: ConsignmentEntry[];

    @OneToOne(() => Location)
    @JoinColumn()
    location: Location

    @OneToOne(() => Supplier)
    supplier: Supplier

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
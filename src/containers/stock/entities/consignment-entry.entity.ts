import {
    Column,
    Entity, JoinColumn, ManyToOne, OneToOne,
    PrimaryColumn
} from "typeorm";
import { Consignment } from ".";
import ProductVariant from "../../item/entities/ProductVariant";

@Entity("ConsignmentEntry")
export class ConsignmentEntry {

    @PrimaryColumn()
    id: string;

    @Column()
    clientId: string;

    @Column()
    consignmentId: number;

    @Column()
    productVariantId: string;

    @Column()
    productName: string;

    @Column()
    barcode: string;

    @Column()
    quantity: number;

    @Column({type: "float", default: 0})
    cost: number;

    @ManyToOne(() => Consignment, consignment => consignment.consignmentEntries)
    consignment: Consignment;

    @OneToOne(()=> ProductVariant)
    @JoinColumn()
    productVariant: ProductVariant
}
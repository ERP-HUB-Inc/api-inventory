import {
    Entity,
    Column,
    OneToMany
} from "typeorm";
import { BaseEntity } from "@common/entities/base.entity";
import { ProductLocation } from "./product-location.entity";

@Entity("Location")
export class Location extends BaseEntity {
    
    static formatCode: string = "0000";
    
    @Column()
    name: string;

    @Column()
    code: string;

    @Column()
    address: string;

    @Column()
    isSystem: number;

    @Column()
    isDefault: number;

    @Column()
    receiptTemplateId: string;

    @Column()
    clientId: string;

    @Column()
    sort: number;

    @OneToMany(() => ProductLocation, productLocation => productLocation.location)
    productLocations: ProductLocation[];
}
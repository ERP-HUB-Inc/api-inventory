import {
    Column,
    Entity,
    OneToOne,
    JoinColumn
} from "typeorm";
import Model from "../../../core/common/models/Model";
import User from "../../../core/setting/models/User";
import Location from "../../../core/setting/models/Location";
import Product from "../../item/entities/Product";
import ProductVariant from "../../item/entities/ProductVariant";

@Entity("MovementLog")
export class MovementLog extends Model {

    @Column()
    clientId: string;

    @Column()
    userId: string;

    @Column()
    productId: string;

    @Column()
    productVariantId: string;

    @Column()
    productVariant: string;

    @Column()
    entityId: string;

    @Column()
    description: string;

    @Column()
    locationId: string;

    @Column()
    quantity: number;

    @Column()
    oldQuantity: number;

    @Column()
    cost: number;

    @Column()
    oldCost: number;

    @Column()
    type: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @OneToOne(() => Product)
    @JoinColumn()
    product: Product;

    @OneToOne(() => Product)
    @JoinColumn({name: "productVariantId"})
    variant: ProductVariant;

    @OneToOne(() => Location)
    @JoinColumn()
    location: Location;
}
import {
    Column,
    Entity,
    ManyToOne,
} from "typeorm";
import ProductVariant from "./ProductVariant";
import Model from "../../../core/common/models/Model";
import Location from "../../../core/setting/models/Location";

@Entity("ProductLocation")
export default class ProductLocation extends Model {

    @Column()
    locationId: string;

    @Column()
    clientId: string;

    @Column()
    productVariantId: string;

    @Column()
    quantity: number;

    @ManyToOne(() => Location, location => location.productLocations)
    location: Location;

    @ManyToOne(() => ProductVariant, productVariant => productVariant.productLocations)
    productVariant: ProductVariant;
}
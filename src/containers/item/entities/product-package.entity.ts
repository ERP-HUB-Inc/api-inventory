import {
    Column,
    Entity,
    ManyToOne,
    OneToOne,
    JoinColumn
} from "typeorm";
import ProductVariant from "./ProductVariant";
import Model from "../../../core/common/models/Model";

@Entity("ProductPackage")
export default class ProductPackage extends Model {
    @Column()
    clientId: string;

    @Column()
    productId: string;

    @Column()
    rawProductId: string;

    @Column()
    quantity: number;

    @OneToOne(() => ProductVariant)
    @JoinColumn()
    rawProduct: ProductVariant;

    @ManyToOne(() => ProductVariant, productVariant => productVariant.productPackages)
    product: ProductVariant;
}
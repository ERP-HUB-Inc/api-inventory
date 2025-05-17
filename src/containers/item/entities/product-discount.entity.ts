import {
    Column,
    Entity,
    OneToOne,
    JoinColumn,
    ManyToOne
} from "typeorm";
import ProductVariant from "./ProductVariant";
import Model from "../../../core/common/models/Model";
import Promotion from "./Promotion";

@Entity("ProductDiscount")
export default class ProductDiscount extends Model {
    
    @Column()
    clientId: string;

    @Column()
    promotionId: string;

    @Column()
    productId: string;

    @Column()
    productVariantId: string;

    @Column()
    variantName: string;

    @Column()
    quantity: number;

    @Column()
    price: number;

    @Column()
    dateStart: Date;

    @Column()
    dateEnd: Date;

    @OneToOne(() => ProductVariant)
    @JoinColumn()
    productVariant: ProductVariant;

    @ManyToOne(() => Promotion, promotion => promotion.productDiscount)
    promotion: Promotion;
}
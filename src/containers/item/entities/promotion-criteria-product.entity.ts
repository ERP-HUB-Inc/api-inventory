import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    ManyToOne,
    PrimaryColumn
} from "typeorm";
import ProductVariant from "./ProductVariant";
import PromotionCriteria from "./PromotionCriteria";

@Entity("PromotionCriteriaProduct")
export default class PromotionCriteriaProduct {
    @PrimaryColumn()
    id: string;

    @Column()
    clientId: string;

    @Column()
    promotionId: string;

    @Column()
    promotionCriteriaId: string;

    @Column()
    productId: string;

    @Column()
    productVariantId: string;

    @Column()
    productName: string;

    @Column()
    barcode: string;

    @Column()
    type: string;

    @OneToOne(() => ProductVariant, productVariant => productVariant.promotionCriteriaProduct)
    @JoinColumn()
    productVariant: ProductVariant;

    @ManyToOne(() => PromotionCriteria, promotionCriteria => promotionCriteria.buyQuantity)
    @JoinColumn({name: "promotionCriteriaId"})
    buyCriteria: PromotionCriteria;

    @ManyToOne(() => PromotionCriteria, promotionCriteria => promotionCriteria.thenGetProducts)
    @JoinColumn({name: "promotionCriteriaId"})
    thenCriteria: PromotionCriteria;
}
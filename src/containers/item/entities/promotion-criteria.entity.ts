import {
    Column,
    Entity,
    PrimaryColumn,
    ManyToOne,
    OneToMany
} from "typeorm";
import Promotion from "./Promotion";
import PromotionCriteriaProduct from "./PromotionCriteriaProduct";

@Entity("PromotionCriteria")
export default class PromotionCriteria {
    static BUY_FOLLOWING_ITEMS = "BUY_ITEMS";
    static SPEND_WITH_AMOUNT = "SPEND_AMOUNT";
    static GET_ITEMS = "GET_ITEMS";
    static SAVE_AMOUNT = "SAVE_AMOUNT";
    static WHEN_TARGET = {ALL: "all", SPECIFIC: "specific"};
    static THEN_TARGET = {ALL: "all", SPECIFIC: "specific"};

    @PrimaryColumn()
    id: string;

    @Column()
    clientId: string;

    @Column()
    promotionId: string;

    @Column()
    when: string;

    @Column()
    whenTarget: string;

    @Column()
    buyQuantity: number;

    @Column()
    spendAmount: number;

    @Column()
    then: string;

    @Column()
    getQuantity: number;

    @Column()
    getPercentage: number;

    @Column()
    getAmount: number;

    @Column()
    thenTarget: string;

    @ManyToOne(() => Promotion, promotion => promotion.promotionCriterias)
    promotion: Promotion;

    @OneToMany(() => PromotionCriteriaProduct, promotionCriteriaProducts => promotionCriteriaProducts.buyCriteria)
    whenBuyProducts: PromotionCriteriaProduct[];

    @OneToMany(() => PromotionCriteriaProduct, promotionCriteriaProducts => promotionCriteriaProducts.thenCriteria)
    thenGetProducts: PromotionCriteriaProduct[];

}
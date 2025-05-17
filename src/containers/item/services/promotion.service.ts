import { Service } from "typedi";
import {
    getConnection,
    getCustomRepository,
    getManager
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { NotFoundError } from "routing-controllers";
import Promotion from "../entities/Promotion";
import ProductDiscount from "../entities/ProductDiscount";
import PromotionCriteria from "../entities/PromotionCriteria";
import PromotionCriteriaProduct from "../entities/PromotionCriteriaProduct";
import PromotionRepository from "../repositories/PromotionRepository";
import BaseRepository from "../../../core/common/repositories/BaseRepository";
import BaseService from "../../../core/common/services/BaseService";
import User from "../../../core/setting/models/User";
import Filter from "../../../core/common/filters";
import { RecordStatus } from "../../../core/setting/enums";

@Service()
export default class PromotionService extends BaseService<Promotion> {
    protected repository: BaseRepository<Promotion>; 

    constructor() {
        super();
        this.repository = getCustomRepository(PromotionRepository);
    }

    async getPromotionById(user: User, id: string) {
        const promotion: Promotion = await getConnection().createQueryBuilder(Promotion, "P")
        .where("P.id = :id AND P.clientId = :clientId", {id, clientId: user.clientId})
        .getOne();

        if (promotion == null) throw new NotFoundError("Promotion not found");

        if (promotion.type == Promotion.BASIC) {
            const productDiscounts: ProductDiscount[] = await getConnection().createQueryBuilder(ProductDiscount, "PD")
            .leftJoin("PD.productVariant", "PV")
            .select([
                "PD.id",
                "PD.productId",
                "PD.productVariantId",
                "PD.variantName",
                "PD.price",
                "PD.status",
                "PV.price",
                "PV.barcode"
            ])
            .where("PD.promotionId = :promotionId AND PD.clientId = :clientId", {promotionId: promotion.id, clientId: user.clientId})
            .getMany();

            promotion.productDiscount = productDiscounts;
        } else {
            const promotionCriteria: PromotionCriteria = await getConnection().createQueryBuilder(PromotionCriteria, "PC")
            .leftJoin("PC.whenBuyProducts", "WBP", "WBP.type = 'WHEN'")
            .leftJoin("PC.thenGetProducts", "TGP", "TGP.type = 'THEN'")
            .select([
                "PC.id",
                "PC.when",
                "PC.whenTarget",
                "PC.buyQuantity",
                "PC.spendAmount",
                "PC.then",
                "PC.getQuantity",
                "PC.getPercentage",
                "PC.getAmount",
                "PC.thenTarget",
                "WBP.id",
                "WBP.productId",
                "WBP.productVariantId",
                "WBP.productName",
                "WBP.barcode",
                "WBP.type",
                "TGP.id",
                "TGP.productId",
                "TGP.productVariantId",
                "TGP.productName",
                "TGP.barcode",
                "TGP.type"
            ])
            .where("PC.clientId = :clientId AND PC.promotionId = :promotionId", {clientId: user.clientId, promotionId: promotion.id})
            .getOne();

            promotion.promotionCriteria = promotionCriteria;
        }

        return promotion;
    }

    async getPromotions(filter: Filter) {
        if (!filter.offset) {
            filter.offset = 0;
        }

        if (!filter.limit) {
            filter.limit = this.repository.limit;
        }
        const result = await getConnection().createQueryBuilder(Promotion, "P")
            .leftJoin("P.location", "L")
            .select([
                "P.id",
                "P.name",
                "P.locationId",
                "P.discount",
                "P.discountType",
                "P.startDate",
                "P.endDate",
                "P.targetProduct",
                "P.type",
                "L.name"
            ])
            .where("P.clientId = :clientId", {clientId: filter.clientId})
            .offset(filter.offset)
            .limit(filter.limit)
            .orderBy("P.startDate", "DESC")
            .getManyAndCount();

        return this.responses(result[0], result[1], filter.limit, filter.offset);
    }

    async createNewPromotion(data: Promotion) {
        await getManager().transaction(async manager => {
            const promotion: Promotion = new Promotion();
            promotion.id = await this.repository.generateUUId();
            promotion.clientId = data.clientId;
            promotion.name = data.name;
            promotion.startDate = data.startDate;
            promotion.endDate = data.endDate;
            promotion.locationId = data.locationId;
            promotion.type = data.type;
            promotion.targetProduct = data.targetProduct;
            promotion.discount = data.discount;
            promotion.discountType = data.discountType;
            promotion.isFeatured = data.isFeatured;
            await manager.insert(Promotion, promotion);

            if (data.type == Promotion.BASIC) {
                const productsDiscount = [];
                if (data.productDiscount && data.productDiscount.length) {
                    const len = data.productDiscount.length;
                    for (let i = 0; i < len; i++) {
                        productsDiscount.push({
                            id: await this.repository.generateUUId(),
                            clientId: data.clientId,
                            promotionId: promotion.id,
                            productId: data.productDiscount[i].productId,
                            productVariantId: data.productDiscount[i].productVariantId,
                            variantName: data.productDiscount[i].variantName,
                            quantity: 1,
                            price: data.productDiscount[i].price,
                            dateStart: data.startDate,
                            dateEnd: data.endDate,
                        });
                    }

                    if (productsDiscount.length) {
                        await manager.insert(ProductDiscount, productsDiscount);
                    }
                }
            } else if (data.type == Promotion.ADVANCE) {
                let promotionCriteria: PromotionCriteria = data.promotionCriteria;
                const whenBuyProducts: PromotionCriteriaProduct[] = [...promotionCriteria.whenBuyProducts];
                const thenGetProducts: PromotionCriteriaProduct[] = [...promotionCriteria.thenGetProducts];
                delete promotionCriteria.whenBuyProducts;
                delete promotionCriteria.thenGetProducts;

                promotionCriteria.id = await this.repository.generateUUId();
                promotionCriteria.clientId = data.clientId;
                promotionCriteria.promotionId = promotion.id;
                promotionCriteria = await manager.save(PromotionCriteria, promotionCriteria);

                if (promotionCriteria.whenTarget == PromotionCriteria.WHEN_TARGET.SPECIFIC) {
                    const productCriterias: PromotionCriteriaProduct[] = [];
                    whenBuyProducts.forEach(whenBuyProduct => {
                        whenBuyProduct.id = uuidv4();
                        whenBuyProduct.clientId = data.clientId;
                        whenBuyProduct.promotionId = promotion.id;
                        whenBuyProduct.promotionCriteriaId = promotionCriteria.id;
                        whenBuyProduct.type = "WHEN";
                        productCriterias.push(whenBuyProduct);
                    });

                    if (productCriterias.length) await manager.insert(PromotionCriteriaProduct, productCriterias);
                }

                if (promotionCriteria.thenTarget == PromotionCriteria.THEN_TARGET.SPECIFIC) {
                    const productCriterias: PromotionCriteriaProduct[] = [];
                    thenGetProducts.forEach(thenGetProduct => {
                        thenGetProduct.id = uuidv4();
                        thenGetProduct.clientId = data.clientId;
                        thenGetProduct.promotionId = promotion.id;
                        thenGetProduct.promotionCriteriaId = promotionCriteria.id;
                        thenGetProduct.type = "THEN";
                        productCriterias.push(thenGetProduct);
                    });

                    if (productCriterias.length) await manager.insert(PromotionCriteriaProduct, productCriterias);
                }
            }
        });

        return this.response({success: true});
    }

    async updatePromotion(id: string, data: Promotion) {
        await getManager().transaction(async manager => {
            const productsDiscount = data.productDiscount;
            const clientId: string = data.clientId;
            delete data.productDiscount;

            let updateData = {
                name: data.name,
                startDate: data.startDate,
                endDate: data.endDate,
                locationId: data.locationId,
                type: data.type,
                targetProduct: data.targetProduct,
                discount: data.discount,
                discountType: data.discountType,
                isFeatured: data.isFeatured
            }
            await manager.update(Promotion, {id, clientId: data.clientId}, updateData);

            if (data.type == Promotion.BASIC) {
                if (productsDiscount && productsDiscount.length) {
                    const promises = productsDiscount.map(async entry => {
                        if (entry.id) {
                            let updateEntry = {
                                productId: entry.productId,
                                variantName: entry.variantName,
                                price: entry.price,
                                dateStart: data.startDate,
                                dateEnd: data.endDate,
                                status: entry.status
                            }
                            await manager.update(ProductDiscount, {id: entry.id, clientId: data.clientId}, updateEntry);                    
                        } else {
                            const productDiscount: ProductDiscount = new ProductDiscount();
                            productDiscount.id = uuidv4();
                            productDiscount.clientId = data.clientId;
                            productDiscount.promotionId = id;
                            productDiscount.productId = entry.productId;
                            productDiscount.productVariantId = entry.productVariantId;
                            productDiscount.variantName = entry.variantName;
                            productDiscount.quantity = 1;
                            productDiscount.price = entry.price;
                            productDiscount.dateStart = data.startDate;
                            productDiscount.dateEnd = data.endDate;
                            await manager.insert(ProductDiscount, productDiscount);
                        }
                    });
    
                    await Promise.all(promises);
                }
            } else {
                let promotionCriteria: PromotionCriteria = data.promotionCriteria;
                const whenBuyProducts: PromotionCriteriaProduct[] = [...promotionCriteria.whenBuyProducts];
                const thenGetProducts: PromotionCriteriaProduct[] = [...promotionCriteria.thenGetProducts];
                delete promotionCriteria.whenBuyProducts;
                delete promotionCriteria.thenGetProducts;
                
                await manager.update(PromotionCriteria, {clientId, id: promotionCriteria.id}, promotionCriteria);

                if (promotionCriteria.whenTarget == PromotionCriteria.WHEN_TARGET.SPECIFIC) {
                    const productCriterias: PromotionCriteriaProduct[] = [];
                    const promisesBuy = whenBuyProducts.map(async (whenBuyProduct) => {
                        if (whenBuyProduct.id) {
                            if (whenBuyProduct["status"] == RecordStatus.Archive) {
                                await manager.delete(PromotionCriteriaProduct, {clientId, id: whenBuyProduct.id});
                            } else {
                                await manager.update(PromotionCriteriaProduct, {clientId, id: whenBuyProduct.id}, whenBuyProduct);
                            }
                        } else {
                            whenBuyProduct.id = uuidv4();
                            whenBuyProduct.clientId = data.clientId;
                            whenBuyProduct.promotionId = id;
                            whenBuyProduct.promotionCriteriaId = promotionCriteria.id;
                            whenBuyProduct.type = "WHEN";
                            productCriterias.push(whenBuyProduct);
                        }
                    });

                    await Promise.all(promisesBuy);

                    if (productCriterias.length) await manager.insert(PromotionCriteriaProduct, productCriterias);
                }
                
                if (promotionCriteria.thenTarget == PromotionCriteria.THEN_TARGET.SPECIFIC) {
                    const productCriterias: PromotionCriteriaProduct[] = [];
                    const promisesGet = thenGetProducts.map(async (thenGetProduct) => {
                        if (thenGetProduct.id) {
                            if (thenGetProduct["status"] == RecordStatus.Archive) {
                                await manager.delete(PromotionCriteriaProduct, {clientId, id: thenGetProduct.id});
                            } else {
                                await manager.update(PromotionCriteriaProduct, {clientId, id: thenGetProduct.id}, thenGetProduct);
                            }
                        } else {
                            thenGetProduct.id = uuidv4();
                            thenGetProduct.clientId = data.clientId;
                            thenGetProduct.promotionId = id;
                            thenGetProduct.promotionCriteriaId = promotionCriteria.id;
                            thenGetProduct.type = "THEN";
                            productCriterias.push(thenGetProduct);
                        }
                    });

                    await Promise.all(promisesGet);
                    
                    if (productCriterias.length) await manager.insert(PromotionCriteriaProduct, productCriterias);
                }
            }
        });

        return this.response({success: true});
    }

    async deletePromotion(data: string, clientId: string) {
        await getManager().transaction(async manager => {
            const ids = data.split(",");
            await manager.createQueryBuilder(Promotion, "P").where(`id IN(:ids) AND clientId = "${clientId}"`, {ids}).delete().execute();
            await manager.createQueryBuilder(ProductDiscount, "PD").where(`promotionId IN(:ids) AND clientId = "${clientId}"`, {ids}).delete().execute();
            await manager.createQueryBuilder(PromotionCriteria, "PC").where(`promotionId IN(:ids) AND clientId = "${clientId}"`, {ids}).delete().execute();
            await manager.createQueryBuilder(PromotionCriteriaProduct, "PCP").where(`promotionId IN(:ids) AND clientId = "${clientId}"`, {ids}).delete().execute();
        });

        return {
            message: "Delete success!",
            status: 204
        }
    }
}

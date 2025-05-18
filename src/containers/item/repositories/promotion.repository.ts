import BaseRepository from '../../../core/common/repositories/BaseRepository';
import PromotionCriteriaProduct from '../entities/PromotionCriteriaProduct';
import { EntityRepository, getConnection } from 'typeorm';
import PromotionCriteria from '../entities/PromotionCriteria';
import ProductDiscount from '../entities/ProductDiscount';
import ProductVariant from '../entities/ProductVariant';
import Promotion from '../entities/Promotion';
import * as moment from 'moment';

@EntityRepository(Promotion)
export default class PromotionRepository extends BaseRepository {
  entityName = 'Promotion';

  selectField: string[] = [
    'id',
    'clientId',
    'locationId',
    'name',
    'startDate',
    'endDate',
    'type',
    'discount',
    'discountType',
    'targetProduct',
    'status',
    'createdAt',
    'updatedAt',
  ];

  async getPromotion(
    clientId: string,
    productVariantId: string,
    orderQuantity: number,
    orderAmount: number,
  ) {
    let productDiscount: ProductDiscount = null;
    const currentDate: string = moment().format('YYYY-MM-DD');

    const promotions: Promotion[] = await getConnection()
      .createQueryBuilder(Promotion, 'P')
      .select(['id', 'discount', 'discountType', 'type', 'targetProduct'])
      .where(
        "DATE_FORMAT(P.startDate, '%Y-%m-%d') <= :currentDate AND DATE_FORMAT(P.endDate, '%Y-%m-%d') >= :currentDate",
        { currentDate },
      )
      .getRawMany();

    if (promotions.length > 0) {
      for (let i = 0; i < promotions.length; i++) {
        const promotion: Promotion = promotions[i];
        if (promotion.type == Promotion.BASIC) {
          if (promotion.targetProduct == 'specific') {
            const resultDiscount: ProductDiscount = await getConnection()
              .createQueryBuilder(ProductDiscount, 'PD')
              .select(['id', 'productVariantId', 'quantity', 'price'])
              .where(
                'PD.promotionId = :promotionId AND PD.productVariantId = :productVariantId AND PD.status = 1',
                { promotionId: promotion.id, productVariantId },
              )
              .getRawOne();

            if (resultDiscount) {
              productDiscount = resultDiscount;
              break;
            }
          } else if (promotion.targetProduct == 'all') {
            const productVariant: ProductVariant = await getConnection()
              .createQueryBuilder(ProductVariant, 'PV')
              .select('price')
              .where('PV.id = :id', { clientId, id: productVariantId })
              .getRawOne();

            const oldPrice: number = productVariant.price;
            const savedPrice: number =
              promotion.discountType == Promotion.DISCOUNT_TYPE.AMOUNT
                ? promotion.discount
                : oldPrice * promotion.discount * 0.01;
            const discount: number = oldPrice - savedPrice;

            productDiscount = new ProductDiscount();
            productDiscount.productVariantId = productVariantId;
            productDiscount.quantity = 1;
            productDiscount.price = discount;
          }
        } else if (promotion.type == Promotion.ADVANCE) {
          const promotionCriteria: PromotionCriteria = await getConnection()
            .createQueryBuilder(PromotionCriteria, 'PC')
            .select([
              'id',
              '`when`',
              'whenTarget',
              'buyQuantity',
              'spendAmount',
              '`then`',
              'thenTarget',
              'getQuantity',
              'getPercentage',
              'getAmount',
            ])
            .where('PC.promotionId = :promotionId', {
              clientId,
              promotionId: promotion.id,
            })
            .getRawOne();

          const isMatchWithBuyItem: boolean =
            promotionCriteria.when == PromotionCriteria.BUY_FOLLOWING_ITEMS;
          const isMatchWithSpendAmount: boolean =
            promotionCriteria.when == PromotionCriteria.SPEND_WITH_AMOUNT;

          let isMatchProductCriteria: boolean = false;
          if (
            promotionCriteria.whenTarget ==
            PromotionCriteria.WHEN_TARGET.SPECIFIC
          ) {
            const foundProduct: PromotionCriteriaProduct = await getConnection()
              .createQueryBuilder(PromotionCriteriaProduct, 'PCP')
              .select('id')
              .where(
                'PCP.promotionCriteriaId = :promotionCriteriaId AND PCP.productVariantId = :productVariantId AND PCP.type = :type',
                {
                  promotionCriteriaId: promotionCriteria.id,
                  productVariantId,
                  type: 'WHEN',
                },
              )
              .getRawOne();

            if (foundProduct) isMatchProductCriteria = true;
          } else {
            isMatchProductCriteria = true;
          }

          if (isMatchProductCriteria) {
            let isMatchOrderCriteria: boolean = false;
            const isMatchOrderQuantity: boolean =
              isMatchWithBuyItem &&
              orderQuantity >= promotionCriteria.buyQuantity;
            const isMatchOrderAmount: boolean =
              isMatchWithSpendAmount &&
              orderAmount >= promotionCriteria.spendAmount;

            if (isMatchOrderQuantity) {
              isMatchOrderCriteria = true;
            } else if (isMatchOrderAmount) {
              isMatchOrderCriteria = true;
            }

            if (isMatchOrderCriteria) {
              if (promotionCriteria.then == PromotionCriteria.GET_ITEMS) {
                const freeProducts: ProductVariant[] = await getConnection()
                  .createQueryBuilder(ProductVariant, 'PV')
                  .innerJoin('PV.promotionCriteriaProduct', 'PCP')
                  .select([
                    'PV.id AS id',
                    'PCP.barcode AS barcode',
                    'PV.productId AS productId',
                    'productVariantId',
                    'productName',
                    'quantity',
                    'price',
                  ])
                  .where(
                    'PCP.promotionCriteriaId = :promotionCriteriaId AND PCP.type = :type',
                    { promotionCriteriaId: promotionCriteria.id, type: 'THEN' },
                  )
                  .getRawMany();

                let freeQuantity: number;

                if (isMatchOrderQuantity) {
                  freeQuantity =
                    Math.trunc(orderQuantity / promotionCriteria.buyQuantity) *
                    promotionCriteria.getQuantity;
                } else if (isMatchOrderAmount) {
                  freeQuantity =
                    Math.trunc(orderAmount / promotionCriteria.spendAmount) *
                    promotionCriteria.getQuantity;
                }

                productDiscount = new ProductDiscount();
                productDiscount['type'] = 'advance';
                productDiscount['then'] = promotionCriteria.then;
                productDiscount['freeProducts'] = freeProducts.map(
                  (freeProduct) => ({
                    ...freeProduct,
                    quantity: freeQuantity,
                    newPrice: 0,
                  }),
                );
              } else if (
                promotionCriteria.then == PromotionCriteria.SAVE_AMOUNT
              ) {
                let multiplier: number;

                if (isMatchOrderQuantity) {
                  multiplier = Math.trunc(
                    orderQuantity / promotionCriteria.buyQuantity,
                  );
                } else if (isMatchOrderAmount) {
                  multiplier = Math.trunc(
                    orderAmount / promotionCriteria.spendAmount,
                  );
                }

                let savedAmount: number =
                  promotionCriteria.getAmount * multiplier;

                if (promotionCriteria.getPercentage)
                  savedAmount =
                    orderAmount * promotionCriteria.getPercentage * 0.01;

                productDiscount = new ProductDiscount();
                productDiscount['type'] = 'advance';
                productDiscount['then'] = promotionCriteria.then;
                productDiscount['savedAmount'] = savedAmount;
              }
            }
          }
        }
      }
    }

    return productDiscount;
  }
}

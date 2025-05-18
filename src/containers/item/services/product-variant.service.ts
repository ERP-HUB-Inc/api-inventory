import ProductAttributeValueRepository from '../repositories/ProductAttributeValueRepository';
import ProductVariantRepository from '../repositories/ProductVariantRepository';
import { getCustomRepository, MoreThan, Like } from 'typeorm';
import { BadRequestError, NotFoundError } from 'routing-controllers';
import BaseService from '../../../core/common/services/BaseService';
import { TransactionStep } from '../../../sales/transaction/enums';
import { RecordStatus } from '../../../core/setting/enums';
import { PurchaseStepEnums } from '../../purchase/enums';
import ProductVariant from '../entities/ProductVariant';
import { HttpCode } from '../../../../enums/HttpCode';
import Filter from '../../../core/common/filters';
import { ProductSerialTypeEnums } from '../enums';
import Product from '../entities/Product';
import { Service } from 'typedi';
import * as moment from 'moment';
import * as _ from 'lodash';

@Service()
export default class ProductVariantService extends BaseService {
  protected repository: ProductVariantRepository;
  private productAttributeValueRepository: ProductAttributeValueRepository;

  constructor() {
    super();
    this.repository = getCustomRepository(ProductVariantRepository);
    this.productAttributeValueRepository = getCustomRepository(
      ProductAttributeValueRepository,
    );
  }

  async getDetailWithLocation(
    clientId: string,
    id: string,
    locationId: string,
  ) {
    const query = await this.repository.connection
      .createQueryBuilder(ProductVariant, 'PV')
      .leftJoin('PV.productLocations', 'PL')
      .select([
        'PV.id id',
        'PV.name name',
        'PL.id productLocationId',
        'PL.quantity quantity',
      ])
      .where(
        'PV.clientId = :clientId AND PV.id = :id AND PL.locationId = :locationId',
        { clientId, id, locationId },
      )
      .getRawOne();

    if (!query) {
      throw new NotFoundError('Product not found');
    }

    return this.repository.response(query);
  }

  async archive(id: string) {
    this.repository.clientId = this.clientId;
    const result = await this.repository.findOneByFieldName({ id }, [
      'quantity',
    ]);

    if (result == null) {
      throw new NotFoundError('Product variant not found');
    }

    if (result.quantity > 0) {
      throw new BadRequestError('Product variant quantity is not zero.');
    }

    return await super.archive(id);
  }

  async changeStatus(id: string) {
    this.repository.clientId = this.clientId;

    const result = await this.repository.findOneByFieldName({ id }, [
      'quantity',
    ]);

    if (result == null) {
      throw new NotFoundError('Product variant not found');
    }

    if (result.quantity > 0) {
      throw new BadRequestError('Product variant quantity is not zero.');
    }

    return await super.changeStatus(id);
  }

  async checkDeleteAvailability(id: string): Promise {
    const result = await this.repository.findOneByFieldName({ id }, [
      'quantity',
    ]);

    if (result == null) {
      throw new NotFoundError('Product variant not found');
    }

    if (result.quantity > 0) {
      throw new BadRequestError(HttpCode.PRODUCT_QUANTITY_NOT_ZERO.toString());
    }

    return true;
  }

  async checkIsAvailableForArchiveAttributeValue(
    productAttributeValueId: string,
  ) {
    const result = await this.repository.findOneByFieldName(
      {
        productAttributeValueId: Like(`%${productAttributeValueId}%`),
        quantity: MoreThan(0),
      },
      ['quantity'],
    );

    if (result != null) {
      throw new BadRequestError(HttpCode.PRODUCT_QUANTITY_NOT_ZERO.toString());
    }

    return this.response({ id: productAttributeValueId });
  }

  async checkIsAvailableForArchiveAttribute(productAttributeId: string) {
    const result = await this.productAttributeValueRepository.findMany({
      condition: { productAttributeId },
      select: ['id'],
    });

    for (var i = 0; i < result[0].length; i++) {
      const attributevalue = await this.repository.findOneByFieldName(
        {
          productAttributeValueId: Like(`%${result[0][i].id}%`),
          quantity: MoreThan(0),
        },
        ['quantity'],
      );
      if (attributevalue != null) {
        throw new BadRequestError(
          HttpCode.PRODUCT_QUANTITY_NOT_ZERO.toString(),
        );
      }
    }

    return this.response({ id: productAttributeId });
  }

  async getProductsReport(
    filter: Filter,
    viewStock: string,
    conditionId: string,
  ) {
    const baseQuery = () => {
      const query = this.repository.connection
        .createQueryBuilder(ProductVariant, 'PV')
        .select([
          'PV.id',
          'PV.name',
          'PV.barcode',
          'PV.quantity',
          'PV.cost',
          'PV.price',
          'PV.wholePrice',
          'PV.distributePrice',
          'P.name',
          'P.namekm',
          'P.type',
          'U.id',
          'U.name',
          'U.multiple',
          'U.label',
        ]);

      if (!!filter.locationId) {
        query
          .leftJoin(
            'PV.productLocations',
            'PL',
            'PL.locationId = :locationId',
            { locationId: filter.locationId },
          )
          .addSelect('PL.id')
          .addSelect('PL.locationId')
          .addSelect('PL.quantity')
          .addSelect('PL.productVariantId');
      }

      query.where('PV.status = 1');

      if (filter.similar && filter.similar != '0') {
        query.andWhere(
          `(P.name LIKE '%${filter.similar}%' OR P.namekm LIKE '%${filter.similar}%' OR PV.name LIKE '%${filter.similar}%' OR PV.barcode LIKE '%${filter.similar}%')`,
        );
      }

      if (viewStock == 'zeroStock') {
        query.andWhere('PV.quantity = 0');
      } else if (viewStock == 'reorder') {
        query.andWhere('PV.quantity <= P.reorderPoint AND PV.quantity > 0');
      } else if (viewStock == 'errorStock') {
        query.andWhere('PV.quantity < 0');
      }

      if (conditionId) {
        query.andWhere('P.conditionId = :conditionId', { conditionId });
      }

      return query;
    };

    const resultQuery = baseQuery()
      .innerJoin('PV.product', 'P', 'P.status = 1')
      .innerJoin('P.unitOfMeasurement', 'U');

    const summaryQuery = baseQuery().innerJoin(
      'PV.product',
      'P',
      'P.status = 1',
    );

    if (filter.offset >= 0) {
      resultQuery.offset(filter.offset);
    }

    if (filter.limit == null) {
      filter.limit = this.repository.limit;
    }

    resultQuery.limit(filter.limit);

    resultQuery.orderBy('P.name');

    const result = this.responses(
      await resultQuery.getMany(),
      await resultQuery.getCount(),
      filter.limit,
      filter.offset,
    );

    summaryQuery.select(['cost', 'price']);

    if (!!filter.locationId) {
      summaryQuery.addSelect('PL.quantity', 'quantity');
    } else {
      summaryQuery.addSelect('PV.quantity', 'quantity');
    }

    const summary = await summaryQuery.getRawMany();

    const currentStockValueByCost = _.sumBy(
      summary,
      (value) => value.cost * value.quantity,
    );
    const currentStockValueByPrice = _.sumBy(
      summary,
      (value) => value.price * value.quantity,
    );
    const expectedProfit = Math.max(
      currentStockValueByPrice - currentStockValueByCost,
      0,
    );

    result['summary'] = {
      currentStockValueByCost,
      currentStockValueByPrice,
      expectedProfit,
      expectedMargin: (expectedProfit / currentStockValueByPrice) * 100,
    };

    return result;
  }

  async getInventoryDashboard(clientId: string) {
    const stockByConditions = await this.repository.connection
      .createQueryBuilder(Product, 'P')
      .innerJoin('P.productVariants', 'PV', 'PV.clientId = :clientId', {
        clientId,
      })
      .innerJoin('P.condition', 'C')
      .select(['C.id AS id', 'C.name AS name', 'SUM(PV.quantity) AS quantity'])
      .groupBy('conditionId')
      .where('P.clientId = :clientId', { clientId })
      .getRawMany();

    const stockError = await this.repository.connection.query(`
            SELECT
                COUNT(PV.id) AS value,
                'stockError' AS type
            FROM ProductVariant PV 
            INNER JOIN Product P ON P.id = PV.productId
            WHERE PV.clientId = '${clientId}' AND 
            P.serialType = ${ProductSerialTypeEnums.STANDARD} AND 
            PV.quantity < 0 AND 
            PV.status = ${RecordStatus.Active}
        `);
    const stockStatusValues = await this.repository.connection.query(`
            SELECT
                COUNT(*) AS value,
                'reorder' AS type
            FROM 
                ProductVariant PV
            INNER JOIN Product P ON P.id = PV.productId
            WHERE 
                P.serialType = ${ProductSerialTypeEnums.STANDARD} AND 
                P.status = 1 AND 
                PV.clientId = '${clientId}' AND 
                PV.status = 1 AND
                PV.reorderPoint > 0 AND  
                PV.quantity <= PV.reorderPoint AND 
                PV.quantity > 0
            UNION ALL
            SELECT
                COUNT(*) AS value,
                'stockZero' AS type
            FROM 
                ProductVariant PV
            INNER JOIN Product P ON P.id = PV.productId
            WHERE 
                P.serialType = ${ProductSerialTypeEnums.STANDARD} AND 
                P.status = 1 AND 
                PV.clientId = '${clientId}' AND 
                PV.quantity = 0
            UNION ALL
            SELECT
                COUNT(PV.id) AS value,
                'stockValue' AS type
            FROM 
                ProductVariant PV
            INNER JOIN Product P ON P.id = PV.productId
            WHERE 
                P.status = 1 AND 
                PV.clientId = '${clientId}' AND 
                PV.status = 1
        `);

    return { stocks: [...stockStatusValues, ...stockError], stockByConditions };
  }

  async getPopularCategories(
    clientId: string,
    limit: number,
    locationId: string,
  ) {
    return await this.repository.connection.query(`
            SELECT 
                te.categoryId,
                pt.name,
                t.clientId,
                t.step,
                t.createdAt,
                truncate(sum(te.quantity * te.price), 2) AS total
            FROM TransactionEntry te
                INNER JOIN Category pt ON pt.id = te.categoryId
                INNER JOIN Transaction t ON t.id = te.transactionId
            GROUP BY te.categoryId 
            HAVING clientId = '${clientId}'
            AND step = ${TransactionStep.PAID}
            AND date_format(t.createdAt, '%Y-%m') >= '${moment()
              .subtract(90, 'days')
              .format('YYYY-MM')}'
            ORDER BY total DESC
            LIMIT ${limit}
        `);
  }

  async getPopularProducts(
    clientId: string,
    limit: number,
    popularBy: string,
    locationId: string,
  ) {
    const todayPurchases = await this.repository.connection.query(`
            SELECT 
                pv.id, 
                p.name,
                p.clientId,
                pv.barcode,
                te.price,
                TRUNCATE(SUM(te.quantity), 0) as soldQuantity,
                u.name as unit,
                truncate(sum(te.quantity * te.price), 2) as total,
                t.createdAt,
                t.step
            FROM 
                ProductVariant pv
                inner join Product p on p.id = pv.productId
                inner join Unit u on u.id = p.stockUnitId
                inner join TransactionEntry te on te.productVariantId = pv.id
                inner join Transaction t on t.id = te.transactionId
            group by pv.id 
            having clientId = '${clientId}'
            and step = ${TransactionStep.PAID}
            and date_format(createdAt, '%Y-%m') >= '${moment()
              .subtract(30, 'days')
              .format('YYYY-MM')}'
            order by ${popularBy == 'totalSale' ? 'total' : 'soldQuantity'} desc
            limit ${limit}
        `);

    return todayPurchases.filter((todayPurchase) => todayPurchase.id);
  }

  async getTodayPurchases(clientId: string, locationId: string) {
    return await this.repository.connection.query(`
            SELECT 
                pv.id, 
                p.name,
                p.clientId,
                pv.barcode,
                su.name AS supplier,
                sum(pe.receiveQuantity) AS purchaseQuantity,
                pe.price AS cost,
                u.name AS unit,
                truncate(sum(pe.receiveQuantity * pe.price), 2) AS purchaseTotal
            FROM 
                ProductVariant pv
                INNER JOIN Product p ON p.id = pv.productId
                INNER JOIN PurchaseOrderEntry pe ON pe.productVariantId = pv.id
                INNER JOIN Unit u ON u.id = pe.unitId
                INNER JOIN PurchaseOrder po ON po.id = pe.purchaseOrderId
                INNER JOIN Supplier su ON su.id = po.supplierId
            WHERE po.clientId = '${clientId}'
                AND po.step = ${PurchaseStepEnums.RECEIVED}
                AND date_format(po.createdAt, '%Y-%m-%d') = '${moment().format(
                  'YYYY-MM-DD',
                )}'
                AND pe.status = 1
                GROUP BY pe.productVariantId
                ORDER BY po.createdAt
        `);
  }

  async exportProduct(locationId: string, viewStock: string, clientId: string) {
    const selectColumns: string[] = [
        'P.name AS name',
        'P.namekm AS namekm',
        'PV.barcode AS barcode',
        'Unit.name AS unit',
        'TRUNCATE(PV.cost, 2) AS cost',
        'PV.price AS price',
        'PV.wholePrice AS wholePrice',
        'PV.distributePrice AS distributePrice',
      ],
      query = this.repository.connection
        .createQueryBuilder('ProductVariant', 'PV')
        .innerJoin('PV.product', 'P')
        .innerJoin('P.unitOfMeasurement', 'Unit')
        .where(
          `
            PV.clientId = :clientId AND
            PV.status = :status AND
            P.status = :status`,
          {
            clientId,
            status: RecordStatus.Active,
          },
        );

    if (locationId) {
      query.leftJoin(
        'PV.productLocations',
        'PL',
        'PL.locationId = :locationId',
        { locationId },
      );

      selectColumns.push('SUM(IFNULL(PL.quantity, 0)) AS quantity');
      selectColumns.push(
        'TRUNCATE(PV.cost * SUM(IFNULL(PL.quantity, 0)), 2) AS totalCost',
      );
      selectColumns.push(
        'TRUNCATE(PV.price * SUM(IFNULL(PL.quantity, 0)), 2) AS totalPrice',
      );
    } else {
      selectColumns.push('PV.quantity AS quantity');
      selectColumns.push('TRUNCATE(PV.cost * PV.quantity, 2) AS totalCost');
      selectColumns.push('TRUNCATE(PV.price * PV.quantity, 2) AS totalPrice');
    }

    query.select(selectColumns);

    if (viewStock == 'zeroStock') {
      query.andWhere('PV.quantity <= 0');
    } else if (viewStock == 'reorder') {
      query.andWhere('PV.quantity <= P.reorderPoint AND PV.quantity > 0');
    }

    query.groupBy('PV.id').orderBy('P.name').addOrderBy('P.namekm');

    return await query.getRawMany();
  }
}

import { BaseRepository } from '@common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { Product, ProductVariant } from '../entities';
import { FilterDto } from '@common/dto';
import { VariantRequestDto } from '../dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecordStatus } from '@common/const/record.status';

@Injectable()
export class ItemRepository extends BaseRepository<Product> {
  constructor(@InjectRepository(Product) readonly repository: Repository<Product>) {
    super(repository);
  }

  entityName: string = 'Product';

  async findMany(filter: FilterDto): Promise<[Product[], number]> {
    const query = this.repository
      .createQueryBuilder('P')
      .innerJoin('P.productVariants', 'PV', 'PV.status = :status', { status: RecordStatus.Active })
      .leftJoin('P.category', 'PT')
      .leftJoin('P.unitOfMeasurement', 'U');

    query.select([
      'P.id',
      'P.name',
      'P.image',
      'P.enableInventoryTracking',
      'P.serialType',
      'P.isSplittable',
      'P.productOption',
      'P.createdAt',
      'PT.id',
      'PT.name',
      'PV.id',
      'PV.name',
      'PV.image',
      'PV.barcode',
      'PV.quantity',
      'PV.price',
      'PV.wholePrice',
      'PV.distributePrice',
      'U.id',
      'U.name',
      'U.multiple',
    ]);

    if (!!filter.locationId) {
      query.leftJoin(
        'PV.productLocations',
        'PL',
        'PL.locationId = :locationId',
        { locationId: filter.locationId },
      );
      query.addSelect('PL.id');
      query.addSelect('PL.locationId');
      query.addSelect('PL.quantity');
    }

    query.where('P.status = :status', { status: RecordStatus.Active });

    if (filter.similar) {
      let similarString = '';
      similarString += ` P.name LIKE :key`;
      similarString += ` OR P.namekm LIKE :key`;
      similarString += ` OR PV.barcode LIKE :key`;
      similarString += ` OR PV.sku LIKE :key`;
      similarString += ` OR PV.name LIKE :key`;
      query.andWhere(`(${similarString})`, { key: '%' + filter.similar + '%' });
    }

    if (filter.advanceFilter) {
      filter.advanceFilter.forEach((value) => {
        if (value['column'] == 'categoryId') {
          query.andWhere('P.categoryId = :categoryId', {
            categoryId: value['value'],
          });
        }
      });
    }

    if (filter.offset >= 0) {
      query.offset(filter.offset);
    }

    query.take(parseInt(filter.limit));

    query.orderBy('P.createdAt', 'DESC').addOrderBy('P.name');

    return await query.getManyAndCount();
  }

  async findVariantsByItemId(dto: VariantRequestDto): Promise<[ProductVariant[], number]> {
    const query = this.repository
      .createQueryBuilder('PV')
      .select([
        'id',
        'productId',
        'barcode',
        'name',
        'cost',
        'price',
        'quantity',
        'wholePrice',
        'distributePrice',
        'reorderPoint',
        'factoryCost',
        'isAutoGenerateBarcode',
        'sku',
        'image',
        'productAttributeValueId',
      ])
      .where('productId = :productId AND status = 1', {
        productId: dto.productId,
      });

    if (dto.search)
      query.andWhere('name LIKE :name', { name: `%${dto.search}%` });

    const count = await query.getCount();

    return [
      await query
        .orderBy('createdAt')
        .limit(parseInt(dto.limit))
        .offset(parseInt(dto.offset))
        .getRawMany<ProductVariant>(),
      count,
    ];
  }

  async findManyForDropDown(filter: FilterDto, isSearchingBarcode?: boolean): Promise<[Product[], number]> {
    let conditionString = '';
    let conditionObject = {};

    const query = this.repository
      .createQueryBuilder('P')
      .innerJoinAndSelect('P.productVariants', 'PV')
      .innerJoinAndSelect('P.unitOfMeasurement', 'Unit')
      .where(`P.status = ${RecordStatus.Active}`);

    if (filter.advanceFilter) {
      filter.advanceFilter.forEach((advanceFilter) => {
        if (advanceFilter.column == 'serialType')
          query.andWhere('P.serialType IN(:serialType)', {
            serialType: advanceFilter.value,
          });
      });
    }

    if (filter.similar != null) {
      if (isSearchingBarcode) {
        conditionString = ` PV.barcode = :barcode `;
        conditionObject['barcode'] = filter.similar;
      } else {
        let similarString = '';
        similarString += 'P.name LIKE :key';
        similarString += ' OR P.namekm LIKE :key';
        similarString += ' OR PV.name LIKE :key';
        similarString += ' OR PV.barcode LIKE :key';

        if (similarString != '') {
          conditionString += ' (' + similarString + ') ';
          conditionObject['key'] = `%${filter.similar}%`;
        }
      }
      query.andWhere(conditionString, conditionObject);
    }

    return await query.getManyAndCount();
  }

  async searchProducts(filter: FilterDto, isSearchingBarcode?: boolean): Promise<[Product[], number]> {
    let condition = '',
      orderStr = '',
      limitStr = '';

    if (filter.similar != null && filter.similar != 'undefined') {
      if (isSearchingBarcode) {
        condition = ` pv.barcode = '${filter.similar}' `;
      } else {
        const similar = `'%${filter.similar}%'`;
        condition = ` (p.name LIKE ${similar} OR p.namekm LIKE ${similar} OR pv.barcode LIKE ${similar})`;
      }
    }

    if (filter.advanceFilter != null) {
      const advSize = filter.advanceFilter.length;
      if (condition) {
        condition = ` AND ${condition}`;
      }

      for (var i = 0; i < advSize; i++) {
        condition = ` ${condition} AND p.${filter.advanceFilter[i].column} IN('${filter.advanceFilter[i].value}')`;
      }
    }

    if (filter.limit == null) {
      filter.limit = this.limit;
      limitStr = `LIMIT ${filter.limit}`;
    }

    if (filter.offset >= 0) {
      limitStr = `LIMIT ${filter.offset}, ${filter.limit}`;
    }

    if (
      filter.sortField != null &&
      filter.sortField != '' &&
      filter.sortField != 'undefined'
    ) {
      orderStr = `ORDER BY p.${filter.sortField} ${filter.sortOrder},pv.name`;
    }

    const results = await this.repository.query(`
        SELECT 
          p.id,
          p.categoryId,
          pv.id AS productVariantId,
          pv.barcode,
          p.name,
          p.namekm,
          p.namebm,
          pv.name as variantName,
          pv.image as variantImage,
          p.image,
          p.serialType,
          p.type,
          pv.cost,
          pv.price,
          pv.wholePrice,
          pv.distributePrice,
          p.productOption as isProductVariant,
          0 AS productOption,
          b.name AS brand,
          u.name AS unit,
          u.id AS unitId,
          u.multiple AS multiple        
        FROM
          Product p 
          INNER JOIN ProductVariant pv ON pv.productId = p.id 
          INNER JOIN Unit u ON u.id = p.stockUnitId
          LEFT JOIN Brand b ON b.id = p.brandId
        WHERE p.status <> ${RecordStatus.Archive} 
        ${condition}
        ${orderStr}
        ${limitStr}
    `);

    return [results, results.length];
  }
}

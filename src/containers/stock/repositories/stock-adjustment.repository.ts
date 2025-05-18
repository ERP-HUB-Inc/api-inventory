import BaseRepository from '../../../core/common/repositories/BaseRepository';
import Filter, { QueryBuilderRelationship } from '../../../core/common/filters';
import { StockAdjustmentStepEnums } from '../enums/StockAdjustmentStepEnums';
import Utils from '../../../core/common/utils';
import { StockAdjustment } from '../entities';
import { EntityRepository } from 'typeorm';

@EntityRepository(StockAdjustment)
export default class StockAdjustmentRepository extends BaseRepository {
  entityName: string = 'StockAdjustment';

  selectField: string[] = [
    'id',
    'clientId',
    'locationId',
    'userId',
    'approverId',
    'title',
    'reason',
    'step',
    'status',
    'createdAt',
    'updatedAt',
  ];

  findMany(filter: Filter): Promise {
    const query = this.connection
      .createQueryBuilder(StockAdjustment, 'SA')
      .innerJoinAndSelect('SA.location', 'Location')
      .innerJoinAndSelect('SA.user', 'User')
      .leftJoinAndSelect('SA.approver', 'Approver');

    if (!!filter.similar) {
      query.andWhere(
        '(SA.description LIKE :key OR SA.subject LIKE :key OR User.fullName LIKE :key)',
        { key: filter.similar },
      );
    }

    if (filter.rangFilter) {
      if (Utils.isJsonString(filter.rangFilter)) {
        const rangFilter = JSON.parse(filter.rangFilter);
        query.andWhere(
          `DATE_FORMAT(SA.createdAt, '%Y-%m-%d') >= :startDate AND DATE_FORMAT(SA.createdAt, '%Y-%m-%d') <= :endDate`,
          {
            startDate: rangFilter['value'][0],
            endDate: rangFilter['value'][1],
          },
        );
      }
    }

    if (filter.advanceFilter) {
      filter.advanceFilter.forEach((value) => {
        if (value['column'] == 'step') {
          query.andWhere('SA.step = :step', { step: value['value'][0] });
        }
      });
    }

    if (filter.limit == null) {
      filter.limit = this.limit;
    }

    query.limit(parseInt(filter.limit));

    if (filter.offset > 0) query.offset(Number(filter.offset));

    query.orderBy('SA.createdAt', 'DESC');

    return query.getManyAndCount();
  }

  findManyOfApproveList(filter: Filter): Promise {
    const entities: string[] = ['Location', 'User'];

    const stockAdjustment = new StockAdjustment();
    stockAdjustment.subject = '';
    stockAdjustment.description = '';

    var conditionString = `${this.entityName}.step IN(:step)`;
    var conditionObject = { step: [StockAdjustmentStepEnums.REQUESTED] };

    if (!filter.isFullAccess) {
      conditionString = `${conditionString} AND ${this.entityName}.locationId = :locationId`;
      conditionObject['locationId'] = filter.locationId;
    }

    if (filter.similar != null && Utils.isJsonString(filter.similar)) {
      const similarFilter = JSON.parse(filter.similar);
      // similar search
      if (
        similarFilter['value'] != null &&
        similarFilter['value'] != 'undefined'
      ) {
        var similarString = '';
        for (var i = 0; i < similarFilter['column'].length; i++) {
          if (similarFilter['column'][i] in stockAdjustment) {
            if (similarString == '')
              similarString = `${this.entityName}.${similarFilter['column'][i]} LIKE :key`;
            else
              similarString += ` OR ${this.entityName}.${similarFilter['column'][i]} LIKE :key`;
          }
        }
        if (similarString != '') {
          conditionString += ' AND (' + similarString + ') ';
          conditionObject['key'] = '%' + similarFilter['value'] + '%';
        }
      }
    }

    let relationShipCollection: QueryBuilderRelationship[] = [
      {
        entityName: entities[0],
        relation: 'location',
        select: ['id', 'name'],
      },
      {
        entityName: entities[1],
        relation: 'user',
        select: ['id', 'fullName'],
      },
      {
        entityName: entities[1],
        aliasName: 'approver',
        relation: 'approver',
        relationType: 'LEFT',
      },
    ];
    return this.findManyQueryBuilder(
      StockAdjustment,
      relationShipCollection,
      filter,
      [conditionString, conditionObject],
    ).getManyAndCount();
  }

  detail(id: string): Promise {
    return this.connection
      .createQueryBuilder(StockAdjustment, 'SA')
      .leftJoin('SA.details', 'SAE', 'SAE.status <> 3')
      .leftJoin('SA.user', 'User')
      .innerJoin('SA.location', 'Location')
      .select([
        'SA.id',
        'SA.locationId',
        'SA.userId',
        'SA.subject',
        'SA.description',
        'SA.type',
        'SA.step',
        'User.id',
        'User.fullName',
        'Location.id',
        'Location.name',
        'SAE.id',
        'SAE.stockAdjustmentId',
        'SAE.productVariantId',
        'SAE.productName',
        'SAE.variantName',
        'SAE.barcode',
        'SAE.currentQuantity',
        'SAE.adjustQuantity',
        'SAE.unitId',
        'SAE.status',
      ])
      .where('SA.id =:id', { id })
      .getOne();
  }
}

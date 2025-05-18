import BaseRepository from '../../../core/common/repositories/BaseRepository';
import Filter, { QueryBuilderRelationship } from '../../../core/common/filters';
import { TransferStepEnums } from '../enums/TransferStepEnums';
import { RecordStatus } from '../../../core/setting/enums';
import Utils from '../../../core/common/utils';
import { StockTransfer } from '../entities';
import { EntityRepository } from 'typeorm';

@EntityRepository(StockTransfer)
export default class StockTransferRepository extends BaseRepository {
  entityName: string = 'StockTransfer';

  selectField: string[] = [
    'id',
    'clientId',
    'fromLocationId',
    'toLocationId',
    'userId',
    'deliveryDueDate',
    'name',
    'number',
    'step',
    'status',
    'createdAt',
    'updatedAt',
  ];

  async findMany(filter: Filter): Promise {
    const entities: string[] = ['Location', 'User'];

    // language
    var conditionString = ``;
    var conditionObject = {};

    if (!filter.isFullAccess) {
      conditionString = `${this.entityName}.fromLocationId = :fromLocationId`;
      conditionObject['fromLocationId'] = filter.locationId;
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
          if (this.selectField.indexOf(similarFilter['column'][i]) != -1) {
            if (similarString == '')
              similarString = `${this.entityName}.${similarFilter['column'][i]} LIKE :key`;
            else
              similarString += ` OR ${this.entityName}.${similarFilter['column'][i]} LIKE :key`;
          }
        }
        if (similarString != '') {
          conditionString += ' (' + similarString + ') ';
          conditionObject['key'] = '%' + similarFilter['value'] + '%';
        }
      }
    }

    let relationShipCollection: QueryBuilderRelationship[] = [
      {
        entityName: entities[0],
        aliasName: 'FromLocation',
        relation: 'fromLocation',
        select: ['id', 'name'],
      },
      {
        entityName: entities[0],
        relation: 'toLocation',
        select: ['id', 'name'],
      },
      {
        entityName: entities[1],
        relation: 'user',
        select: ['id', 'fullName'],
      },
      {
        entityName: entities[1],
        aliasName: 'Receiver',
        relation: 'receiver',
        relationType: 'LEFT',
      },
    ];
    return await this.findManyQueryBuilder(
      StockTransfer,
      relationShipCollection,
      filter,
      [conditionString, conditionObject],
    ).getManyAndCount();
  }

  async findManyOfReceiveList(filter: Filter): Promise {
    const entities: string[] = ['Location', 'User'];

    var conditionString = `${this.entityName}.step IN(:step)`;
    var conditionObject = {
      step: [TransferStepEnums.RECEIVED, TransferStepEnums.PROCESS],
    };

    if (!filter.isFullAccess) {
      conditionString = `${conditionString} AND ${this.entityName}.toLocationId = :toLocationId`;
      conditionObject['toLocationId'] = filter.locationId;
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
          // SEARCH SIMILAR WITH PRODUCT DESCRIPTION
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
        aliasName: 'FromLocation',
        relation: 'fromLocation',
        select: ['id', 'name'],
      },
      {
        entityName: entities[0],
        relation: 'toLocation',
        select: ['id', 'name'],
      },
      {
        entityName: entities[1],
        relation: 'user',
        select: ['id', 'fullName'],
      },
      {
        entityName: entities[1],
        aliasName: 'Receiver',
        relation: 'receiver',
        relationType: 'LEFT',
      },
    ];
    return await this.findManyQueryBuilder(
      StockTransfer,
      relationShipCollection,
      filter,
      [conditionString, conditionObject],
    ).getManyAndCount();
  }

  async detail(stockTransferId: string, languageId: string): Promise {
    const entities: string[] = [
      'StocktransferEntry',
      'Supplier',
      'User',
      'Location',
    ];
    return await this.findManyQueryBuilder(
      StockTransfer,
      [
        {
          entityName: entities[0],
          relation: 'stockTransferEntries',
          relationType: 'LEFT',
          subRelation: {
            name: 'productVariant',
            relation: [
              {
                name: 'product',
                relation: {
                  name: 'productDescriptions',
                  condition: [
                    'productDescriptions.languageId = :languageId',
                    { languageId },
                  ],
                },
              },
              {
                name: 'productLocations',
              },
            ],
          },
          condition: [
            `${entities[0]}.status = :purchaseOrderEntryStatus`,
            { purchaseOrderEntryStatus: RecordStatus.Active },
          ],
        },
      ],
      {},
      [`${this.entityName}.id = :stockTransferId`, { stockTransferId }],
    ).getOne();
  }

  async findManyV2(filter: Filter) {
    const query = this.connection
      .createQueryBuilder(StockTransfer, 'S')
      .leftJoin('S.stockTransferEntries', 'SE', 'SE.status <> 3')
      .leftJoin('S.user', 'User')
      .innerJoin('S.fromLocation', 'FL')
      .leftJoin('S.toLocation', 'TL')
      .select([
        'S.id AS id',
        'S.number AS number',
        'User.fullName AS transferBy',
        'S.createdAt AS date',
        'FL.name AS fromLocation',
        'TL.name AS toLocation',
        'S.step AS step',
      ])
      .where('S.clientId = :clientId', { clientId: filter.clientId });

    if (filter.similar != null && filter.similar != 'undefined') {
      query.andWhere(
        `(S.name LIKE :search OR S.description LIKE :search OR User.fullName LIKE :search OR FL.name LIKE :search)`,
        { search: `%${filter.similar}%` },
      );
    }

    if (filter.condition) {
      if (filter.condition['fromLocationId'])
        query.andWhere('S.fromLocationId = :fromLocationId', {
          fromLocationId: filter.condition['fromLocationId'],
        });
      if (filter.condition['toLocationId'])
        query.andWhere('S.toLocationId = :toLocationId', {
          toLocationId: filter.condition['toLocationId'],
        });
    }

    if (filter.rangFilter) {
      if (Utils.isJsonString(filter.rangFilter)) {
        const rangFilter = JSON.parse(filter.rangFilter);
        query.andWhere(
          `DATE_FORMAT(S.createdAt, '%Y-%m-%d') >= :startDate AND DATE_FORMAT(S.createdAt, '%Y-%m-%d') <= :endDate`,
          {
            startDate: rangFilter['value'][0],
            endDate: rangFilter['value'][1],
          },
        );
      }
    }

    if (filter.limit == null) {
      filter.limit = this.limit;
    }

    query.limit(filter.limit);

    query.offset(filter.offset);

    query.orderBy('S.createdAt', 'DESC');

    return {
      data: await query.getRawMany(),
      pagination: {
        total: await query.getCount(),
        offset: filter.offset,
        limit: filter.limit,
      },
    };
  }

  async detailV2(id: string, clientId: string): Promise {
    return await this.connection
      .createQueryBuilder(StockTransfer, 'ST')
      .leftJoin('ST.stockTransferEntries', 'STE', 'STE.status <> 3')
      .leftJoin('ST.user', 'User')
      .innerJoin('ST.fromLocation', 'FL')
      .select([
        'ST.id',
        'ST.fromLocationId',
        'ST.toLocationId',
        'ST.userId',
        'ST.receiverId',
        'ST.description',
        'ST.step',
        'User.id',
        'User.fullName',
        'STE.id',
        'STE.stockTransferId',
        'STE.productVariantId',
        'STE.productName',
        'STE.variantName',
        'STE.barcode',
        'STE.transferQuantity',
        'STE.unitId',
        'STE.status',
      ])
      .where('ST.clientId = :clientId AND ST.id =:id', { clientId, id })
      .getOne();
  }
}

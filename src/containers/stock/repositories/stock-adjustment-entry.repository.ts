import BaseRepository from '../../../core/common/repositories/BaseRepository';
import { StockAdjustmentEntry } from '../entities';
import { EntityRepository } from 'typeorm';

@EntityRepository(StockAdjustmentEntry)
export default class StockAdjustmentEntryRepository extends BaseRepository {
  entityName: string = 'StockAdjustmentEntry';

  selectField: string[] = [
    'id',
    'stockAdjustmentId',
    'productVariantId',
    'currentQuantity',
    'adjustQuantity',
    'unitId',
    'status',
    'createdAt',
    'updatedAt',
  ];

  constructor() {
    super();
  }
}

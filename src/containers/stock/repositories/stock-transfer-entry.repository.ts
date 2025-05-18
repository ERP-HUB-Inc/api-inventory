import BaseRepository from '../../../core/common/repositories/BaseRepository';
import { StockTransferEntry } from '../entities';
import { EntityRepository } from 'typeorm';

@EntityRepository(StockTransferEntry)
export default class StockTransferEntryRepository extends BaseRepository {
  entityName: string = 'StockTransferEntry';

  selectField: string[] = [
    'id',
    'stockTransferId',
    'productVariantId',
    'transferQuantity',
    'receiveQuantity',
    'unitId',
    'price',
    'status',
    'createdAt',
    'updatedAt',
  ];

  constructor() {
    super();
  }
}

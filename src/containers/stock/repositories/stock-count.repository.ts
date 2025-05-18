import BaseRepository from '../../../core/common/repositories/BaseRepository';
import { EntityRepository } from 'typeorm';
import { StockCount } from '../entities';

@EntityRepository(StockCount)
export default class StockCountRepository extends BaseRepository {
  entityName: string = 'StockCount';
}

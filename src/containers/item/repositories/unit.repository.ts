import BaseRepository from '../../../core/common/repositories/BaseRepository';
import { EntityRepository } from 'typeorm';
import Unit from '../entities/Unit';

@EntityRepository(Unit)
export default class UnitRepository extends BaseRepository {
  entityName: string = 'Unit';

  selectField: string[] = [
    'id',
    'clientId',
    'name',
    'multiple',
    'label',
    'isSystem',
    'status',
    'createdAt',
    'updatedAt',
    'isDefault',
  ];
}

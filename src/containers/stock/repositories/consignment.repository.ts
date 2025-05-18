import BaseRepository from '../../../core/common/repositories/BaseRepository';
import { ConsignmentEntry } from '../entities';
import { EntityRepository } from 'typeorm';

@EntityRepository(ConsignmentEntry)
export default class ConsignmentRepository extends BaseRepository {
  entityName: string = 'ConsignmentEntry';

  selectField: string[] = [
    'id',
    'locationId',
    'supplierId',
    'description',
    'date',
    'status',
  ];
}

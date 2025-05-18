import BaseRepository from '../../../core/common/repositories/BaseRepository';
import Supplier from '../entities/Supplier';
import { EntityRepository } from 'typeorm';

@EntityRepository(Supplier)
export default class SupplierRepository extends BaseRepository {
  entityName: string = 'Supplier';

  selectField: string[] = [
    'id',
    'clientId',
    'name',
    'description',
    'phoneNumber',
    'email',
    'status',
    'createdAt',
    'updatedAt',
  ];

  defaultOrder: string[] = ['name', 'ASC'];
}

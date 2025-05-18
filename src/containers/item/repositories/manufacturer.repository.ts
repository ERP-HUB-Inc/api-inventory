import BaseRepository from '../../../core/common/repositories/BaseRepository';
import { Manufacturer } from '../entities';
import { EntityRepository } from 'typeorm';

@EntityRepository(Manufacturer)
export default class ManufacturerRepository extends BaseRepository {
  entityName: string = 'Manufacturer';

  selectField: string[] = [
    'id',
    'name',
    'description',
    'address',
    'city',
    'state',
    'country',
    'postalCode',
    'phoneNumber',
    'email',
    'website',
    'taxId',
    'businessLicense',
    'establishedDate',
    'status',
    'createdAt',
    'updatedAt',
  ];
}

import BaseService from '../../../core/common/services/BaseService';
import SupplierRepository from '../repositories/SupplierRepository';
import { getCustomRepository } from 'typeorm';
import Supplier from '../entities/Supplier';
import { Service } from 'typedi';

@Service()
export default class SupplierService extends BaseService {
  protected repository: SupplierRepository;

  constructor() {
    super();
    this.repository = getCustomRepository(SupplierRepository);
  }
}

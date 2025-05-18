import ProductLogRepository from '../repositories/ProductLogRepository';
import BaseService from '../../../core/common/services/BaseService';
import ProductLog from '../entities/ProductLog';
import { getCustomRepository } from 'typeorm';
import { Service } from 'typedi';

@Service()
export default class ProductLogService extends BaseService {
  constructor() {
    super();
    this.repository = getCustomRepository(ProductLogRepository);
  }
}

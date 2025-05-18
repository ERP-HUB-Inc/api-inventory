import ProductCostRepository from '../repositories/ProductCostRepository';
import BaseService from '../../../core/common/services/BaseService';
import ProductCost from '../entities/ProductCost';
import { getCustomRepository } from 'typeorm';
import { Service } from 'typedi';

@Service()
export default class ProductCostService extends BaseService {
  constructor() {
    super();
    this.repository = getCustomRepository(ProductCostRepository);
  }
}

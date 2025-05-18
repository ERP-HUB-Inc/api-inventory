import BaseService from '../../../core/common/services/BaseService';
import ProductRepository from '../repositories/ItemRepository';
import { getCustomRepository } from 'typeorm';
import Product from '../entities/Product';
import { Service } from 'typedi';

@Service()
export default class ProductSeachService extends BaseService {
  constructor() {
    super();
    this.repository = getCustomRepository(ProductRepository);
  }
}

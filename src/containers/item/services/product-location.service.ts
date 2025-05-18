import ProductLocationRepository from '../repositories/ProductLocationRepository';
import BaseService from '../../../core/common/services/BaseService';
import ProductLocation from '../entities/ProductLocation';
import { getCustomRepository } from 'typeorm';
import { Service } from 'typedi';

@Service()
export default class ProductLocationService extends BaseService {
  protected repository: ProductLocationRepository;

  constructor() {
    super();
    this.repository = getCustomRepository(ProductLocationRepository);
  }
}

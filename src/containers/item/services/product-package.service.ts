import ProductPackageRepository from '../repositories/ProductPackageRepository';
import BaseService from '../../../core/common/services/BaseService';
import ProductPackage from '../entities/ProductPackage';
import { getCustomRepository } from 'typeorm';
import { Service } from 'typedi';

@Service()
export default class ProductPackageService extends BaseService {
  constructor() {
    super();
    this.repository = getCustomRepository(ProductPackageRepository);
  }
}

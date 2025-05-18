import ProductTaxRepository from '../repositories/ProductTaxRepository';
import BaseService from '../../../core/common/services/BaseService';
import ProductTax from '../entities/ProductTax';
import { getCustomRepository } from 'typeorm';
import { Service } from 'typedi';

@Service()
export default class ProductTaxService extends BaseService {
  constructor() {
    super();
    this.repository = getCustomRepository(ProductTaxRepository);
  }
}

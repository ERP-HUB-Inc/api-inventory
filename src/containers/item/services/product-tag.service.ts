import ProductTagRepository from '../repositories/ProductTagRepository';
import BaseService from '../../../core/common/services/BaseService';
import ProductTag from '../entities/ProductTag';
import { getCustomRepository } from 'typeorm';
import { Service } from 'typedi';

@Service()
export default class ProductTagService extends BaseService {
  constructor() {
    super();
    this.repository = getCustomRepository(ProductTagRepository);
  }
}

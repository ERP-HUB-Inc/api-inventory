import ProductImageRepository from '../repositories/ProductImageRepository';
import BaseService from '../../../core/common/services/BaseService';
import ProductImage from '../entities/ProductImage';
import { getCustomRepository } from 'typeorm';
import { Service } from 'typedi';

@Service()
export default class ProductImageService extends BaseService {
  constructor() {
    super();
    this.repository = getCustomRepository(ProductImageRepository);
  }
}

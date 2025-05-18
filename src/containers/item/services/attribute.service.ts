import AttributeRepository from '../repositories/AttributeRepository';
import BaseService from '../../../core/common/services/BaseService';
import Attribute from '../entities/Attribute';
import { getCustomRepository } from 'typeorm';
import { Service } from 'typedi';

@Service()
export default class AttributeService extends BaseService {
  constructor() {
    super();
    this.repository = getCustomRepository(AttributeRepository);
  }
}

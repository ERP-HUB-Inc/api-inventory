import ConditionRepository from '../repositories/ConditionRepository';
import BaseService from '../../../core/common/services/BaseService';
import Condition from '../entities/Condition';
import { getCustomRepository } from 'typeorm';
import { Service } from 'typedi';

@Service()
export default class ConditionService extends BaseService {
  protected repository: ConditionRepository;

  constructor() {
    super();
    this.repository = getCustomRepository(ConditionRepository);
  }
}

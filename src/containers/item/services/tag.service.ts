import BaseService from '../../../core/common/services/BaseService';
import TagRepository from '../repositories/TagRepository';
import { getCustomRepository } from 'typeorm';
import Tag from '../entities/Tag';
import { Service } from 'typedi';

@Service()
export default class TagService extends BaseService {
  constructor() {
    super();
    this.repository = getCustomRepository(TagRepository);
  }
}

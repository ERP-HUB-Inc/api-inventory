import BaseRepository from '../../../core/common/repositories/BaseRepository';
import Filter from '../../../core/common/filters';
import { EntityRepository } from 'typeorm';
import Reward from '../entities/Reward';

@EntityRepository(Reward)
export default class RewardRepository extends BaseRepository {
  async getRewards(filter: Filter) {
    const query = this.connection
      .createQueryBuilder(Reward, 'RW')
      .where('clientId = :clientId', { clientId: filter.clientId });

    if (filter.offset >= 0) {
      query.offset(filter.offset);
    }

    if (filter.limit == null) {
      filter.limit = this.limit;
    }

    return {
      data: await query.orderBy('cost', 'ASC').getMany(),
      pagination: {
        total: await query.getCount(),
        offset: filter.offset,
        limit: filter.limit,
      },
    };
  }
}

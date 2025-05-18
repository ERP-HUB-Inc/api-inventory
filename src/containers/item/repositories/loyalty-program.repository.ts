import { EntityRepository, getConnection, getManager } from 'typeorm';
import BaseRepository from '../../../core/common/repositories/BaseRepository';
import { RecordStatus } from '../../../core/setting/enums';
import LoyaltyProgram from '../entities/LoyaltyProgram';
import User from '../../../core/setting/models/User';
import Filter from '../../../core/common/filters';
import Reward from '../entities/Reward';
import { v4 as uuidv4 } from 'uuid';

@EntityRepository(LoyaltyProgram)
export default class LoyaltyProgramRepository extends BaseRepository {
  async getLoyaltyProgramById(user: User, id: string) {
    const query = getConnection()
      .createQueryBuilder(LoyaltyProgram, 'LP')
      .innerJoin('LP.rewards', 'Reward')
      .select([
        'LP.id',
        'LP.locationId',
        'LP.name',
        'LP.pointPerAmount',
        'LP.pointPerOrder',
        'LP.pointPerProduct',
        'LP.pointIncreament',
        'Reward.id',
        'Reward.name',
        'Reward.type',
        'Reward.cost',
      ])
      .where('LP.clientId = :clientId AND LP.id = :id', {
        clientId: user.clientId,
        id,
      })
      .orderBy('Reward.cost');

    return {
      data: await query.getOne(),
    };
  }

  async getLoyaltyPrograms(filter: Filter) {
    const query = getConnection()
      .createQueryBuilder(LoyaltyProgram, 'LP')
      .select([
        'LP.id AS id',
        'LP.name AS name',
        'LP.pointPerAmount AS pointPerAmount',
        'LP.pointPerOrder AS pointPerOrder',
        'LP.pointPerProduct AS pointPerProduct',
        'LP.pointIncreament AS pointIncreament',
      ])
      .where('LP.clientId = :clientId', { clientId: filter.clientId });

    if (filter.offset >= 0) {
      query.offset(filter.offset);
    }

    if (filter.limit == null) {
      filter.limit = this.limit;
    }

    query.orderBy('LP.name');

    return {
      data: await query.getRawMany(),
      pagination: {
        total: await query.getCount(),
        offset: filter.offset,
        limit: filter.limit,
      },
    };
  }

  getLoyaltyProgram(clientId: string): Promise {
    return getConnection()
      .createQueryBuilder(LoyaltyProgram, 'LP')
      .select([
        'id',
        'pointPerAmount',
        'pointPerOrder',
        'pointPerProduct',
        'pointIncreament',
      ])
      .where('LP.clientId = :clientId', { clientId })
      .getRawOne();
  }

  async createNew(user: User, data: LoyaltyProgram) {
    await getManager().transaction(async (manager) => {
      data.id = uuidv4();
      data.clientId = user.clientId;
      await manager.insert(LoyaltyProgram, data);

      data.rewards = data.rewards.map((reward) => {
        reward.id = uuidv4();
        reward.clientId = user.clientId;
        reward.loyaltyProgramId = data.id;
        return reward;
      });

      await manager.insert(Reward, data.rewards);
    });
  }

  async updateById(user: User, data: LoyaltyProgram, id: string) {
    await getManager().transaction(async (manager) => {
      await manager.update(
        LoyaltyProgram,
        { clientId: user.clientId, id },
        data,
      );
      const deleteIds = [];
      data.rewards = data.rewards.map((reward) => {
        if (!reward.id) {
          reward.id = uuidv4();
          reward.clientId = user.clientId;
          reward.loyaltyProgramId = id;
        }

        if (reward['status'] && reward['status'] === RecordStatus.Archive) {
          deleteIds.push(reward.id);
        }

        return reward;
      });

      await manager.save(Reward, data.rewards);

      if (deleteIds.length) {
        await manager
          .createQueryBuilder(Reward, 'PD')
          .where('id IN(:ids) AND clientId = :clientId', {
            ids: deleteIds,
            clientId: user.clientId,
          })
          .delete()
          .execute();
      }
    });
  }

  async delete(user: User, loyaltyProgramId: string) {
    await getManager().transaction(async (manager) => {
      await manager
        .createQueryBuilder(LoyaltyProgram, 'P')
        .where(`id = :loyaltyProgramId AND clientId = "${user.clientId}"`, {
          loyaltyProgramId,
        })
        .delete()
        .execute();
      await manager
        .createQueryBuilder(Reward, 'PD')
        .where(
          `loyaltyProgramId = :loyaltyProgramId AND clientId = "${user.clientId}"`,
          { loyaltyProgramId },
        )
        .delete()
        .execute();
    });

    return {
      message: 'Delete success!',
      status: 204,
    };
  }
}

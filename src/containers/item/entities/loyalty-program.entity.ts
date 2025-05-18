import {
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import { Reward } from './reward.entity';
import { BaseEntity } from '@common/entities/base.entity';

@Entity('LoyaltyProgram')
export class LoyaltyProgram extends BaseEntity {
  @Column()
  locationId: string;

  @Column()
  name: string;

  @Column()
  pointPerAmount: number;

  @Column()
  pointPerOrder: number;

  @Column()
  pointPerProduct: number;

  @Column()
  pointIncreament: number;

  @OneToMany(() => Reward, (reward) => reward.loyaltyProgram)
  rewards: Reward[];
}

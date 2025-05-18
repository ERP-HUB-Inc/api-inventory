import { Column, Entity, ManyToOne } from 'typeorm';
import { LoyaltyProgram } from './loyalty-program.entity';
import { BaseEntity } from '@common/entities/base.entity';

@Entity('Reward')
export class Reward extends BaseEntity {
  @Column()
  loyaltyProgramId: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  cost: number;

  @ManyToOne(() => LoyaltyProgram, (loyaltyProgram) => loyaltyProgram.rewards)
  loyaltyProgram: LoyaltyProgram;
}

import { Column, Entity, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { User } from '@item/entities/user.entity';
import { StockAdjustmentEntry } from './stock-adjustment-entry.entity';

@Entity('StockAdjustment')
export class StockAdjustment extends BaseEntity {
  @Column()
  locationId: string;

  @Column()
  userId: string;

  @Column()
  approverId: string;

  @Column()
  subject: string;

  @Column()
  description: string;

  @Column()
  type: string;

  @Column()
  step: number;

  @OneToOne(() => Location)
  @JoinColumn()
  location: Location;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => User)
  @JoinColumn()
  approver: User;

  @OneToMany(() => StockAdjustmentEntry, (stockAdjustmentEntry) => stockAdjustmentEntry.stockAdjustment)
  details: StockAdjustmentEntry[];
}

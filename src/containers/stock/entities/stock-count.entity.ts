import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { StockCountEntry } from '.';
import { BaseEntity } from '@common/entities/base.entity';

@Entity('StockCount')
export class StockCount extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  clientId: string;

  @Column()
  locationId: string;

  @Column()
  name: string;

  @Column()
  startDate: string;

  @Column()
  startTime: string;

  @Column()
  endDate: string;

  @Column()
  endTime: string;

  @Column()
  type: string;

  @OneToMany(() => StockCountEntry, (stockCountEntry) => stockCountEntry.stockCount)
  details: StockCountEntry[];

  @OneToOne(() => Location)
  @JoinColumn()
  location: Location;

  uncounted: number;

  counted: number;

  unmatched: number;

  matched: number;

  all: number;
}

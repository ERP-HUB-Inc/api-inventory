import { Column, Entity, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import Location from '../../../core/setting/models/Location';
import Model from '../../../core/common/models/Model';
import User from '../../../core/setting/models/User';
import { StockTransferEntry } from '.';

@Entity('StockTransfer')
export class StockTransfer extends Model {
  @Column()
  clientId: string;

  @Column()
  fromLocationId: string;

  @Column()
  toLocationId: string;

  @Column()
  userId: string;

  @Column()
  receiverId: string;

  @Column()
  deliveryDueDate: Date;

  @Column()
  receiveDate: Date;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  number: string;

  @Column()
  step: number;

  @OneToOne(() => Location)
  @JoinColumn()
  fromLocation: Location;

  @OneToOne(() => Location)
  @JoinColumn()
  toLocation: Location;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => User)
  @JoinColumn()
  receiver: User;

  @OneToMany(
    () => StockTransferEntry,
    (stockTransferEntry) => stockTransferEntry.stockTransfer,
  )
  stockTransferEntries: StockTransferEntry[];

  locationId: string;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class EODLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  itemId: string;

  @Column()
  userId: string;

  @Column()
  startQuantity: number;

  @Column()
  inQuantity: number;

  @Column()
  outQuantity: number;

  @Column()
  endQuantity: number;

  @Column()
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

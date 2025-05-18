import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';

@Entity('Supplier')
export class Supplier extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  clientId: string;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;
}

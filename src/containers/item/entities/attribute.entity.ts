import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('Attribute')
export class Attribute extends BaseEntity {
  @Column()
  clientId: string;

  @Column()
  name: string;

  @Column()
  description: string;
}

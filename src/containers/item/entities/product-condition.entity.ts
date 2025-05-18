import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ProductCondition')
export default class ProductCondition extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;
}

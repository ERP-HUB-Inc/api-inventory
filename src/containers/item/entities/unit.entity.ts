import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('Unit')
export class Unit extends BaseEntity {
  @Column()
  name: string;

  @Column()
  multiple: number;

  @Column()
  label: string;

  @Column()
  isSystem: number;

  @Column()
  isDefault: number;
}

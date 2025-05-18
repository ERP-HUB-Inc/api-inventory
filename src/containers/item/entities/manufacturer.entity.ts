import {
  Entity,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { BaseEntity } from '@common/entities/base.entity';

@Entity('Manufacturer')
export class Manufacturer extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  @Expose()
  name: string;

  @Column({ type: 'text', nullable: true })
  @Expose()
  description?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Expose()
  address?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Expose()
  city?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Expose()
  state?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Expose()
  country?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @Expose()
  postalCode?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @Expose()
  phoneNumber?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Expose()
  email?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Expose()
  website?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @Expose()
  taxId?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @Expose()
  businessLicense?: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Expose()
  establishedDate: Date;
}

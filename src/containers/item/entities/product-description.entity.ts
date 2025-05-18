import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';

@Entity('ProductDescription')
export class ProductDescription extends BaseEntity {
  @Column()
  productId: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  languageId: string;
}

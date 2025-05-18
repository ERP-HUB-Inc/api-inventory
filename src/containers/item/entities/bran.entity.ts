import { BaseEntity } from '@common/entities/base.entity';
import { Product } from '@item/entities/product.entity';
import {
  Column,
  Entity,
  OneToMany,
} from 'typeorm';

@Entity()
export class Brand extends BaseEntity {
  @Column()
  name: string;

  @Column()
  image: string;

  @Column()
  description: string;

  @Column()
  isDefault: number;

  @OneToMany(() => Product, product => product.brand)
  products: Product[];
}

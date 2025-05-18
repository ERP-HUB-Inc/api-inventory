import { BaseEntity } from '@common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Expose } from 'class-transformer';
import { Product } from './product.entity';

@Entity('Category')
export class Category extends BaseEntity {
  @Column()
  @Expose()
  parentId: string;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  namekm: string;

  @Column()
  @Expose()
  namebm: string;

  @Column()
  @Expose()
  image: string;

  @Column()
  @Expose()
  description: string;

  @Column()
  @Expose()
  label: string;

  @Column({ type: 'boolean' })
  @Expose()
  isDefault: boolean;

  @Column()
  @Expose()
  isFeature: boolean;

  @OneToMany(() => Product, product => product.category)
  products: Product[];
}

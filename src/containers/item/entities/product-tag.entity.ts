import { Column, Entity, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { Product } from './product.entity';
import Tag from './tag.entity';

@Entity('ProductTag')
export class ProductTag extends BaseEntity {
  @OneToOne(() => Product)
  @JoinColumn()
  product: Product;

  @OneToOne(() => Tag)
  @JoinColumn()
  tag: Tag;

  @Column()
  tagId: string;

  @Column()
  productId: string;

  @ManyToOne(() => Tag, (tag: Tag) => tag.tagToProductTags)
  @JoinColumn({ name: 'tagId' })
  productTagToTag: Tag;

  @ManyToOne(() => Product, (product: Product) => product.productTagToProduct)
  @JoinColumn({ name: 'productId' })
  productToProductTag: Product;
}

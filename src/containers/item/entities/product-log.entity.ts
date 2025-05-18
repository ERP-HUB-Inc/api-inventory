import { 
  Column, 
  Entity, 
  ManyToOne, 
  OneToOne, 
  JoinColumn 
} from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { ProductVariant } from './product-variant.entity';
import { User } from './user.entity';

@Entity('ProductLog')
export class ProductLog extends BaseEntity {
  @Column()
  userId: string;

  @Column()
  productVariantId: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => ProductVariant, (productVariant) => productVariant.ProductLogs)
  productVariant: ProductVariant;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}

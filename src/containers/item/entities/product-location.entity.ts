import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { ProductVariant } from './product-variant.entity';
import { Location } from './location.entity';

@Entity('ProductLocation')
export class ProductLocation extends BaseEntity {
  @Column()
  locationId: string;

  @Column()
  clientId: string;

  @Column()
  productVariantId: string;

  @Column()
  quantity: number;

  @ManyToOne(() => Location, (location: Location) => location.productLocations)
  location: Location;

  @ManyToOne(() => ProductVariant, (productVariant) => productVariant.productLocations)
  productVariant: ProductVariant;
}

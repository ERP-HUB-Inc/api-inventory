import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ProductCondition')
export class ProductCondition {
  @PrimaryColumn()
  id: string;

  @Column()
  clientId: string;

  @Column()
  name: string;

  @Column()
  status: number;
}

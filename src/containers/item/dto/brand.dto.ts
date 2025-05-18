import { Expose } from 'class-transformer';

export class BrandDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  image: string;

  @Expose()
  label: string;

  @Expose()
  isDefault: boolean;

  @Expose()
  status: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

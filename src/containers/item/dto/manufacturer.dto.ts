import { Expose } from 'class-transformer';

export class ManufacturerCreateDto {
  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  address: string;

  @Expose()
  city: string;

  @Expose()
  state: string;

  @Expose()
  country: string;

  @Expose()
  postalCode: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  email: string;

  @Expose()
  website: string;

  @Expose()
  taxId: string;

  @Expose()
  businessLicense: string;

  @Expose()
  establishedDate: Date;
}

export class ManufacturerResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  address: string;

  @Expose()
  city: string;

  @Expose()
  state: string;

  @Expose()
  country: string;

  @Expose()
  postalCode: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  email: string;

  @Expose()
  website: string;

  @Expose()
  taxId: string;

  @Expose()
  businessLicense: string;

  @Expose()
  establishedDate: Date;

  @Expose()
  status: number;
}

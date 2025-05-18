import { Expose, Transform } from 'class-transformer';

export class ProductResponseDto {
  @Expose()
  id?: string;

  @Expose() categoryId: string;
  @Expose() brandId: string;
  @Expose() unitOfMeasurementId: string;
  @Expose() stockUnitId: string;
  @Expose() unitConversion: number;
  @Expose() defaultLocationId: string;
  @Expose() taxId: string;
  @Expose() supplierId: string;
  @Expose() preferredSupplierId: string;
  @Expose() manufacturerId: string;
  @Expose() supplierItemCode: string;
  @Expose() purchasePrice: number;
  @Expose() supplierPercentage: number;
  @Expose() conditionId: string;
  @Expose() name: string;
  @Expose() namekm: string;
  @Expose() namebm: string;
  @Expose() minPrice: number;
  @Expose() description: string;
  @Expose() specification: string;
  @Expose() highlightTag: string;
  @Expose() image: string;
  @Expose() videoUrl: string;
  @Expose() enableInventoryTracking: boolean;
  @Expose() serialType: number;
  @Expose() reorderPoint: number;
  @Expose() soldQuantity: number;
  @Expose() shippingFee: number;
  @Expose() tag: string;
  @Expose() isAvialableSale: boolean;
  @Expose() isPublic: boolean;
  @Expose() isSplittable: boolean;
  @Expose() enableDescription: boolean;
  @Expose() warrantyDuration: number;
  @Expose() warrantyDurationType: string;
  @Expose() isFeatured: boolean;
  @Expose() isAutoGenerateBarcode: number;
  @Expose() isAutoGenerateSKU: number;
  @Expose() type: number;
  @Expose() productOption: number;
  @Expose() status: number;
}

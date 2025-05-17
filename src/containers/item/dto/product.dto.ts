import { Expose } from 'class-transformer';

export class ProductDTO {
    @Expose() id?: string;

    // **General Information**
    @Expose() name: string;
    @Expose() namekm: string;
    @Expose() namebm: string;
    @Expose() description: string;
    @Expose() specification: string;
    @Expose() tags: Record<string, any[]>;
    @Expose() tag: string;
    @Expose() image: string;
    @Expose() barcode: string;
    @Expose() sku: string;

    // **Category & Condition**
    @Expose() categoryId: string;
    @Expose() brandId: string;
    @Expose() conditionId: string;
    @Expose() unitOfMeasurementId: string;
    @Expose() sellUnitId: string;
    @Expose() stockUnitId: string;
    @Expose() defaultLocationId: string;
    @Expose() unitConversion: number;
    @Expose() condition: Record<string, any>;
    @Expose() category: Record<string, any>;

    // **Supplier & Tax Information**
    @Expose() supplierId: string;
    @Expose() preferredSupplierId: string;
    @Expose() manufacturerId: string;
    @Expose() supplierItemCode: string;
    @Expose() supplierPercentage: number;
    @Expose() purchasePrice: number;
    @Expose() taxId: string;
    @Expose() tax: Record<string, any>;

    // **Pricing & Stock**
    @Expose() minPrice: number;
    @Expose() price: number;
    @Expose() wholePrice: number;
    @Expose() distributePrice: number;
    @Expose() factoryCost: number;
    @Expose() serialType: number;
    @Expose() reorderPoint: number;
    @Expose() soldQuantity: number;
    @Expose() shippingFee: number;

    // **Product Options & Features**
    @Expose() isAvialableSale: number;
    @Expose() isPublic: number;
    @Expose() isSplittable: boolean;
    @Expose() isFeatured: boolean;
    @Expose() enableDescription: boolean;
    @Expose() highlightTag: string;
    @Expose() warrantyDuration: number;
    @Expose() warrantyDurationType: string;
    @Expose() isAutoGenerateBarcode: number;
    @Expose() isAutoGenerateSKU: number;
    @Expose() type: number;
    @Expose() productOption: number;

    // **Relations**
    @Expose() unit: Record<string, any>;
    @Expose() productImages: Record<string, any>;
    @Expose() productTagToProduct: Record<string, any>;
    @Expose() productAttributes: Record<string, any>;
    @Expose() productVariants: Record<string, any>;
}
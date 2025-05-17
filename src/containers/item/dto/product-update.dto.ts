import { Expose } from 'class-transformer';

export class ProductUpdateDto {
    @Expose() id: string;
    
    // Identification and Relationships
    @Expose() categoryId: string;
    @Expose() clientId: string;
    @Expose() brandId: string;
    @Expose() unitOfMeasurementId: string;
    @Expose() sellUnitId: string;
    @Expose() stockUnitId: string;
    @Expose() unitConversion: number;
    @Expose() defaultLocationId: string;
    @Expose() taxId: string;
    @Expose() supplierId: string;
    @Expose() preferredSupplierId: string;
    @Expose() manufacturerId: string;
    @Expose() supplierItemCode: string;
    @Expose() supplierPercentage: number;
    @Expose() purchasePrice: number;
    @Expose() conditionId: string;

    // Metadata and Tags
    @Expose() tags: Record<string, any[]>;
    @Expose() name: string;
    @Expose() namekm: string;
    @Expose() namebm: string;
    @Expose() description: string;
    @Expose() specification: string;
    @Expose() highlightTag: string;

    // Media and Images
    @Expose() image: string;
    @Expose() videoUrl: string;

    // Inventory Management
    @Expose() enableInventoryTracking: boolean;
    @Expose() serialType: number;
    @Expose() reorderPoint: number;
    @Expose() shippingFee: number;

    // Status and Flags
    @Expose() isAvialableSale: number;
    @Expose() isPublic: number;
    @Expose() isSplittable: boolean;
    @Expose() isFeatured: boolean;
    @Expose() enableDescription: boolean;

    // Warranty Information
    @Expose() warrantyDuration: number;
    @Expose() warrantyDurationType: string;

    // Barcode and SKU
    @Expose() isAutoGenerateBarcode: number;
    @Expose() isAutoGenerateSKU: number;
    @Expose() barcode: string;
    @Expose() sku: string;

    // Product Type and Options
    @Expose() type: number;
    @Expose() productOption: number;

    // Tax and Variants
    @Expose() tax: Record<string, any>;
    @Expose() productVariants: Record<string, any>;

    // Pricing
    @Expose() price: number;
    @Expose() wholePrice: number;
    @Expose() distributePrice: number;
    @Expose() factoryCost: number;

    // Additional Attributes
    @Expose() tag: string;
}

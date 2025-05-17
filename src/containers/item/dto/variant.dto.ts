import { Expose, Transform } from "class-transformer";

export class VariantDto {
    @Expose()
    id: string;

    @Expose()
    clientId: string;

    @Expose()
    name: string;

    @Expose()
    image: string;

    @Expose()
    cost: number;

    @Expose()
    price: number;

    @Expose()
    wholePrice: number;

    @Expose()
    distributePrice: number;

    @Expose()
    quantity: number;

    @Expose()
    reorderPoint: number;

    @Expose()
    @Transform(({ value }) => (value === null ? 0 : value))
    factoryCost: number;

    @Expose()
    @Transform(({ value }) => (value === '' ? null : value))
    barcode: string;

    @Expose()
    @Transform(({ value }) => (value === 1 ? true : value === 0 ? false : value))
    isAutoGenerateBarcode: boolean;

    @Expose()
    sku: string;

    @Expose()
    @Transform(({ value }) => (value === 1 ? true : value === 0 ? false : value))
    isAutoGenerateSKU: boolean;

    @Expose()
    status: number;
}
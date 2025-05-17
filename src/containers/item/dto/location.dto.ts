import { Expose, Transform } from "class-transformer";

export class LocationCreateDto {
    @Expose()
    name: string;

    @Expose()
    code: string;

    @Expose()
    address: string;

    @Expose()
    isSystem: number;

    @Expose()
    isDefault: number;

    @Expose()
    receiptTemplateId: string;
}

export class LocationUpdateDto {
    @Expose()
    name: string;

    @Expose()
    code: string;

    @Expose()
    address: string;

    @Expose()
    isSystem: number;

    @Expose()
    isDefault: number;

    @Expose()
    receiptTemplateId: string;
}

export class LocationResponseDto {
    @Expose()
    name: string;

    @Expose()
    code: string;

    @Expose()
    address: string;

    @Expose()
    isSystem: number;

    @Expose()
    isDefault: number;

    @Expose()
    receiptTemplateId: string;
}
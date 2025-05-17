import { Expose } from "class-transformer";

export class VariantRequestDto {
    @Expose()
    productId: string;

    @Expose()
    search: string;

    @Expose()
    limit: any;

    @Expose()
    offset: any;
}
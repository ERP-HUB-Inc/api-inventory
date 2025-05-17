import { IsPositive, IsString } from "class-validator";

export class PaginationQuery {

    @IsPositive()
    limit: number = 15;

    @IsPositive()
    offset: number = 0;

    @IsString()
    sortField: string;

    @IsString()
    sortOrder: string;

    @IsString()
    locationId: string;

    @IsString()
    search: string;

    @IsString()
    filter: string;
}
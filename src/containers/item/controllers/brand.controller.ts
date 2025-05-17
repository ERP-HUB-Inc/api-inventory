import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Query,
    Body
} from '@nestjs/common';
import { Brand } from "@entities/item/index";
import { BrandService } from "@services/item/brand.service";
import { CurrentUser } from '@common/decorators';

@Controller("/brands")
export class BrandController {
    constructor(private readonly brandService: BrandService) {}

    /** Get single brand by ID */
    @Get("/:id")
    getBrandById(
        @CurrentUser() user:  any,
        @Param("id") brandId: string
    ) {
        return this.brandService.findOne(brandId);
    }

    /** Get paginated list of brands with sorting/filtering */
    @Get()
    listBrands(
        @CurrentUser() user:  any,
        @Query("limit") limit = 10,
        @Query("offset") offset = 0,
        @Query("sortField") sortField?: string,
        @Query("sortOrder") sortOrder?: "ASC"|"DESC",
        @Query("search") searchTerm?: string
    ) {
        const options = {
            limit,
            offset,
            sortField,
            sortOrder,
            clientId: user.clientId,
            search: searchTerm
        };
        return this.brandService.findAll();
    }

    /** Create new brand */
    @Post()
    createBrand(
        @CurrentUser() user:  any,
        @Body() newBrand: Brand
    ) {
        return this.brandService.create(newBrand);
    }

    /** Update existing brand */
    @Put("/:id")
    updateBrand(
        @CurrentUser() user:  any,
        @Param("id") brandId: string,
        @Body() brandUpdates: Brand
    ) {
        return this.brandService.update(brandId, brandUpdates);
    }

    /** Archive brand(s) - accepts comma-separated IDs */
    @Delete("/:ids")
    archiveBrands(
        @Param("ids") brandIds: string
    ) {
        return this.brandService.remove(brandIds);
    }
}
import { plainToInstance } from "class-transformer";
import Product from "../entities/Product";
import {
    ProductDTO,
    ProductUpdateDto,
    ProductCreateDTO
} from "../dto";
import ProductVariant from "../entities/ProductVariant";
import { VariantDto } from "../dto/VariantDto";

export function fromItemUpdateDtoToItem(dto: ProductUpdateDto): Product {
    return plainToInstance(Product, dto, { excludeExtraneousValues: true });
}

export function fromItemDtoToItem(dto: ProductDTO): Product {
    return plainToInstance(Product, dto, { excludeExtraneousValues: true });
}

export function fromItemUpdateDtoToItemDto(dto: ProductUpdateDto): ProductDTO {
    return plainToInstance(ProductDTO, dto, { excludeExtraneousValues: true });
}

export function fromItemCreateDtoToItemDto(dto: ProductCreateDTO): ProductDTO {
    return plainToInstance(ProductDTO, dto, { excludeExtraneousValues: true });
}

export function fromVariantDtoToVariant(dto: VariantDto): ProductVariant {
    return plainToInstance(ProductVariant, dto, { excludeExtraneousValues: true });
}
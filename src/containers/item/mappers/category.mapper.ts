import { plainToInstance } from "class-transformer";
import { 
    CategoryCreateDto, 
    CategoryResponseDto,
    CategoryUpdateDto
} from "../dto";
import Category from "../entities/Category";

export function fromCategoryUpdateDtoToCategory(dto: CategoryUpdateDto): Category {
    return plainToInstance(Category, dto, { excludeExtraneousValues: true })
}

export function fromCategoryCreateDtoToCategory(dto: CategoryCreateDto): Category {
    return plainToInstance(Category, dto, { excludeExtraneousValues: true })
}

export function fromCategoryToCategoryResponseDto(category: Category): CategoryResponseDto {
    return plainToInstance(CategoryResponseDto, category, { excludeExtraneousValues: true })
}

export function fromCategoryToCategoryResponsesDto(categories: Category[]): CategoryResponseDto[] {
    return plainToInstance(CategoryResponseDto, categories, { excludeExtraneousValues: true })
}
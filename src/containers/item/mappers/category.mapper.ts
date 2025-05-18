import {
  CategoryCreateDto,
  CategoryResponseDto,
  CategoryUpdateDto,
} from '../dto';

import { plainToInstance } from 'class-transformer';
import { Category } from '../entities';

// Mapping: Update DTO → Entity
export function fromCategoryUpdateDtoToCategory(dto: CategoryUpdateDto): Category {
  return plainToInstance(Category, dto, {
    excludeExtraneousValues: true,
  });
}

// Mapping: Create DTO → Entity
export function fromCategoryCreateDtoToCategory(dto: CategoryCreateDto): Category {
  return plainToInstance(Category, dto, {
    excludeExtraneousValues: true,
  });
}

// Mapping: Entity → Response DTO
export function fromCategoryToCategoryResponseDto(category: Category): CategoryResponseDto {
  return plainToInstance(CategoryResponseDto, category, {
    excludeExtraneousValues: true,
  });
}

// Mapping: Entity[] → Response DTO[]
export function fromCategoryToCategoryResponsesDto(categories: Category[]): CategoryResponseDto[] {
  return plainToInstance(CategoryResponseDto, categories, {
    excludeExtraneousValues: true,
  });
}

import { plainToInstance } from 'class-transformer';
import { ProductDTO, ProductUpdateDto, ProductCreateDTO, VariantDto } from '../dto';
import { Product } from '@item/entities/product.entity';
import { ProductVariant } from '@item/entities/product-variant.entity';

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
  return plainToInstance(ProductVariant, dto, {
    excludeExtraneousValues: true,
  });
}

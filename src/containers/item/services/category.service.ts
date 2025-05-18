import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CategoryRepository } from 'containers/item/repositories';
import { JoinOptions } from 'typeorm';
import { CategoryCreateDto, CategoryResponseDto } from '../dto';
import {
    fromCategoryCreateDtoToCategory,
    fromCategoryToCategoryResponseDto,
    fromCategoryToCategoryResponsesDto,
} from '../mappers';
import { FilterDto } from '@common/dto';

@Injectable()
export class CategoryService {
  constructor(private readonly repository: CategoryRepository) {}

  responses(
    datas: CategoryResponseDto[],
    total: number = datas.length,
    limit: number = 0,
    offset: number = 0,
  ) {
    return {
      data: datas,
      pagination: {
        total,
        offset,
        limit,
      },
    };
  }

  async findMany(filter: FilterDto) {
    const results = await this.repository.(filter);
    return this.responses(
      fromCategoryToCategoryResponsesDto(results[0]),
      results[1],
      filter.limit,
      filter.offset,
    );
  }

  async findOne(
    condition: Object,
    select?: string[],
    relations?: any,
    joinOptions?: JoinOptions,
  ) {
    const result = await this.repository.findOneByFieldName(
      condition,
      select,
      relations,
      joinOptions,
    );
    return fromCategoryToCategoryResponseDto(result);
  }

  async create(dto: CategoryCreateDto, columnCheckExist?: Object) {
    const category = fromCategoryCreateDtoToCategory(dto);
    const createdCategory = await this.repository.create(
      category,
      columnCheckExist,
    );

    return fromCategoryToCategoryResponseDto(createdCategory);
  }

  async update(data: Object, condition: Object) {
    return plainToInstance(
      CategoryResponseDto,
      await this.repository.update(data, condition),
    );
  }

  archive(data: string) {
    return this.repository.archive(data);
  }

  changeStatus(ids: string) {
    return this.repository.changeStatus(ids);
  }
}

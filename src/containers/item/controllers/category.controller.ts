import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CategoryService } from '@services/item/category.service';
import { PaginationQuery } from '@common/query/pagination.query';
import { Category } from '@item/entities/index';

@Controller('/categories')
export default class CategoryController {
  constructor(private service: CategoryService) {}

  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.service.findOne({ id });
  }

  @Get()
  findAll(@Query() query: PaginationQuery) {
    const option = {
      limit: query.limit,
      offset: query.offset,
      sortField: query.sortField,
      sortOrder: query.sortOrder,
      similar: query.search,
    };

    return this.service.findMany(option);
  }

  @Post()
  create(@Body() data: Category) {
    return this.service.create(data);
  }

  @Put('/:id')
  update(@Body() data: Category, @Param('id') id: string) {
    return this.service.update(data, { id });
  }

  @Delete('/:ids')
  delete(@Param('ids') ids: string) {
    return this.service.archive(ids);
  }
}

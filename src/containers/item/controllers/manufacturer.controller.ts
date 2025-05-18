import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  QueryParams,
} from 'routing-controllers';
import BaseController from '../../../core/common/controllers/BaseController';
import ManufacturerService from '../services/ManufacturerService';
import { ManufacturerCreateDto } from '../dto/ManufacturerDto';
import { Manufacturer } from '../entities';
import { PaginationQuery } from '../query';

@Controller('/manufacturers')
export default class ManufacturerController extends BaseController {
  constructor(private service: ManufacturerService) {
    super();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne({ id });
  }

  @Get()
  findAll(@QueryParams() query: PaginationQuery) {
    const options = {
      limit: query.limit,
      offset: query.offset,
      sortField: query.sortField,
      sortOrder: query.sortOrder,
      similar: query.search,
    };

    return this.service.findMany(options);
  }

  @Post()
  create(@Body({ validate: true }) data: ManufacturerCreateDto) {
    return this.service.create(data);
  }

  @Put('/:id')
  update(
    @Body({ validate: true }) data: Manufacturer,
    @Param('id') id: string,
  ) {
    return this.service.update(data, { id });
  }

  @Delete('/:ids')
  delete(@Param('ids') ids: string) {
    return this.service.archive(ids);
  }
}

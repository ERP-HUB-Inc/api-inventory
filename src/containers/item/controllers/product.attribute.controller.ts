import {
  Controller,
  Post,
  Authorized,
  CurrentUser,
  Get,
  Param,
  QueryParam,
  Body,
  Put,
  Delete,
} from 'routing-controllers';

import BaseController from '../../../core/common/controllers/BaseController';
import ProductAttributeService from '../services/ProductAttributeService';
import ProductAttribute from '../entities/ProductAttribute';
import User from '../../../core/setting/models/User';
import PrivilegePath from '../privileges';

@Controller('/inventory/product/attribute')
export default class ProductAttributeController extends BaseController {
  constructor(private service: ProductAttributeService) {
    super();
  }

  @Authorized()
  @Get('/v1/detail/:id')
  async getOne(@CurrentUser() user: User, @Param('id') id: string) {
    this.service.clientId = user.clientId;
    const condition = { id };
    const result = await this.service.findOne(condition);
    return result;
  }

  @Authorized()
  @Get('/v1/lists')
  async lists(
    @CurrentUser() user: User,
    @QueryParam('limit') limit: number,
    @QueryParam('offset') offset: number,
    @QueryParam('sortField') sortField: string,
    @QueryParam('sortOrder') sortOrder: string,
    @QueryParam('search') similar: string,
  ) {
    const filter = {
      limit,
      offset,
      sortField,
      sortOrder,
      clientId: user.clientId,
      similar,
    };
    const results = await this.service.findMany(filter);
    return results;
  }

  @Authorized()
  @Post('/v1/create')
  async create(
    @CurrentUser() user: User,
    @Body({ validate: true }) data: ProductAttribute,
  ) {
    this.service.deviceNumber = user.deviceNumber;
    data.clientId = user.clientId;
    const result = await this.service.create(data);
    return result;
  }

  @Authorized()
  @Put('/v1/update/:id')
  async update(
    @CurrentUser() user: User,
    @Body({ validate: true }) data: ProductAttribute,
    @Param('id') id: string,
  ) {
    this.service.clientId = user.clientId;
    const condition = { id };
    const result = await this.service.update(data, condition);
    return result;
  }

  @Authorized()
  @Delete('/v1/archive/:ids')
  async archive(@CurrentUser() user: User, @Param('ids') ids: string) {
    this.service.clientId = user.clientId;
    const result = await this.service.archive(ids);
    return result;
  }
}

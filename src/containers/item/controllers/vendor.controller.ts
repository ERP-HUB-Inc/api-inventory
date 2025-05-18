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
import {
  toAdvanceFilterArr,
  AdvanceFilter,
} from '../../../core/common/filters';
import BaseController from '../../../core/common/controllers/BaseController';
import SupplierService from '../services/SupplierService';
import User from '../../../core/setting/models/User';
import Supplier from '../entities/Supplier';

@Controller('/vendors')
export default class VendorController extends BaseController {
  constructor(private service: SupplierService) {
    super();
  }

  @Get('/:id')
  async getOne(@CurrentUser() user: User, @Param('id') id: string) {
    this.service.clientId = user.clientId;
    return await this.service.findOne({ id });
  }

  @Get()
  async get(
    @CurrentUser() user: User,
    @QueryParam('limit') limit: number,
    @QueryParam('offset') offset: number,
    @QueryParam('sortField') sortField: string,
    @QueryParam('sortOrder') sortOrder: string,
    @QueryParam('filter') filter: string,
    @QueryParam('search') similar: string,
  ) {
    const option = {
      limit,
      offset,
      sortField,
      sortOrder,
      clientId: user.clientId,
      similar,
      advanceFilter: toAdvanceFilterArr<AdvanceFilter>(filter),
    };
    return await this.service.findMany(option);
  }

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body({ validate: true }) data: Supplier,
  ) {
    data.clientId = user.clientId;
    return await this.service.create(data);
  }

  @Put('/:id')
  async update(
    @CurrentUser() user: User,
    @Body({ validate: true }) data: Supplier,
    @Param('id') id: string,
  ) {
    this.service.clientId = user.clientId;
    const condition = { id };
    return await this.service.update(data, condition);
  }

  @Delete('/:ids')
  async archive(@CurrentUser() user: User, @Param('ids') ids: string) {
    this.service.clientId = user.clientId;
    return await this.service.archive(ids);
  }
}

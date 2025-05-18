import {
  Controller,
  Post,
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
import StockCountService from '../services/StockCountService';
import User from '../../../core/setting/models/User';
import { StockCount } from '../entities';

@Controller('/stock-counts')
export class StockCountController {
  constructor(private service: StockCountService) {}

  @Get('/:id')
  getOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.getStockCountById(user, id);
  }

  @Get()
  async lists(
    @CurrentUser() user: User,
    @QueryParam('limit') limit: number,
    @QueryParam('offset') offset: number,
    @QueryParam('sortField') sortField: string,
    @QueryParam('sortOrder') sortOrder: string,
    @QueryParam('filter') filter: string,
    @QueryParam('rangFilter') rangFilter: string,
    @QueryParam('search') similar: string,
  ) {
    const pagination = {
      limit,
      offset,
      sortField,
      sortOrder,
      clientId: user.clientId,
      locationId: user.locationId,
      similar,
      rangFilter,
      advanceFilter: toAdvanceFilterArr<AdvanceFilter>(filter),
    };

    return await this.service.getStockCounts(pagination);
  }

  @Get('/status/:id')
  async getStockCountEntriesByStatus(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @QueryParam('limit') limit: number,
    @QueryParam('offset') offset: number,
    @QueryParam('status') status: 'counted' | 'uncounted',
    @QueryParam('type') countType: string,
    @QueryParam('locationId') locationId: string,
  ) {
    user.locationId = locationId;
    return await this.service.getStockCountEntriesByStatus(
      user,
      id,
      limit,
      offset,
      status,
      countType,
    );
  }

  @Post()
  async create(
    @CurrentUser() user: User,
    @Body({ validate: true }) data: StockCount,
  ) {
    return await this.service.createNewStockCount(user, data);
  }

  @Put('/:id')
  async update(
    @CurrentUser() user: User,
    @Body({ validate: true }) data: StockCount,
    @Param('id') id: string,
  ) {
    return await this.service.updateStockCountById(user, data, id);
  }

  @Put('/mark_as_completed/:id')
  async markAsCompleted(@CurrentUser() user: User, @Param('id') id: string) {
    return await this.service.markAsCompleted(user, id);
  }

  @Delete('/:id')
  async discardStockCount(@CurrentUser() user: User, @Param('id') id: string) {
    return await this.service.discardStockCount(user, id);
  }
}

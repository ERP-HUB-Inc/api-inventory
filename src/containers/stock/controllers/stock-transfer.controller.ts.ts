import {
  Controller,
  Post,
  CurrentUser,
  Get,
  Param,
  QueryParam,
  Body,
  Put,
} from 'routing-controllers';
import {
  toAdvanceFilterArr,
  AdvanceFilter,
} from '../../../core/common/filters';
import StockTransferService from '../services/StockTransferService';
import { UserStatus } from '../../../core/setting/enums';
import User from '../../../core/setting/models/User';
import { StockTransfer } from '../entities';

@Controller('/stock-transfers')
export default class StockTransferController {
  constructor(private service: StockTransferService) {}

  /**
   * Get stock transfer detail by ID
   * @param user Authenticated user
   * @param languageId Language identifier
   * @param id Stock transfer ID
   */
  @Get(':id')
  findById(
    @CurrentUser() user: User,
    @QueryParam('languageId') languageId: string,
    @Param('id') id: string,
  ) {
    return this.service.detail(id, languageId);
  }

  /**
   * Get paginated list of stock transfers
   */
  @Get()
  findAll(
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
      isFullAccess: user.isFullAccess === UserStatus.IsFullAccess,
      similar,
      rangFilter,
      advanceFilter: toAdvanceFilterArr<AdvanceFilter>(filter),
    };

    return this.service.findMany(pagination);
  }

  /**
   * Get list of stock transfers to be received
   */
  @Get('received')
  findReceived(
    @CurrentUser() user: User,
    @QueryParam('limit') limit: number,
    @QueryParam('offset') offset: number,
    @QueryParam('sortField') sortField: string,
    @QueryParam('sortOrder') sortOrder: string,
    @QueryParam('filter') filter: string,
    @QueryParam('rangFilter') rangFilter: string,
    @QueryParam('search') similar: string,
  ) {
    const option = {
      limit,
      offset,
      sortField,
      sortOrder,
      locationId: user.locationId,
      similar,
      rangFilter,
      advanceFilter: toAdvanceFilterArr<AdvanceFilter>(filter),
    };

    return this.service.findManyOfReceiveList(option);
  }

  /**
   * Create a new stock transfer
   */
  @Post()
  create(
    @CurrentUser() user: User,
    @Body({ validate: true }) data: StockTransfer,
  ) {
    data.userId = user.id;
    return this.service.create(data);
  }

  /**
   * Update a stock transfer by ID
   */
  @Put(':id')
  update(
    @CurrentUser() user: User,
    @Body({ validate: true }) data: StockTransfer,
    @Param('id') id: string,
  ) {
    data.userId = user.id;
    return this.service.update(data, { id });
  }

  /**
   * Update a stock transfer by ID
   */
  @Put(':id/approve')
  markAsApproved(
    @CurrentUser() user: User,
    @Body({ validate: true }) data: StockTransfer,
    @Param('id') id: string,
  ) {
    data.userId = user.id;
    return this.service.update(data, { id });
  }

  /**
   * Cancel a stock transfer by ID
   */
  @Put(':id/cancel')
  markAsCancelled(
    @CurrentUser() user: User,
    @Body({ validate: true }) data: StockTransfer,
    @Param('id') id: string,
  ) {
    return this.service.cancelStockTransfer({ id });
  }
}

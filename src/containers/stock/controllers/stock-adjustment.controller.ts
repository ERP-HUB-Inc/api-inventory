import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Res,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { StockAdjustment } from '../entities';
import { PaginationQuery } from '@common/query/pagination.query';
import StockAdjustmentService from '../services/stock-adjustment.service';
import { User } from '@item/entities/user.entity';
import { AdvanceFilterDto, toAdvanceFilterArr } from '@common/dto';
import { CurrentUser } from '@common/decorators';

@Controller('/stock-adjustments')
export class StockAdjustmentController {
  constructor(private readonly service: StockAdjustmentService) {}

  /**
   * Get a single stock adjustment by its ID
   * Only accessible by authenticated user
   * @param user Current logged-in user
   * @param id StockAdjustment ID
   */
  @Get('/:id')
  getById(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.detail(id);
  }

  /**
   * Get paginated list of stock adjustments
   * Supports sorting, filtering, and full-access location filtering
   * @param user Current user object
   * @param limit Pagination limit
   * @param offset Pagination offset
   * @param sortField Field to sort by
   * @param sortOrder Sorting order (ASC/DESC)
   * @param filter JSON string of advanced filters
   * @param rangFilter JSON string for range-based filtering
   * @param search Search keyword (for similar match)
   */
  @Get()
  getList(@CurrentUser() user: User, @Query() query: PaginationQuery) {
    const options = {
      limit: query.limit,
      offset: query.offset,
      sortField: query.sortField,
      sortOrder: query.sortOrder,
      locationId: user.locationId,
      similar: query.search,
      rangFilter: query.rangFilter,
      advanceFilter: toAdvanceFilterArr<AdvanceFilterDto>(query.filter),
    };

    return this.service.findMany(options);
  }

  /**
   * Get list of stock adjustments that are pending approval
   * Used by approvers to review and approve entries
   * @param user Current user
   * @param limit Pagination limit
   * @param offset Pagination offset
   * @param sortField Field to sort by
   * @param sortOrder Sorting order (ASC/DESC)
   * @param filter Advanced filter as JSON string
   * @param rangFilter Range filter as JSON string
   * @param search Search keyword
   */
  @Get('/lists/approve')
  getApprovalList(
    @CurrentUser() user: User,
    @Query() query: PaginationQuery,
  ) {
    const options = {
      limit: query.limit,
      offset: query.offset,
      sortField: query.sortField,
      sortOrder: query.sortOrder,
      locationId: user.locationId,
      similar: query.search,
      rangFilter: query.rangFilter,
      advanceFilter: toAdvanceFilterArr<AdvanceFilterDto>(query.filter),
    };

    return this.service.findManyOfApproveList(options);
  }

  /**
   * Create a new stock adjustment record
   * The current user is set as the creator (userId)
   * @param user Current user
   * @param payload StockAdjustment data payload
   */
  @Post()
  createStockAdjustment(
    @CurrentUser() user: User,
    @Res() response: Response,
    @Body() payload: StockAdjustment,
  ) {
    payload.userId = user.id;
    this.service.create(payload);
    return response.sendStatus(201).end();
  }

  /**
   * Update an existing stock adjustment record
   * Sets current user ID as the updater
   * @param user Current user
   * @param payload StockAdjustment updated data
   * @param id StockAdjustment ID
   */
  @Put('/:id')
  updateStockAdjustment(
    @CurrentUser() user: User,
    @Body() payload: StockAdjustment,
    @Param('id') id: string,
  ) {
    payload.userId = user.id;
    return this.service.update(payload, { id });
  }

  /**
   * Approve a stock adjustment entry
   * This is typically done by a supervisor or admin
   * @param user Current user
   * @param payload Approval-related data
   * @param id StockAdjustment ID
   */
  @Put('/approve/:id')
  approveStockAdjustment(
    @CurrentUser() user: User,
    @Body() payload: StockAdjustment,
    @Param('id') id: string,
  ) {
    payload.userId = user.id;
    return this.service.approve(payload, { id });
  }

  /**
   * Archive one or more stock adjustment entries by their IDs
   * Accepts comma-separated list of IDs
   * @param user Current user
   * @param ids Comma-separated string of IDs
   */
  @Delete('/:ids')
  deleteStockAdjustments(@CurrentUser() user: User, @Param('ids') ids: string) {
    return this.service.archive(ids);
  }
}

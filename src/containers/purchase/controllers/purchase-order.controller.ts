import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Query,
    Body,
    Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AdvanceFilter, toAdvanceFilterArr } from '../../../core/common/filters';
import PurchaseOrderService from '../services/PurchaseOrderService';
  
  @Controller('purchase-orders')
  export class PurchaseOrderController {
    constructor(private readonly service: PurchaseOrderService) {}
  
    /**
     * Retrieve a single purchase order by its ID.
     *
     * @param id - The unique identifier of the purchase order.
     * @returns The purchase order details.
     */
    @Get(':id')
    findById(@Param('id') id: string) {
      return this.service.detail(id);
    }
  
    /**
     * Retrieve a list of purchase orders with optional filtering, sorting,
     * pagination, and search capabilities.
     *
     * @param limit - Maximum number of records to return.
     * @param offset - Number of records to skip.
     * @param sortField - Field to sort by.
     * @param sortOrder - Sort direction, e.g., ASC or DESC.
     * @param filter - JSON string representing advanced filters.
     * @param rangFilter - Range filter parameter.
     * @param search - Search string to match purchase orders.
     * @returns A list of purchase orders matching the criteria.
     */
    @Get()
    findAll(
      @Query('limit') limit: number,
      @Query('offset') offset: number,
      @Query('sortField') sortField: string,
      @Query('sortOrder') sortOrder: string,
      @Query('filter') filter: string,
      @Query('rangFilter') rangFilter: string,
      @Query('search') search: string
    ) {
      const options = {
        limit,
        offset,
        sortField,
        sortOrder,
        similar: search,
        rangFilter,
        advanceFilter: toAdvanceFilterArr<AdvanceFilter>(filter),
      };
      return this.service.findMany(options);
    }

    /**
     * Retrieve a list of paid purchase orders with optional filtering, sorting,
     * pagination, and search capabilities.
     *
     * @param limit - Maximum number of records to return.
     * @param offset - Number of records to skip.
     * @param sortField - Field to sort by.
     * @param sortOrder - Sort direction, e.g., ASC or DESC.
     * @param filter - JSON string representing advanced filters.
     * @param rangFilter - Range filter parameter.
     * @param search - Search string to match purchase orders.
     * @returns A list of paid purchase orders matching the criteria.
     */
    @Get('paid')
    findPaid(
        @Query('limit') limit: number,
        @Query('offset') offset: number,
        @Query('sortField') sortField: string,
        @Query('sortOrder') sortOrder: string,
        @Query('filter') filter: string,
        @Query('rangFilter') rangFilter: string,
        @Query('search') search: string
    ) {
        const options = {
            limit,
            offset,
            sortField,
            sortOrder,
            similar: search,
            rangFilter,
            advanceFilter: toAdvanceFilterArr<AdvanceFilter>(filter),
            status: 'paid',  // filter by paid status
        };
        return this.service.findMany(options);
    }

    /**
     * Retrieve a list of received purchase orders with optional filtering, sorting,
     * pagination, and search capabilities.
     *
     * @param limit - Maximum number of records to return.
     * @param offset - Number of records to skip.
     * @param sortField - Field to sort by.
     * @param sortOrder - Sort direction, e.g., ASC or DESC.
     * @param filter - JSON string representing advanced filters.
     * @param rangFilter - Range filter parameter.
     * @param search - Search string to match purchase orders.
     * @returns A list of received purchase orders matching the criteria.
     */
    @Get('received')
    findReceived(
        @Query('limit') limit: number,
        @Query('offset') offset: number,
        @Query('sortField') sortField: string,
        @Query('sortOrder') sortOrder: string,
        @Query('filter') filter: string,
        @Query('rangFilter') rangFilter: string,
        @Query('search') search: string
    ) {
        const options = {
            limit,
            offset,
            sortField,
            sortOrder,
            similar: search,
            rangFilter,
            advanceFilter: toAdvanceFilterArr<AdvanceFilter>(filter),
            status: 'received',  // filter by received status
        };
        return this.service.findMany(options);
    }

    /**
     * Retrieve a list of returned purchase orders with optional filtering, sorting,
     * pagination, and search capabilities.
     *
     * @param limit - Maximum number of records to return.
     * @param offset - Number of records to skip.
     * @param sortField - Field to sort by.
     * @param sortOrder - Sort direction, e.g., ASC or DESC.
     * @param filter - JSON string representing advanced filters.
     * @param rangFilter - Range filter parameter.
     * @param search - Search string to match purchase orders.
     * @returns A list of returned purchase orders matching the criteria.
     */
    @Get('returned')
    findReturned(
        @Query('limit') limit: number,
        @Query('offset') offset: number,
        @Query('sortField') sortField: string,
        @Query('sortOrder') sortOrder: string,
        @Query('filter') filter: string,
        @Query('rangFilter') rangFilter: string,
        @Query('search') search: string
    ) {
        const options = {
            limit,
            offset,
            sortField,
            sortOrder,
            similar: search,
            rangFilter,
            advanceFilter: toAdvanceFilterArr<AdvanceFilter>(filter),
            status: 'returned',  // filter by returned status
        };
        return this.service.findMany(options);
    }
  
    /**
     * Create a new purchase order.
     *
     * @param req - Express request object, containing the authenticated user.
     * @param data - Purchase order data to create.
     * @returns The newly created purchase order.
     */
    @Post()
    create(@Req() req: Request, @Body() data: PurchaseOrder) {
      const user = req.user as any;
      data.userId = user.id;
      return this.service.create(data);
    }
  
    /**
     * Update an existing purchase order by its ID.
     *
     * @param req - Express request object, containing the authenticated user.
     * @param id - The unique identifier of the purchase order to update.
     * @param data - Updated purchase order data.
     * @returns The updated purchase order.
     */
    @Put(':id')
    update(@Req() req: Request, @Param('id') id: string, @Body() data: PurchaseOrder) {
      const user = req.user as any;
      data.userId = user.id;
      return this.service.update(data, { id });
    }
  
    /**
     * Mark a purchase order as received.
     *
     * @param id - The unique identifier of the purchase order.
     * @returns The updated purchase order after marking as received.
     */
    @Put(':id/receive')
    markAsReceived(@Param('id') id: string) {
      return this.service.markAsReceived(id);
    }
  
    /**
     * Mark a purchase order as returned.
     *
     * @param id - The unique identifier of the purchase order.
     * @returns The updated purchase order after marking as returned.
     */
    @Put(':id/return')
    markAsReturned(@Param('id') id: string) {
      return this.service.markAsReturned(id);
    }
  
    /**
     * Mark a purchase order as paid.
     *
     * @param id - The unique identifier of the purchase order.
     * @returns The updated purchase order after marking as paid.
     */
    @Put(':id/pay')
    markAsPaid(@Param('id') id: string) {
      return this.service.markAsPaid(id);
    }
  
    /**
     * Archive one or more purchase orders by their IDs.
     *
     * @param ids - Comma-separated list of purchase order IDs to archive.
     * @returns Confirmation of archived purchase orders.
     */
    @Delete(':ids')
    archive(@Param('ids') ids: string) {
      return this.service.archive(ids);
    }
  
    /**
     * Check if a purchase order number already exists.
     *
     * @param number - The purchase order number to check.
     * @returns Boolean indicating if the number is already taken.
     */
    @Get('/check/number/:number')
    checkPONumber(@Param('number') number: string) {
      return this.service.checkPONumber(number);
    }
}
  
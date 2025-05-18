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
  QueryParams,
  Res,
} from 'routing-controllers';
import {
  toAdvanceFilterArr,
  AdvanceFilter,
} from '../../../core/common/filters';
import BaseController from '../../../core/common/controllers/BaseController';
import ProductVariantService from '../services/ProductVariantService';
import ProductVariant from '../entities/ProductVariant';
import User from '../../../core/setting/models/User';
import ProductService from '../services/ItemService';
import { PaginationQuery } from '../query';
import { VariantRequestDto } from '../dto';
import { Response } from 'express';

@Controller('/variants')
export default class ProductVariantController extends BaseController {
  constructor(
    private service: ProductVariantService,
    private itemService: ProductService,
  ) {
    super();
  }

  @Get('/:id')
  getOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.findOne({ id });
  }

  @Get('/attribitevalue/:attribiteValueId')
  getByAttributeValue(
    @CurrentUser() user: User,
    @Param('attribiteValueId') productAttributeValueId: string,
  ) {
    return this.service.findOne({ productAttributeValueId }, null, [
      'productLocations',
    ]);
  }

  @Get('/productvariant/:barcode')
  getByBarcode(@CurrentUser() user: User, @Param('barcode') barcode: string) {
    return this.service.findOne({ barcode }, null, ['productLocations']);
  }

  @Get('/:itemId/items')
  getVariantsOfItem(
    @QueryParams() query: PaginationQuery,
    @Param('itemId') itemId: string,
  ) {
    const dto: VariantRequestDto = new VariantRequestDto();
    dto.productId = itemId;
    dto.search = query.search;
    dto.limit = query.limit;
    dto.offset = query.offset;
    return this.itemService.getVariantsByItemId(dto);
  }

  @Get('/detail-with-location/:id')
  getDetailWithLocation(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @QueryParam('locationId') locationId: string,
  ) {
    return this.service.getDetailWithLocation(user.clientId, id, locationId);
  }

  @Get()
  findAll(
    @CurrentUser() user: User,
    @QueryParam('limit') limit: number,
    @QueryParam('offset') offset: number,
    @QueryParam('sortField') sortField: string,
    @QueryParam('sortOrder') sortOrder: string,
    @QueryParam('locationId') locationId: string,
    @QueryParam('filter') filter: string,
    @QueryParam('search') similar: string,
  ) {
    const option = {
      limit,
      offset,
      sortField,
      sortOrder,
      locationId,
      similar,
      advanceFilter: toAdvanceFilterArr<AdvanceFilter>(filter),
    };

    return this.service.findMany(option);
  }

  @Post()
  create(@Body({ validate: true }) data: ProductVariant) {
    return this.service.create(data);
  }

  @Put('/:id')
  update(
    @Body({ validate: true }) data: ProductVariant,
    @Param('id') id: string,
  ) {
    return this.service.update(data, { id });
  }

  @Delete('/:ids')
  archive(@Param('ids') ids: string) {
    return this.service.archive(ids);
  }

  @Get('/archive/:id/availability')
  async checkIsAvailableForArchive(
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    return response.send({
      status: await this.service.checkDeleteAvailability(id),
    });
  }

  @Get('/attributevalue/check/status')
  checkIsAvailableArchiveAttributeValue(
    @QueryParam('attributeValueId') attributeValueId: string,
  ) {
    return this.service.checkIsAvailableForArchiveAttributeValue(
      attributeValueId,
    );
  }

  @Get('/attribute/check/status')
  checkIsAvailableArchiveAttribute(
    @QueryParam('attributeId') attributeId: string,
  ) {
    return this.service.checkIsAvailableForArchiveAttribute(attributeId);
  }
}

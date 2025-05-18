import {
  Authorized,
  Body,
  Controller,
  CurrentUser,
  Delete,
  Get,
  Param,
  Post,
  Put,
  QueryParam,
} from 'routing-controllers';
import {
  AdvanceFilter,
  toAdvanceFilterArr,
} from '../../../core/common/filters';
import BaseController from '../../../core/common/controllers/BaseController';
import PromotionService from '../services/PromotionService';
import User from '../../../core/setting/models/User';
import Promotion from '../entities/Promotion';

@Controller('/promotion')
export default class PromotionController extends BaseController {
  constructor(private service: PromotionService) {
    super();
  }

  @Get('/:id')
  async getOne(@CurrentUser() user: User, @Param('id') id: string) {
    return await this.service.getPromotionById(user, id);
  }

  @Get()
  async lists(
    @CurrentUser() user: User,
    @QueryParam('limit') limit: number,
    @QueryParam('offset') offset: number,
    @QueryParam('sortField') sortField: string,
    @QueryParam('sortOrder') sortOrder: string,
    @QueryParam('filter') filter: string,
    @QueryParam('search') similar: string,
  ) {
    const pagination = {
      limit,
      offset,
      sortField,
      sortOrder,
      clientId: user.clientId,
      advanceFilter: toAdvanceFilterArr<AdvanceFilter>(filter),
      similar,
    };

    return await this.service.getPromotions(pagination);
  }

  @Post()
  async create(@CurrentUser() user: User, @Body() data: Promotion) {
    data.clientId = user.clientId;
    return await this.service.createNewPromotion(data);
  }

  @Put('/:id')
  async update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() data: Promotion,
  ) {
    data.clientId = user.clientId;
    return await this.service.updatePromotion(id, data);
  }

  @Delete('/:ids')
  async archive(@CurrentUser() user: User, @Param('ids') ids: string) {
    return await this.service.deletePromotion(ids, user.clientId);
  }
}

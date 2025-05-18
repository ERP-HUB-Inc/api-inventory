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
import AttributeService from '../services/AttributeService';
import User from '../../../core/setting/models/User';
import Attribute from '../entities/Attribute';

@Controller('/options')
export default class OptionController extends BaseController {
  constructor(private service: AttributeService) {
    super();
  }

  @Get('/:id')
  getOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.findOne({ id, clientId: user.clientId });
  }

  @Get()
  lists(
    @CurrentUser() user: User,
    @QueryParam('limit') limit: number,
    @QueryParam('offset') offset: number,
    @QueryParam('sortField') sortField: string,
    @QueryParam('sortOrder') sortOrder: string,
    @QueryParam('search') similar: string,
  ) {
    const option = {
      limit,
      offset,
      sortField,
      sortOrder,
      clientId: user.clientId,
      similar,
    };

    return this.service.findMany(option);
  }

  @Post()
  create(@CurrentUser() user: User, @Body({ validate: true }) data: Attribute) {
    data.clientId = user.clientId;
    return this.service.create(data);
  }

  @Put('/:id')
  update(
    @CurrentUser() user: User,
    @Body({ validate: true }) data: Attribute,
    @Param('id') id: string,
  ) {
    this.service.clientId = user.clientId;
    data.clientId = user.clientId;
    return this.service.update(data, { id });
  }

  @Delete('/:ids')
  archive(@CurrentUser() user: User, @Param('ids') ids: string) {
    this.service.clientId = user.clientId;
    return this.service.archive(ids);
  }
}

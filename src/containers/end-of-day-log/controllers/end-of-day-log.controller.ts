import {
  Controller,
  CurrentUser,
  Get,
  Param,
  QueryParam,
} from 'routing-controllers';

import EODLogService from '../services/EODLogService';
import User from '../../../core/setting/models/User';

@Controller('/eod-log')
export class EODLogController {
  constructor(private service: EODLogService) {}

  @Get(':id')
  async getOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.findOne({ id });
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
}

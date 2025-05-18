import { CurrentUser } from '@common/decorators';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';
import { Brand } from '@item/entities/index';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { BrandService } from '@services/item/brand.service';
import { BrandDto } from 'containers/item/dto';

@Controller('/brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  /** Get single brand by ID */
  @Get('/:id')
  findById(@CurrentUser() user: any, @Param('id') brandId: string) {
    return this.brandService.findOne(brandId);
  }

  /** Get paginated list of brands with sorting/filtering */
  @UseInterceptors(new TransformInterceptor(BrandDto))
  @Get()
  findAll(
    @CurrentUser() user: any,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
    @Query('sortField') sortField?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('search') searchTerm?: string,
  ) {
    const options = {
      limit,
      offset,
      sortField,
      sortOrder,
      clientId: user.clientId,
      search: searchTerm,
    };
    return this.brandService.findAll();
  }

  /** Create new brand */
  @Post()
  create(@CurrentUser() user: any, @Body() newBrand: Brand) {
    return this.brandService.create(newBrand);
  }

  /** Update existing brand */
  @Put('/:id')
  update(
    @CurrentUser() user: any,
    @Param('id') brandId: string,
    @Body() brandUpdates: Brand,
  ) {
    return this.brandService.update(brandId, brandUpdates);
  }

  /** Archive brand(s) - accepts comma-separated IDs */
  @Delete('/:ids')
  delete(@Param('ids') brandIds: string) {
    return this.brandService.remove(brandIds);
  }
}

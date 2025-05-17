import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    Put,
    Delete,
    QueryParams
} from "routing-controllers";
import Category from "../entities/Category";
import CategoryService from "../services/CategoryService";
import BaseController from "../../../core/common/controllers/BaseController";
import { PaginationQuery } from "../query";

@Controller("/categories")
export default class CategoryController extends BaseController {
    constructor(private service: CategoryService) {
        super();
    }

    @Get("/:id")
    getOne(
        @Param("id") id: string
    ) {
        return this.service.findOne({ id });
    }

    @Get()
    findAll(
        @QueryParams() query: PaginationQuery
    ) {
        const option = {
            limit: query.limit,
            offset: query.offset,
            sortField: query.sortField,
            sortOrder: query.sortOrder,
            similar: query.search
        };

        return this.service.findMany(option);
    }

    @Post()
    create(
        @Body({ validate: true }) data: Category
    ) {
        return this.service.create(data);
    }

    @Put("/:id")
    update(
        @Body({ validate: true }) data: Category,
        @Param("id") id: string
    ) {
        return this.service.update(data, {id});
    }

    @Delete("/:ids")
    archive(
        @Param("ids") ids: string
    ) {
        return this.service.archive(ids);
    }
}
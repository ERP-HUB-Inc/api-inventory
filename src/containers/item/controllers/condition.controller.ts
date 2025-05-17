import {
    Controller,
    Post,
    CurrentUser,
    Get,
    Param,
    QueryParam,
    Body,
    Put,
    Delete
} from "routing-controllers";
import Condition from "../entities/Condition";
import ConditionService from "../services/ConditionService";
import BaseController from "../../../core/common/controllers/BaseController";
import User from "../../../core/setting/models/User";

@Controller("/conditions")
export default class ConditionController extends BaseController {
    constructor(private service: ConditionService) {
        super();
    }

    @Get("/:id")
    async getOne(
        @CurrentUser() user: User,
        @Param("id") id: string
    ) {
        this.service.clientId = user.clientId;
        return await this.service.findOne({id});
    }

    @Get()
    lists(
        @CurrentUser() user: User,
        @QueryParam("limit") limit: number,
        @QueryParam("offset") offset: number,
        @QueryParam("sortField") sortField: string,
        @QueryParam("sortOrder") sortOrder: string,
        @QueryParam("search") similar: string
    ) {
        const option = {
            limit,
            offset,
            sortField,
            sortOrder,
            clientId: user.clientId,
            similar
        };
        return this.service.findMany(option);
    }

    @Post()
    create(
        @CurrentUser() user: User,
        @Body({ validate: true }) data: Condition
    ) {
        data.clientId = user.clientId;
        return this.service.create(data);
    }

    @Put("/:id")
    update(
        @CurrentUser() user: User,
        @Body({ validate: true }) data: Condition,
        @Param("id") id: string
    ) {
        return this.service.update(data, {id});
    }

    @Delete("/:ids")
    archive(
        @CurrentUser() user: User,
        @Param("ids") ids: string
    ) {
        this.service.clientId = user.clientId;
        return this.service.archive(ids);
    }
}
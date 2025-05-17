import {
    Post,
    CurrentUser,
    Controller,
    Body,
    Get,
    QueryParam,
    Param,
    Delete,
    Put
} from "routing-controllers";
import BaseControlelr from "../../../core/common/controllers/BaseController";
import User from "../../../core/setting/models/User";
import {
    AdvanceFilter,
    toAdvanceFilterArr
} from "../../../core/common/filters";
import Unit from "../entities/Unit";
import UnitService from "../services/UnitService";

@Controller("/units")
export default class UnitController extends BaseControlelr {
    constructor(private service: UnitService) {
        super();
    }

    @Get("/:id")
    getOne(
        @CurrentUser() user: User,
        @Param("id") id: string
    ) {
        this.service.clientId = user.clientId;
        return this.service.findOne({id});
    }

    @Get()
    lists(
        @CurrentUser() user: User,
        @QueryParam("limit") limit: number,
        @QueryParam("offset") offset: number,
        @QueryParam("sortField") sortField: string,
        @QueryParam("sortOrder") sortOrder: string,
        @QueryParam("filter") filter: string,
        @QueryParam("search") similar: string
    ) {
        const option = {
            limit,
            offset,
            sortField,
            sortOrder,
            clientId: user.clientId,
            similar,
            advanceFilter: toAdvanceFilterArr<AdvanceFilter>(filter)
        };

        return this.service.findMany(option);
    }

    @Post()
    create(
        @CurrentUser() user: User,
        @Body({validate: true}) data: Unit
    ) {
        data.clientId = user.clientId;
        return this.service.create(data);
    }

    @Put("/:id")
    update(
        @CurrentUser() user: User,
        @Body({validate: true}) data: Unit,
        @Param("id") id: string
    ) {
        this.service.clientId = user.clientId;
        return this.service.update(data, {id});
    }

    @Delete("/:ids")
    archive(
        @CurrentUser() user: User,
        @Param("ids") ids: string
    ) {
        return this.service.deleteById(ids, user.clientId);
    }
}
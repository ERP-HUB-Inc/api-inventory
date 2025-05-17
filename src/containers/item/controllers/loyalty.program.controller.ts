import {
    Controller,
    Post,
    CurrentUser,
    Get,
    Param,
    Res,
    Body,
    Put,
    Delete,
    QueryParam
} from "routing-controllers";
import LoyaltyProgram from "../entities/LoyaltyProgram";
import LoyaltyProgramRepository from "../repositories/LoyaltyProgramRepository";
import BaseController from "../../../core/common/controllers/BaseController";
import User from "../../../core/setting/models/User";
import Filter, { AdvanceFilter, toAdvanceFilterArr } from "../../../core/common/filters";

@Controller("/loyalty_programs")
export default class LoyaltyProgramController extends BaseController {
    constructor(private repository: LoyaltyProgramRepository) {
        super();
    }

    @Get("/:id")
    async getOne(
        @CurrentUser() user: User,
        @Param("id") id: string
    ) {
        return await this.repository.getLoyaltyProgramById(user, id);
    }

    @Get()
    async lists(
        @CurrentUser() user: User,
        @QueryParam("limit") limit: number,
        @QueryParam("offset") offset: number,
        @QueryParam("sortField") sortField: string,
        @QueryParam("sortOrder") sortOrder: string,
        @QueryParam("filter") filter: string,
        @QueryParam("search") similar: string
    ) {
        const pagination: Filter = {
            limit,
            offset,
            sortField,
            sortOrder,
            clientId: user.clientId,
            advanceFilter: toAdvanceFilterArr<AdvanceFilter>(filter),
            similar
        }

        return await this.repository.getLoyaltyPrograms(pagination);
    }

    @Post()
    async create(
        @CurrentUser() user: User,
        @Body({ validate: true }) data: LoyaltyProgram,
        @Res() response: any,
    ) {
        await this.repository.createNew(user, data);
        return response.sendStatus(200).end();
    }

    @Put("/:id")
    async update(
        @CurrentUser() user: User,
        @Body({ validate: true }) data: LoyaltyProgram,
        @Res() response: any,
        @Param("id") id: string
    ) {
        await this.repository.updateById(user, data, id);
        return response.sendStatus(201).end();
    }

    @Delete("/:id")
    async archive(
        @CurrentUser() user: User,
        @Param("id") id: string
    ) {
        return await this.repository.delete(user, id);
    }
}
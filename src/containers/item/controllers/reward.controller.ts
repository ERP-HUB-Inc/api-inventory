import { Controller, CurrentUser, Get, QueryParam } from "routing-controllers";
import BaseController from "../../../core/common/controllers/BaseController";
import Filter from "../../../core/common/filters";
import User from "../../../core/setting/models/User";
import RewardRepository from "../repositories/RewardRepository";

@Controller("/rewards")
export default class RewardController extends BaseController {
    constructor(private repository: RewardRepository) {
        super();
    }

    @Get()
    async lists(
        @CurrentUser() user: User,
        @QueryParam("limit") limit: number,
        @QueryParam("offset") offset: number
    ) {
        const pagination: Filter = {
            clientId: user.clientId,
            limit,
            offset
        }

        return await this.repository.getRewards(pagination);
    }
}
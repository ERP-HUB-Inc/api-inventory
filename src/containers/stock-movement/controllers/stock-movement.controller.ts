import {
    Controller,
    Get,
    CurrentUser,
    Param
} from "routing-controllers";
import MovementLogRepository from "../repositories/MovementLogRepository";
import BaseController from "../../../core/common/controllers/BaseController";
import User from "../../../core/setting/models/User";

@Controller("/stock/movementlogs")
export default class BrandController extends BaseController {
    constructor(private repository: MovementLogRepository) {
        super();
    }

    @Get("/:productId")
    async getMany(
        @CurrentUser() user: User,
        @Param("productId") productId: string
    ) {
        return await this.repository.findMany(productId, user.clientId);
    }
}
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
    Delete
} from "routing-controllers";
import {PurchaseStepEnums} from "../enums/PurchaseStepEnums";
import User from "../../../core/setting/models/User";
import ReturnOrderService from "../services/ReturnOrderService";
import PurchaseOrder from "../models/PurchaseOrder";
import {AdvanceFilter, toAdvanceFilterArr} from "../../../core/common/filters";

@Controller("/vendors")
export default class VendorController {
    constructor(private service: ReturnOrderService) {}

    @Authorized()
    @Get("/v1/detail/:id")
    async getOne(
        @CurrentUser() user: User,
        @QueryParam("languageId") languageId: string,
        @Param("id") id: string
    ) {
        const result = await this.service.detail(id, languageId);
        return result;
    }

    @Authorized()
    @Get("/v1/lists")
    async lists(
        @CurrentUser() user: User,
        @QueryParam("limit") limit: number,
        @QueryParam("offset") offset: number,
        @QueryParam("sortField") sortField: string,
        @QueryParam("sortOrder") sortOrder: string,
        @QueryParam("filter") filter: string,
        @QueryParam("rangFilter") rangFilter: string,
        @QueryParam("search") similar: string
    ) {
        // SET DEFAULT FILTER
        let defaultFilter = null;
        if (filter != null && filter != "undefined") {
            defaultFilter = JSON.parse(filter);
        } else {
            defaultFilter = {};
        }

        if (defaultFilter != null) {
            defaultFilter["step"] = [PurchaseStepEnums.RECEIVED];
            defaultFilter = JSON.stringify(defaultFilter);
        }

        console.log("DefaultFilter:", defaultFilter);

        const pagination = {
            limit,
            offset,
            sortField,
            sortOrder,
            clientId: user.clientId,
            similar,
            rangFilter,
            advanceFilter: toAdvanceFilterArr<AdvanceFilter>(defaultFilter)
        };
        const results = await this.service.findMany(pagination);
        return results;
    }

    @Authorized()
    @Put("/v1/update/:id")
    async update(
        @CurrentUser() user: User,
        @Body({ validate: true }) data: PurchaseOrder,
        @Param("id") id: string
    ) {
        this.service.deviceNumber = user.deviceNumber;
        this.service.clientId = user.clientId;
        data.clientId = user.clientId;
        data.userId = user.id;
        const condition = {id};
        const result = await this.service.update(data, condition);
        return result;
    }
}
import {
    Controller,
    Post,
    CurrentUser,
    Get,
    Param,
    QueryParam,
    Body,
    Put,
    Delete,
    UploadedFile,
    BodyParam,
    Patch,
    Res,
    QueryParams
} from "routing-controllers";
import Product from "../entities/Product";
import ProductService from "../services/ItemService";
import ProductAttributeService from "../services/ProductAttributeService";
import ProductVariantService from "../services/ProductVariantService";
import PromotionRepository from "../repositories/PromotionRepository";
import BaseController from "../../../core/common/controllers/BaseController";
import User from "../../../core/setting/models/User";
import {
    AdvanceFilter,
    toAdvanceFilterArr
} from "../../../core/common/filters";
import { UserStatus } from "../../../core/setting/enums";
import { fileUploadOptions } from "../../../../decorator/UploadFileOption";
import { ProductCreateDTO, ProductUpdateDto } from "../dto";
import { PaginationQuery } from "../query";
import { Response } from "express";

@Controller("/items")
export default class ItemController extends BaseController {
    constructor(
        private service: ProductService,
        private productVariantService: ProductVariantService,
        private productAttributeService: ProductAttributeService,
        private promotionRepository: PromotionRepository
    ) {
        super();
    }

    @Get("/:variantId/promotion")
    getPromotion(
        @CurrentUser() user: User,
        @Param("variantId") variantId: string,
        @QueryParam("orderQuantity") orderQuantity: number,
        @QueryParam("orderAmount") orderAmount: number
    ) {
        return this.promotionRepository.getPromotion(user.clientId, variantId, orderQuantity, orderAmount);
    }

    @Get("/get_form_data")
    getFormData(
        @CurrentUser() user: User,
    ) {
        return this.service.getFormData(user.clientId);
    }

    @Get("/stock/:productId")
    getStockDetail(
        @CurrentUser() user: User,
        @Param("productId") productId: string
    ) {
        return this.service.findDetailStockByProductId(user.clientId, productId);
    }

    @Get("/purchase_history/:productId")
    getPurchaseHistory(
        @CurrentUser() user: User,
        @Param("productId") productId: string,
        @QueryParam("startDate") startDate: string,
        @QueryParam("endDate") endDate: string,
        @QueryParam("offset") offset: number,
        @QueryParam("limit") limit: number,
    ) {
        return this.service.getPurchaseByProduct(user.clientId, productId, startDate, endDate, offset, limit);
    }

    @Get("/detail_for_split/:productVariantId")
    getOneForSplit(
        @CurrentUser() user: User,
        @Param("productVariantId") productVariantId: string,
        @QueryParam("locationId") locationId: string
    ) {
        return this.service.findDetailForSplit(productVariantId, locationId);
    }

    @Get("/attribute/all")
    getAttributes(
        @CurrentUser() user: User
    ) {
        const filter = {
            limit: "all",
            sortField: "createdAt",
            sortOrder: "ASC"
        };

        return this.productAttributeService.findAllProductAttributes(filter);
    }

    @Get("attributes/:id")
    getAttributesById(
        @Param("id") id: string,
        @CurrentUser() user: User
    ) {
        const option = {
            clientId: user.clientId,
            sortField: "createdAt",
            sortOrder: "ASC"
        };

        return this.productAttributeService.findManyAttributes(id, option);
    }

    @Get()
    findAll(
        @CurrentUser() user: User,
        @QueryParams() query: PaginationQuery
    ) {
        const option = {
            limit: query.limit,
            offset: query.offset,
            sortField: query.sortField,
            sortOrder: query.sortOrder,
            locationId: query.locationId,
            similar: query.search,
            advanceFilter: toAdvanceFilterArr<AdvanceFilter>(query.filter)
        };

        return this.service.findMany(option); 
    }

    @Get("/pos_products")
    getPOSProducts(
        @CurrentUser() user: User,
        @QueryParam("limit") limit: number,
        @QueryParam("offset") offset: number,
        @QueryParam("sortField") sortField: string,
        @QueryParam("sortOrder") sortOrder: string,
        @QueryParam("languageId", { required: true }) languageId: string,
        @QueryParam("locationId") locationId: string,
        @QueryParam("filter") filter: string,
        @QueryParam("search") similar: string
    ) {
        const option = {
            limit,
            offset,
            sortField,
            sortOrder,
            languageId,
            locationId,
            clientId: user.clientId,
            similar,
            advanceFilter: toAdvanceFilterArr<AdvanceFilter>(filter)
        };
        return this.service.findMany(option);
    }

    @Post("/split/:productVariantId")
    async splitProduct(
        @CurrentUser() user: User,
        @Param("productVariantId") productVariantId: string,
        @BodyParam("quantityToSplit") quantityToSplit: number,
        @BodyParam("locationId") locationId: string,
        @BodyParam("outputProducts") outputProducts: Product[]
    ) {
        return this.service.splitProduct(productVariantId, quantityToSplit, user.clientId, locationId, outputProducts);
    }

    @Post("/import")
    importProduct(
        @CurrentUser() user: User,
        @UploadedFile("csv", {options: fileUploadOptions()}) image: any
        ) {
        const excelToJson = require("convert-excel-to-json");
        const result = excelToJson({
            sourceFile: image.path,
        });
        const products = [];

        const sheets = Object.keys(result);
        const firstSheetData = result[sheets[0]];
        if (Array.isArray(firstSheetData)) {
            Object.keys(firstSheetData).forEach(key => {
                products.push(firstSheetData[key]);
            });
        }
        
        return this.service.importProducts(products, user.clientId);
    }

    @Get("/dropdown")
    listsForDropDown(
        @CurrentUser() user: User,
        @QueryParam("limit") limit: number,
        @QueryParam("offset") offset: number,
        @QueryParam("sortField") sortField: string,
        @QueryParam("sortOrder") sortOrder: string,
        @QueryParam("languageId") languageId: string,
        @QueryParam("filter") filter: string,
        @QueryParam("search") similar: string,
        @QueryParam("isSearchingBarcode") isSearchingBarcode: boolean
    ) {
        const option = {
            limit,
            offset,
            sortField,
            sortOrder,
            languageId,
            isFullAccess: user.isFullAccess == UserStatus.IsFullAccess,
            clientId: user.clientId,
            userId: user.id,
            locationId: user.locationId,
            similar,
            advanceFilter: toAdvanceFilterArr<AdvanceFilter>(filter)
        };
        
        return this.service.findManyForDropDown(option, isSearchingBarcode);
    }

    @Get("/v2/dropdown")
    listsForDropDownV2(
        @CurrentUser() user: User,
        @QueryParam("limit") limit: number,
        @QueryParam("offset") offset: number,
        @QueryParam("sortField") sortField: string,
        @QueryParam("sortOrder") sortOrder: string,
        @QueryParam("languageId") languageId: string,
        @QueryParam("filter") filter: string,
        @QueryParam("search") similar: string,
        @QueryParam("isSearchingBarcode") isSearchingBarcode: boolean
    ) {
        const option = {
            limit,
            offset,
            sortField,
            sortOrder,
            languageId,
            isFullAccess: user.isFullAccess == UserStatus.IsFullAccess,
            clientId: user.clientId,
            userId: user.id,
            locationId: user.locationId,
            similar,
            advanceFilter: toAdvanceFilterArr<AdvanceFilter>(filter)
        };
        
        return this.service.searchProducts(option, isSearchingBarcode);
    }

    @Post()
    async create(
        @CurrentUser() user: User,
        @Res() response: Response,
        @Body({ validate: true }) data: ProductCreateDTO
    ) {
        const id = await this.service.create(data);
        
        response.setHeader("Location", `/items/${id}`);

        return response.sendStatus(201).end();
    }

    @Patch("/:id")
    update(
        @CurrentUser() user: User,
        @Body({ validate: true }) data: ProductUpdateDto,
        @Res() response: Response,
        @Param("id") id: string
    ) {
        this.service.update(data, { id });
        return response.sendStatus(201).end();
    }

    @Put("/variant/update/:id")
    changeStatusVariant(
        @CurrentUser() user: User,
        @Param("id") id: string
    ) {
        return this.productVariantService.changeStatus(id);
    }

    @Put("/edit_cost/:id")
    editCost(
        @CurrentUser() user: User,
        @BodyParam("newCost") newCost: number,
        @Param("id") id: string
    ) {
        return this.service.editProductCost(user, id, newCost);
    }

    @Get("/:id")
    detail(
        @CurrentUser() user: User,
        @Param("id") id: string,
        @QueryParam("productOption") productOption: number,
        @QueryParam("isIncludeLocation") isIncludeLocation: boolean
    ) {
        return this.service.getProductById(id, productOption, isIncludeLocation);
    }

    @Delete("/:id")
    archive(
        @CurrentUser() user: User,
        @Param("id") id: string
    ) {
        return this.service.archive(id);;
    }


    @Delete("/variant/archive/:id")
    archiveVariant(
        @CurrentUser() user: User,
        @Param("id") id: string
    ) {
        return this.productVariantService.archive(id);
    }

    @Delete("/clear")
    clear(
        @CurrentUser() user: User
    ) {
        return this.service.clearProducts(user.clientId);
    }
}
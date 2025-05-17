import {
    getCustomRepository,
    getManager
} from "typeorm";
import { Service } from "typedi";
import * as _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import StockService from "./StockService";
import { StockAdjustmentStepEnums } from "../enums/StockAdjustmentStepEnums";
import StockAdjustmentEntryRepository from "../repositories/StockAdjustmentEntryRepository";
import StockAdjustmentRepository from "../repositories/StockAdjustmentRepository";
import LocationRepository from "../../../core/setting/repositories/LocationRepository";
import MovementLogRepository from "../../../inventory/stock/repositories/MovementLogRepository";
import BaseService from "../../../core/common/services/BaseService";
import {
    NotFoundError,
    BadRequestError
} from "../../../../exceptions";
import { ModelStatus } from "../../../../enums/ModelStatus";
import { HttpCode } from "../../../../enums/HttpCode";
import Filter from "../../../core/common/filters";
import ProductLocation from "../../item/entities/ProductLocation";
import ProductVariant from "../../item/entities/ProductVariant";
import { MovementLog, StockAdjustment, StockAdjustmentEntry } from "../entities";
import { StockEnums } from "../enums/StockEnums";
import UnitRepository from "../../item/repositories/UnitRepository";

@Service()
export default class StockAdjustmentService extends BaseService<StockAdjustment> {
    private locationRepository: LocationRepository;
    protected repository: StockAdjustmentRepository;
    private stockAdjustmentEntryRepository: StockAdjustmentEntryRepository;
    private unitRepository: UnitRepository;
    private movementLogRepository: MovementLogRepository;

    constructor() {
        super();
        this.repository = getCustomRepository(StockAdjustmentRepository);
        this.locationRepository = getCustomRepository(LocationRepository);
        this.stockAdjustmentEntryRepository = getCustomRepository(StockAdjustmentEntryRepository);
        this.unitRepository = getCustomRepository(UnitRepository);
        this.movementLogRepository = getCustomRepository(MovementLogRepository);
    }

    /**
     * Saves or updates a stock adjustment and its entries.
     * Also handles inventory quantity updates if step is APPROVED.
     */
    private async saveRecord(data: StockAdjustment, condition?: object) {
        let id = null;

        await getManager().transaction(async manager => {
            let stock = new StockAdjustment();
            let locationId = data.locationId;

            // Create new stock adjustment if no condition provided
            if (condition == null || condition["id"] == null) {
                stock = Object.assign(stock, data);
                id = uuidv4();
                stock.id = id;
                stock.approverId = stock.step == StockAdjustmentStepEnums.APPROVED ? data.userId : "";
                await manager.insert(StockAdjustment, stock);
            } else {

                // Update existing stock adjustment
                stock = await this.repository.findOneByFieldName({ id: condition["id"] });

                // Only allow update if the step is REQUESTED
                if (stock.step != StockAdjustmentStepEnums.REQUESTED) {
                    throw new BadRequestError("Forbiden step for update", HttpCode.FORBIDEN_STEP_PROCESS);
                }

                stock = Object.assign(stock, data);
                await manager.save(StockAdjustment, stock);
            }

            // Save all stock adjustment entries
            const entries = data["entries"];
            if (Array.isArray(entries)) {
                const lenght = entries.length;
                let entry: StockAdjustmentEntry;

                for (let i = 0; i < lenght; i++) {
                    let {
                        productVariantId,
                        productName,
                        variantName,
                        currentQuantity,
                        adjustQuantity,
                        unitId,
                        status
                    } = entries[i];

                    // Get barcode and productId from productVariant
                    const productVariant: ProductVariant = await this.repository.connection.createQueryBuilder(ProductVariant, "PV")
                        .select(["productId", "barcode"])
                        .where("PV.id = :id", { id: productVariantId })
                        .getRawOne();

                    // Insert or update entry
                    if (!entries[i].id) {
                        entry = new StockAdjustmentEntry();
                        entry.id = uuidv4();
                        entry.stockAdjustmentId = stock.id;
                        entry.productVariantId = productVariantId;
                        entry.productName = productName;
                        entry.variantName = variantName;
                        entry.barcode = productVariant.barcode;
                        entry.unitId = unitId;
                        entry.currentQuantity = currentQuantity;
                        entry.adjustQuantity = adjustQuantity;
                        entry.status = data.step;
                        await manager.insert(StockAdjustmentEntry, entry);
                    } else {
                        const updateEntry = {
                            currentQuantity,
                            adjustQuantity,
                            productName,
                            variantName,
                            status: status == null ? ModelStatus.ACTIVE : status
                        };
                        await manager.update(StockAdjustmentEntry, { id: entries[i].id }, updateEntry);
                    }

                    // If approved, update inventory and log movement
                    if (data.step == StockAdjustmentStepEnums.APPROVED) {
                        let productLocations: ProductLocation[] = await manager.createQueryBuilder<ProductLocation>("ProductLocation", "PL")
                            .select(["id", "locationId", "productVariantId", "quantity"])
                            .where("productVariantId = :productVariantId", { productVariantId })
                            .getRawMany();

                        let productLocation = productLocations.find(value => value.locationId == locationId);
                        const previousQuantity: number = productLocation ? productLocation.quantity : 0;

                        // Insert or update ProductLocation record
                        if (!productLocation) {
                            productLocation = new ProductLocation();
                            productLocation.id = uuidv4();
                            productLocation.locationId = locationId;
                            productLocation.productVariantId = productVariantId;
                            productLocation.quantity = adjustQuantity;
                            await manager.insert(ProductLocation, productLocation);
                        } else {
                            await manager.update(ProductLocation, { locationId, productVariantId }, { quantity: adjustQuantity });
                        }

                        // Update total quantity in ProductVariant
                        const quantity: number = _.sumBy(productLocations.filter(value => value.locationId != locationId), "quantity") + adjustQuantity;
                        await manager.update(ProductVariant, { id: productVariantId }, { quantity });

                        // Create and log stock movement
                        const movementLog: MovementLog = new MovementLog();
                        movementLog.id = uuidv4();
                        movementLog.userId = data.userId;
                        movementLog.locationId = locationId;
                        movementLog.entityId = data.id;
                        movementLog.productId = productVariant.productId;
                        movementLog.productVariantId = productVariantId;
                        movementLog.productVariant = productVariant.name;
                        movementLog.quantity = adjustQuantity;
                        movementLog.oldQuantity = previousQuantity;
                        movementLog.type = "ADJUSTMENT";
                        await this.movementLogRepository.log(movementLog, StockEnums.TRANSFER, manager);
                    }
                }
            }
        });

        return id;
    }

    /**
     * Get paginated list of stock adjustments waiting for approval
     */
    async findManyOfApproveList(filter: Filter) {
        const results = await this.repository.findManyOfApproveList(filter);
        return this.responses(results[0], results[1], filter.limit, filter.offset);
    }

    /**
     * Create a new stock adjustment record
     */
    create(data: StockAdjustment) {
        return this.saveRecord(data);
    }

    /**
     * Update an existing stock adjustment record
     */
    update(data: StockAdjustment, condition: object) {
        return this.saveRecord(data, condition);
    }

    /**
     * Approve a stock adjustment, and update all related inventory
     */
    async approve(data: StockAdjustment, condition: object) {
        await getManager().transaction(async manager => {
            // Validate location
            const location = await this.locationRepository.findOneByFieldName({id: data.locationId});
            if (!location) {
                throw new NotFoundError("Location not found", HttpCode.LOCATION_NOT_FOUND);
            }

            // Validate stock adjustment
            let stockAdjustment =  await this.repository.findOneByFieldName(condition);
            if (!stockAdjustment) {
                throw new NotFoundError("Stock adjustment not found", HttpCode.STOCK_ADJUSTMENT_NOT_FOUND);
            }

            if (stockAdjustment.step == StockAdjustmentStepEnums.APPROVED) {
                throw new NotFoundError("Forbiden step for approve", HttpCode.STOCK_ADJUSTMENT_ALREADY_APPROVED);
            }

            // Set new state and save
            stockAdjustment = Object.assign(stockAdjustment, data);
            stockAdjustment.approverId = data.userId;
            stockAdjustment.step = StockAdjustmentStepEnums.APPROVED;
            const resultStockAdjustment = await manager.save(this.repository.entityName, stockAdjustment);

            // Update entries
            const entries = data["entries"];
            if (Array.isArray(entries)) {
                const lenght = entries.length;
                for (let i = 0; i < lenght; i++) {
                    let stockAdjustmentEntry = await this.stockAdjustmentEntryRepository.findOneByFieldName({
                        id: entries[i].id,
                        stockAdjustmentId: resultStockAdjustment.id
                    });

                    if (!stockAdjustmentEntry) {
                        throw new NotFoundError("Stock adjustment entry not found", HttpCode.STOCK_ADJUSTMENT_ENTRY_NOT_FOUND);
                    }

                    // Approve entry
                    if (
                        entries[i].isApprove == StockAdjustmentStepEnums.APPROVED &&
                        stockAdjustmentEntry.status == StockAdjustmentStepEnums.REQUESTED
                    ) {
                        let unitMultiple = 1;

                        // Get unit conversion if needed
                        if (entries[i].unitId) {
                            const unitResult = await this.unitRepository.findOneByFieldName(
                                { id: stockAdjustmentEntry.unitId },
                                ["multiple"]
                            );
                            if (!unitResult) {
                                throw new NotFoundError("Unit not found", HttpCode.PRODUCT_UNIT_NOT_FOUND);
                            }
                            unitMultiple = unitResult.multiple;
                        }

                        // Perform inventory adjustment
                        const stockService = new StockService();
                        stockAdjustmentEntry.status = StockAdjustmentStepEnums.APPROVED;
                        await stockService.adjustmentProductStock(
                            manager,
                            stockAdjustmentEntry.productVariantId,
                            resultStockAdjustment.locationId,
                            stockAdjustmentEntry.adjustQuantity * unitMultiple
                        );
                    } else {
                        // If not approved, mark as disapproved
                        stockAdjustmentEntry.status = StockAdjustmentStepEnums.DISAPPROVED;
                    }

                    // Save entry update
                    stockAdjustmentEntry = await manager.save(this.stockAdjustmentEntryRepository.entityName, stockAdjustmentEntry);
                    entries[i] = stockAdjustmentEntry;
                }
            }

            resultStockAdjustment.details = entries;
            data = resultStockAdjustment;
        });

        delete data["entries"];
        return this.response(data);
    }

    /**
     * Get full detail of a stock adjustment by ID
     */
    detail(id: string) {
        return this.repository.detail(id);
    }

    /**
     * Archive (deactivate) stock adjustment(s) by comma-separated ID string
     */
    async archive(data: string) {
        const ids = data.split(",");
        const length = ids.length;

        for (var i = 0; i < length; i++) {
            const stockAdjustment = await this.repository.findOneByFieldName({ id: ids[i] });
            if (stockAdjustment != null) {
                if (stockAdjustment.step != StockAdjustmentStepEnums.REQUESTED) {
                    throw new BadRequestError("Stock adjustment can not archive", HttpCode.FORBIDEN_STEP_PROCESS);
                }
            }
        }

        const result = await this.repository.findOneByFieldName({id: data});
        if(result != null && result.step == StockAdjustmentStepEnums.APPROVED) {
            throw new BadRequestError("Forbiden step for delete", HttpCode.FORBIDEN_STEP_PROCESS);
        }

        return super.archive(data);
    }
}
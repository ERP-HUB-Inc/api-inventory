import { getCustomRepository, getManager } from "typeorm";
import { Service } from "typedi";
import { v4 as uuidv4 } from "uuid";
import { StockCount, StockCountEntry } from "../entities";
import StockCountRepository from "../repositories/StockCountRepository";
import BaseService from "../../../core/common/services/BaseService";
import User from "../../../core/setting/models/User";
import Filter from "../../../core/common/filters";
import ProductVariant from "../../item/entities/ProductVariant";
import { StockCountEntryStatus, StockCountStatus } from "../enums/StockCount";

@Service()
export default class StockCountService extends BaseService<StockCount> {
    protected repository: StockCountRepository;

    constructor() {
        super();
        this.repository = getCustomRepository(StockCountRepository);
    }

    private async getUncountedProducts(clientId: string, locationId: string, exceptProductVariantIds: string[]) {
        const query =  this.repository.connection.createQueryBuilder(ProductVariant, "PV")
        .innerJoin("PV.product", "P")
        .leftJoin("PV.productLocations", "PL", "PL.clientId = :clientId AND PL.locationId = :locationId", {locationId})
        .select([
            "P.name AS productName",
            "PV.name AS variantName",
            "PV.barcode AS barcode",
            "PV.cost AS cost",
            "PL.quantity AS expected",
            "0 AS count",
            "'UNCOUNTED' AS status"
        ])
        .where("P.clientId = :clientId AND PV.clientId = :clientId", {clientId});
        
        if (exceptProductVariantIds.length) query.andWhere("PV.id NOT IN(:productVariantIds)", {productVariantIds: exceptProductVariantIds})

        return await query.orderBy("P.name").getRawMany();
    }

    async getStockCountById(user: User, stockCountId: string) {
        const stockCount: StockCount = await this.repository.connection.createQueryBuilder(StockCount ,"SC")
        .innerJoin("SC.location", "L")
        .select([
            "SC.id",
            "SC.locationId",
            "SC.name",
            "SC.startDate",
            "SC.startTime",
            "SC.endDate",
            "SC.endTime",
            "SC.type",
            "SC.status",
            "L.name"
        ])
        .where("SC.clientId = :clientId AND SC.id = :stockCountId", {clientId: user.clientId, stockCountId})
        .getOne();

        stockCount.stockCountEntries = await this.repository.connection.createQueryBuilder(StockCountEntry, "SCE")
        .innerJoin("SCE.product", "P")
        .innerJoin("SCE.productVariant", "PV")
        .select([
            "SCE.id AS id",
            "P.name AS productName",
            "SCE.productVariantId AS productVariantId",
            "PV.name AS variantName",
            "PV.barcode AS barcode",
            "SCE.cost AS cost",
            "SCE.expected AS expected",
            "SCE.count AS count",
            "SCE.status AS status"
        ])
        .where("SCE.clientId = :clientId AND SCE.stockCountId = :stockCountId", {clientId: user.clientId, stockCountId: stockCount.id})
        .orderBy("P.name")
        .getRawMany();

        if (stockCount.type == "PARTIAL") {
            const countedEntries = stockCount.stockCountEntries.filter(stockCountEntry => stockCountEntry.status == "COUNTED");
            stockCount.all = stockCount.stockCountEntries.length;
            stockCount.uncounted = stockCount.stockCountEntries.filter(stockCountEntry => stockCountEntry.status == "UNCOUNTED").length;
            stockCount.counted = countedEntries.length;
            stockCount.unmatched = countedEntries.filter(stockCountEntry => stockCountEntry.expected != stockCountEntry.count).length;
            stockCount.matched = countedEntries.filter(stockCountEntry => stockCountEntry.expected == stockCountEntry.count).length;
        } else {
            const uncountedEntries = await this.getUncountedProducts(user.clientId, stockCount.locationId, stockCount.stockCountEntries.map(stockCountEntry => stockCountEntry.productVariantId));
            stockCount.uncounted = uncountedEntries.length;
            stockCount.counted = stockCount.stockCountEntries.length;
            stockCount.unmatched = stockCount.stockCountEntries.filter(stockCountEntry => stockCountEntry.expected != stockCountEntry.count).length;
            stockCount.matched = stockCount.stockCountEntries.filter(stockCountEntry => stockCountEntry.expected == stockCountEntry.count).length;
            
            stockCount.stockCountEntries = [...stockCount.stockCountEntries, ...uncountedEntries];

            stockCount.all = stockCount.stockCountEntries.length;
        }

        return this.response(stockCount);
    }

    async getStockCounts(filter: Filter) {
        const query = this.repository.connection.createQueryBuilder(StockCount, "SC")
        .innerJoin("SC.location", "L")
        .select([
            "SC.id AS id",
            "SC.name AS name",
            "SC.type AS type",
            "SC.status AS status",
            "L.name AS location"
        ])
        .where("SC.clientId = :clientId", {clientId: filter.clientId});

        const stockCounts: StockCount[] = await query.orderBy("startDate", "DESC").getRawMany();
        const count: number = await query.getCount();

        return this.responses(stockCounts, count, filter.limit, filter.offset);
    }

    async createNewStockCount(user: User, stockCount: StockCount) {
        await getManager().transaction(async (manager) => {
            stockCount.id = uuidv4();
            stockCount.clientId = user.clientId;
            stockCount.status = "IN_PROGRESS";
            await manager.insert(StockCount, stockCount);

            const promises = stockCount.stockCountEntries.map(async (entry) => {
                const stockCountEntry: StockCountEntry = new StockCountEntry();
                stockCountEntry.id = uuidv4();
                stockCountEntry.clientId = user.clientId;
                stockCountEntry.stockCountId = stockCount.id;
                stockCountEntry.productId = entry.productId;
                stockCountEntry.productVariantId = entry.productVariantId;
                stockCountEntry.expected = entry.expected;
                stockCountEntry.status = "UNCOUNTED";
                await manager.insert(StockCountEntry, stockCountEntry);
            });

            await Promise.all(promises);
        });

        return this.response({success: true, id: stockCount.id});
    }

    async updateStockCountById(user: User, stockCount: StockCount, id: string) {
        await getManager().transaction(async (manager) => {
            await manager.update(StockCount, {clientId: user.clientId, id}, {startDate: stockCount.startDate, startTime: stockCount.startTime, status: stockCount.status});

            const promises = stockCount.stockCountEntries.map(async (stockCountEntry) => {
                if (stockCountEntry.id) {
                    const updateData = {
                        count: stockCountEntry.count,
                        status: stockCountEntry.status
                    };
                    await manager.update(StockCountEntry, {clientId: user.clientId, id: stockCountEntry.id}, updateData);
                } else {
                    stockCountEntry.id = uuidv4();
                    stockCountEntry.stockCountId = id;
                    stockCountEntry.clientId = user.clientId;
                    await manager.insert(StockCountEntry, stockCountEntry);
                }
            });

            await Promise.all(promises);
        });

        return this.response({success: true});
    }

    async getPartialStockCountEntries(
        user: User,
        stockCountId: string,
        status: "uncounted"|"counted"|"unmatched"|"matched"|"excluded"|"all",
        limit: number,
        offset: number
    ) {
        const query = this.repository.connection.createQueryBuilder(StockCountEntry ,"SE")
        .innerJoin("SE.product", "P")
        .innerJoin("SE.productVariant", "PV")
        .select([
            "SE.id AS id",
            "SE.productVariantId AS productVariantId",
            "P.name AS productName",
            "PV.name AS variantName",
            "PV.barcode AS barcode",
            "SE.cost AS cost",
            "SE.expected AS expected",
            "SE.count AS count",
            "SE.status AS status"
        ])
        .where("SE.clientId = :clientId AND SE.stockCountId = :stockCountId", {clientId: user.clientId, stockCountId});

        if (status == "counted") {
            query.andWhere("SE.status = :counted", {counted: StockCountEntryStatus.COUNTED});
        } else if (status == "uncounted") {
            query.andWhere("SE.status = :uncounted", {uncounted: StockCountEntryStatus.UNCOUNTED});
        } else if (status == "unmatched") {
            query.andWhere("SE.expected <> SE.count");
        } else if (status == "matched") {
            query.andWhere("SE.expected = SE.count");
        } else if (status == "excluded") {
            query.andWhere("SE.status = 'excluded'");
        }

        if (!offset) offset = 0;

        if (!limit) limit = 20;

        query.offset(offset).limit(limit);

        return this.responses(
            await query.getRawMany(),
            await query.getCount(),
            limit,
            offset
        );
    }

    async getStockCountEntriesByStatus(
        user: User,
        stockCountId: string,
        limit: number,
        offset: number,
        status: "uncounted"|"counted"|"unmatched"|"matched"|"excluded"|"all",
        countType: string
    ) {
        if (countType === StockCountStatus.PARTIAL) {
            return await this.getPartialStockCountEntries(user, stockCountId, status, limit, offset);
        } else if (countType === StockCountStatus.FULL) {
            const stockCEntryQuery = this.repository.connection.createQueryBuilder(StockCountEntry, "SCE")
            .innerJoin("SCE.product", "P")
            .innerJoin("SCE.productVariant", "PV")
            .select([
                "SCE.id AS id",
                "P.name AS productName",
                "SCE.productVariantId AS productVariantId",
                "PV.name AS variantName",
                "PV.barcode AS barcode",
                "SCE.cost AS cost",
                "SCE.expected AS expected",
                "SCE.count AS count",
                "SCE.status AS status"
            ])
            .where("SCE.clientId = :clientId AND SCE.stockCountId = :stockCountId", {clientId: user.clientId, stockCountId});

            const pVariantQuery =  this.repository.connection.createQueryBuilder(ProductVariant, "PV")
                .innerJoin("PV.product", "P")
                .leftJoin("PV.productLocations", "PL", "PL.clientId = :clientId AND PL.locationId = :locationId", {locationId: user.locationId})
                .select([
                    "P.name AS productName",
                    "PV.name AS variantName",
                    "PV.barcode AS barcode",
                    "PV.cost AS cost",
                    "PL.quantity AS expected",
                    "0 AS count",
                    "'UNCOUNTED' AS status"
                ])
                .where("P.clientId = :clientId AND PV.clientId = :clientId", {clientId: user.clientId});

            if (status == "uncounted") {
                stockCEntryQuery.andWhere(`SCE.status = "${StockCountEntryStatus.UNCOUNTED}"`);
            }

            if (status == "matched") {
                stockCEntryQuery.andWhere("SCE.expected = SCE.count");
            }

            if (status == "unmatched") {
                stockCEntryQuery.andWhere("SCE.expected <> SCE.count");
            }

            let stockCountEntries = [];
            let uncountedEntries = [];
            let exceptProductVariantIds = [];
            let totalEntryCount: number = 0;
            let totalUncounted: number = 0;
            let entryLen: number = 0;

            if (status != "uncounted") {
                stockCountEntries =  await stockCEntryQuery.offset(offset).limit(limit).orderBy("P.name").getRawMany();
                totalEntryCount = await stockCEntryQuery.getCount();
                entryLen = stockCountEntries.length;
            }
            
            if (entryLen) {
                exceptProductVariantIds = stockCountEntries.map(entry => entry.productVariantId);
            }

            if (status == "all" || status == "uncounted") {
                const countPVEntries = await this.repository.connection.createQueryBuilder(StockCountEntry, "SCE")
                    .select([
                        "SCE.id id",
                        "SCE.productVariantId productVariantId"
                    ])
                    .where("SCE.clientId = :clientId AND SCE.stockCountId = :stockCountId", {clientId: user.clientId, stockCountId})
                    .andWhere(`SCE.status = "${StockCountEntryStatus.COUNTED}"`)
                    .getRawMany();

                const variantLen = countPVEntries.length;

                if (variantLen) {
                    countPVEntries.forEach(entry => {
                        exceptProductVariantIds.push(entry.productVariantId);
                    });
                }

                if (status == "uncounted") {
                    totalEntryCount = variantLen;
                }
           
                if (exceptProductVariantIds.length) pVariantQuery.andWhere("PV.id NOT IN(:productVariantIds)", {productVariantIds: exceptProductVariantIds})

                if ((limit - entryLen) > 0) {
                    let tempOffset = offset;
                    let variantOffset = tempOffset - (variantLen % tempOffset);
                    if (isNaN(variantOffset)) variantOffset = 0;
                    if (variantOffset < 0) variantOffset = 0;
                    if (entryLen > 0) variantOffset = 0;

                    uncountedEntries = await pVariantQuery.offset(variantOffset).limit(limit - entryLen).getRawMany();
                }
                totalUncounted = await pVariantQuery.getCount();
            }

            const data = [...stockCountEntries, ...uncountedEntries];

            let total = totalEntryCount + totalUncounted;

            return this.responses(
                data,
                total,
                limit,
                offset
            );
        }
    }

    async markAsCompleted(user: User, id: string) {
        await getManager().transaction(async (manager) => {
            await manager.update(StockCount, {clientId: user.clientId, id}, {status: "COMPLETED"});
        });

        return this.response({success: true});
    }

    async discardStockCount(user: User, id: string) {
        await getManager().transaction(async (manager) => {
            await manager.delete(StockCount, {clientId: user.clientId, id});
            await manager.delete(StockCountEntry, {clientId: user.clientId, stockCountId: id});
        });

        return this.response({success: true});
    }
}
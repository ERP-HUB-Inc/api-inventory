
import { EntityRepository } from "typeorm";
import BaseRepository from "../../../core/common/repositories/BaseRepository";
import { StockAdjustmentEntry } from "../entities";

@EntityRepository(StockAdjustmentEntry)
export default class StockAdjustmentEntryRepository extends BaseRepository<StockAdjustmentEntry> {

    entityName: string = "StockAdjustmentEntry";

    selectField: string[] = [
        "id",
        "stockAdjustmentId",
        "productVariantId",
        "currentQuantity",
        "adjustQuantity",
        "unitId",
        "status",
        "createdAt",
        "updatedAt"
    ];

    constructor() {
        super();
    }
}
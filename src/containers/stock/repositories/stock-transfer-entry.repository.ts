
import { EntityRepository } from "typeorm";
import BaseRepository from "../../../core/common/repositories/BaseRepository";
import { StockTransferEntry } from "../entities";

@EntityRepository(StockTransferEntry)
export default class StockTransferEntryRepository extends BaseRepository<StockTransferEntry> {

    entityName: string = "StockTransferEntry";

    selectField: string[] = [
        "id",
        "stockTransferId",
        "productVariantId",
        "transferQuantity",
        "receiveQuantity",
        "unitId",
        "price",
        "status",
        "createdAt",
        "updatedAt"
    ];

    constructor() {
        super();
    }
}
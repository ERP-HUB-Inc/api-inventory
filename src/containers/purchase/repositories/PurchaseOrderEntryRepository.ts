
import { EntityRepository } from "typeorm";
import BaseRepository from "../../../core/common/repositories/BaseRepository";
import PurchaseOrderEntry from "../models/PurchaseOrderEntry";

@EntityRepository(PurchaseOrderEntry)
export default class PurchaseOrderEntryRepository extends BaseRepository<PurchaseOrderEntry> {

    entityName: string = "PurchaseOrderEntry";

    selectField: string[] = [
        "id",
        "purchaseOrderId",
        "productVariantId",
        "requestQuantity",
        "receiveQuantity",
        "returnQuantity",
        "price",
        "unitId",
        "status",
        "createdAt",
        "updatedAt"
    ];

    constructor() {
        super();
    }
}
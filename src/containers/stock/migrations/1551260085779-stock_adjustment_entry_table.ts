import { String } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class stockAdjustmentEntryTable1551260085779 extends BaseMigration {

    constructor() {
        super();

        const entityName = "StockAdjustmentEntry";
        this.runQuery = String.Format(this.createQuery[0], entityName,
            "`stockAdjustmentId` varchar(40), `productVariantId` varchar(40), `unitId` varchar(40), `currentQuantity` int(10), `adjustQuantity` int(10),");
        this.downQuery = String.Format(this.createQuery[1], entityName);
    }
}

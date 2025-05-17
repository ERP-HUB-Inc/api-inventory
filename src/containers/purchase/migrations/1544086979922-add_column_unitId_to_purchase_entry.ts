import { String } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class addColumnUnitIdToPurchaseEntry1544086979922 extends BaseMigration {

    constructor() {
        super();

        const entityName = "PurchaseOrderEntry";
        this.runQuery = String.Format(this.alterQuery, entityName,
            "ADD COLUMN `unitId` varchar(40) ");
        this.downQuery = String.Format(this.alterQuery, entityName, "DROP COLUMN `unitId` ");
    }

} 
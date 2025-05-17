import { String } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class addTypeColumnToPurchase1535092929203 extends BaseMigration {

    constructor() {
        super();

        const entityName = "PurchaseOrder";
        this.runQuery = String.Format(this.alterQuery, entityName,
            "ADD COLUMN `type` int(4) ");
        this.downQuery = String.Format(this.alterQuery, entityName, "DROP COLUMN `type` int(4) ");
    }

}  
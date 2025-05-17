import { String } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class addColumnToProductLocation1541997104234 extends BaseMigration {

    constructor() {
        super();

        const entityName = "ProductLocation";
        this.runQuery = String.Format(this.alterQuery, entityName,
            "ADD COLUMN `productVariantId` varchar(40) ");
        this.downQuery = String.Format(this.alterQuery, entityName, "DROP COLUMN `productVariantId` varchar(40) ");
    }

}
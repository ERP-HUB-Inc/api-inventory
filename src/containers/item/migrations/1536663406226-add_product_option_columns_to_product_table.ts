import { String } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class addProductOptionColumnsToProductTable1536663406226  extends BaseMigration {

    constructor() {
        super();

        const entityName = "Product";
        this.runQuery = String.Format(this.alterQuery, entityName,
            "ADD COLUMN `productOption` int(4) ");
        this.downQuery = String.Format(this.alterQuery, entityName, "DROP COLUMN `productOption` int(4) ");
    }

}
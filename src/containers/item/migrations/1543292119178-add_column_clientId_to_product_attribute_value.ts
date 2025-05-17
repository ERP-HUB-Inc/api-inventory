import { String } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class addColumnClientIdToProductAttributeValue1543292119178 extends BaseMigration {

    constructor() {
        super();

        const entityName = "ProductAttributeValue";
        this.runQuery = String.Format(this.alterQuery, entityName, "ADD COLUMN `clientId` varchar(40) ");
        this.downQuery = String.Format(this.alterQuery, entityName, "DROP COLUMN `clientId` ");
    }

}
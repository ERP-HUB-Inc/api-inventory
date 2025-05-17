import { String } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class renameColumnAttributeIdToProductAttributeId1542008556141 extends BaseMigration {

    constructor() {
        super();

        const entityName = "ProductAttributeValue";
        this.runQuery = String.Format(this.alterQuery, entityName, "CHANGE `attributeId` `productAttributeId` varchar(40) ");
        this.downQuery = String.Format(this.alterQuery, entityName, "CHANGE `productAttributeId` `attributeId` varchar(40) ");
    }

}
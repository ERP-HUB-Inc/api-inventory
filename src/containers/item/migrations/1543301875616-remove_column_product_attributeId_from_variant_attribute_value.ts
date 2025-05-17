import { String } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class removeColumnProductAttributeIdFromVariantAttributeValue1543301875616 extends BaseMigration {

    constructor() {
        super();

        const entityName = "VariantAttributeValue";
        this.runQuery = String.Format(this.alterQuery, entityName, "DROP COLUMN `attributeValueId`  ");
        this.downQuery = String.Format(this.alterQuery, entityName, "ADD COLUMN `attributeValueId` varchar(40) ");
    }

}
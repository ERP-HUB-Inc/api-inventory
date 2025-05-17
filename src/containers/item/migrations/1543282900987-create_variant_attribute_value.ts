import { String } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class createVariantAttributeValue1543282900987 extends BaseMigration {

    constructor() {
        super();

        const entityName = "VariantAttributeValue";
        this.runQuery = String.Format(this.createQuery[0], entityName,
            "`productVariantId` varchar(40),`attributeValueId` varchar(40), `productAttributeValueId` varchar(40), ");
        this.downQuery = String.Format(this.createQuery[1], entityName);
    }

}

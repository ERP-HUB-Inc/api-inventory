import { String } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class changeTypeOfColumnProductIdAndAttributeId1542168075153 extends BaseMigration {

    constructor() {
        super();

        const entityName = "ProductAttribute";
        this.runQuery = String.Format(this.alterQuery, entityName,
            "CHANGE `productId` `productId` varchar(40),  CHANGE `attributeId` `attributeId` varchar(40)");
        this.downQuery = String.Format(this.alterQuery, entityName, "CHANGE `productId` `productId` int(4), CHANGE `attributeId` `attributeId` int(4) ");
    }

}
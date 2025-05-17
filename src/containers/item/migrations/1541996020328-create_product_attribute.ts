import { String } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class createProductAttribute1541996020328 extends BaseMigration {

    constructor() {
        super();

        const entityName = "ProductAttribute";
        this.runQuery = String.Format(this.createQuery[0], entityName,
            "`productId` int(4), `attributeId` int(4), `sort` int(4), ");
        this.downQuery = String.Format(this.createQuery[1], entityName);
    }

}
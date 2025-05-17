import { String, StringBuilder } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class createProductDescription1533781798306 extends BaseMigration {

    constructor() {
        super();

        const entityName = "ProductDescription";
        this.runQuery = String.Format(this.createQuery[0], entityName,
            "`productId` varchar(40), `languageId` varchar(40), `name` varchar(255), `description` varchar(255), ");
        this.downQuery = String.Format(this.createQuery[1], entityName);
    }
}


import { String } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class createAttributeValue1541996043058 extends BaseMigration {

    constructor() {
        super();

        const entityName = "AttributeValue";
        this.runQuery = String.Format(this.createQuery[0], entityName,
            "`attributeId` varchar(40), `name` varchar(100), `description` varchar(255), ");
        this.downQuery = String.Format(this.createQuery[1], entityName);
    }

}
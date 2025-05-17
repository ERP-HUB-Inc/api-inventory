import { String } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class createBrand1533695627540 extends BaseMigration {

    constructor() {
        super();

        const entityName = "Brand";
        this.runQuery = String.Format(this.createQuery[0], entityName,
            "`clientId` varchar(40), `image` varchar(255),`name` varchar(100), `description` varchar(255),");
        this.downQuery = String.Format(this.createQuery[1], entityName);
    }

}

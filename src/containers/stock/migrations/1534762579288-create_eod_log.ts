import { String, StringBuilder } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class createEodLog1534762579288 extends BaseMigration {

    constructor() {
        super();

        const entityName = "EODLog";
        this.runQuery = String.Format(this.createQuery[0], entityName,
            "`clientId` varchar(40), `productId` varchar(40), `userId` varchar(40), `startQuantity` int(10), `inQuantity` int(10), `outQuantity` int(10), `endQuantity` int(10), ");
        this.downQuery = String.Format(this.createQuery[1], entityName);
    }
}

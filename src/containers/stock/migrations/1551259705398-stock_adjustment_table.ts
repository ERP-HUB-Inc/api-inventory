import { String } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class stockAdjustmentTable1551259705398 extends BaseMigration {
    constructor() {
        super();

        const entityName = "StockAdjustment";
        this.runQuery = String.Format(this.createQuery[0], entityName,
            "`clientId` varchar(40), `locationId` varchar(10), `approverId` varchar(40), `userId` varchar(40), " +
            "`subject` varchar(100), `description` varchar(255), `step` int(1) DEFAULT 0, ");
        this.downQuery = String.Format(this.createQuery[1], entityName);
    }
}

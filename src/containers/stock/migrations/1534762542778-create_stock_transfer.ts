import { String, StringBuilder } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class createStockTransfer1534762542778 extends BaseMigration {

    constructor() {
        super();

        const entityName = "StockTransfer";
        this.runQuery = String.Format(this.createQuery[0], entityName,
            "`clientId` varchar(40), `fromLocationId` varchar(10), `toLocationId` int(10), `userId` varchar(40), `deliveryDueDate` Datetime(6), " +
            "`name` varchar(100) , `number` varchar(50), `step` int(1), ");
        this.downQuery = String.Format(this.createQuery[1], entityName);
    }
}

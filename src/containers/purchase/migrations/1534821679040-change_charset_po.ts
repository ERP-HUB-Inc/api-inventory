import { String, StringBuilder } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class changeCharsetPo1534821679040 extends BaseMigration {

    constructor() {
        super();

        const entityName = "PurchaseOrder";
        this.runQuery = String.Format(this.alterQuery, entityName,
            " MODIFY `name` varchar(100) CHARACTER SET utf8mb4,  MODIFY `invoiceNo` varchar(20) CHARACTER SET utf8mb4, MODIFY `number` varchar(20) CHARACTER SET utf8mb4");
        this.downQuery = String.Format(this.alterQuery, entityName,
            " MODIFY `name` varchar(100) CHARACTER SET utf8,  MODIFY `invoiceNo` varchar(20) CHARACTER SET utf8, MODIFY `number` varchar(20) CHARACTER SET utf8");
    }

}
import { String, StringBuilder } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class createPurchaseOrderEntry1534145918239 extends BaseMigration {
    constructor() {
        super();

        const entityName = "PurchaseOrderEntry";
        this.runQuery = String.Format(this.createQuery[0], entityName,
            "`purchaseOrderId` char(40), `productId` char(40), `requestQuantity` float, `receiveQuantity` float, `returnQuantity` float, `price` float, ");
        this.downQuery = String.Format(this.createQuery[1], entityName);
    }

}
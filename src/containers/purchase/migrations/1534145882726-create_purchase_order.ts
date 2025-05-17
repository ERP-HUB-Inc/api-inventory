import { String } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class createPurchaseOrder1534145882726 extends BaseMigration {

    constructor() {
        super();

        const entityName = "PurchaseOrder";
        this.runQuery = String.Format(this.createQuery[0], entityName,
            "`clientId` varchar(40), `supplierId` varchar(40), `locationId` int(10), `userId` varchar(40), `receiverId` varchar(40), `referenceId` varchar(40), " +
            "`deliveryDueDate` datetime(6), `invoiceNo` varchar(20), `name` varchar(100), `number` varchar(50), `shippingFee` float(10), `requestTotal` float(10), `returnTotal` float(10), " +
            "`receiveTotal` float(10), `step` int(1), ");
        this.downQuery = String.Format(this.createQuery[1], entityName);
    }

}
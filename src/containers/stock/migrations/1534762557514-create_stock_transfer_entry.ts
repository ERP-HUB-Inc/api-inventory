import { String } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class createStockTransferEntry1534762557514 extends BaseMigration {

    constructor() {
        super();

        const entityName = "StockTransferEntry";
        this.runQuery = String.Format(this.createQuery[0], entityName,
            "`stockTransferId` char(40), `productVariantId` char(40), `productName` varchar(255), `variantName` varchar(255), `barcode` varchar(40), `transferQuantity` int(10), `receiveQuantity` int(10), price float(10), ");
        this.downQuery = String.Format(this.createQuery[1], entityName);
    }
}

import { String } from "typescript-string-operations";
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class createMovementLog1534762592116 extends BaseMigration {

    constructor() {
        super();

        const entityName = "MovementLog";
        this.runQuery = String.Format(this.createQuery[0], entityName,
            "`clientId` char(40), `userId` char(40), `description` varchar(100), `locationId` int(10), `productVariantId` varchar(40), `entityId` varchar(40), `quantity` float, `oldQuantity` float, `productName` varchar(100), `productVariant` varchar(100), `unit` varchar(45), `multiple` int, `type` enum('PURCHASE','SALE','ADJUSTMENT') DEFAULT 'PURCHASE', ");
        this.downQuery = String.Format(this.createQuery[1], entityName);
    }
}

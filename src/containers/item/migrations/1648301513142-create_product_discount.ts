import { String } from "typescript-string-operations";
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class createProductDiscount1533695627540 extends BaseMigration {

    constructor() {
        super();
        const entityName = "ProductDiscount";
        this.runQuery = String.Format(this.createQuery[0], entityName,
            "`clientId` char(40), `promotionId` char(40), `productVariantId` char(40), `variantName` varchar(100), `quantity` int, `price` float, `dateStart` datetime(6), `dateEnd` datetime(6),");
        this.downQuery = String.Format(this.createQuery[1], entityName);
    }

}
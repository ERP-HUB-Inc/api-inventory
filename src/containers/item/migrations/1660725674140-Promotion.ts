import { String } from "typescript-string-operations";
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class Promotion1660725674140 extends BaseMigration {
    constructor() {
        super();
        const entityName = "Promotion";
        this.runQuery = String.Format(this.createQuery[0], entityName,
            "`clientId` char(40), `locationId` int, `name` varchar(100), `startDate` date, `endDate` date, `type` enum('basic','advance'), `discount` float, `discountType` tinyint(1), `targetProduct` enum('all','specific'), ");
        this.downQuery = String.Format(this.createQuery[1], entityName);
    }

}

import { String, StringBuilder } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class changeCharsetProductVariant1534821557832 extends BaseMigration {

    constructor() {
        super();

        const entityName = "ProductVariant";
        this.runQuery = String.Format(this.alterQuery, entityName,
            " MODIFY `name` varchar(100) CHARACTER SET utf8mb4 ");
        this.downQuery = String.Format(this.alterQuery, entityName,
            " MODIFY `name` varchar(100) CHARACTER SET utf8 ");
    }

}

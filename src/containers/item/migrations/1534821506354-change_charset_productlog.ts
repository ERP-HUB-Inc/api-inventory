import { String, StringBuilder } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class changeCharsetProductlog1534821506354 extends BaseMigration {

    constructor() {
        super();

        const entityName = "ProductLog";
        this.runQuery = String.Format(this.alterQuery, entityName,
            " MODIFY `name` varchar(255) CHARACTER SET utf8mb4, MODIFY `description` varchar(255) CHARACTER SET utf8mb4 ");
        this.downQuery = String.Format(this.alterQuery, entityName,
            " MODIFY `name` varchar(255) CHARACTER SET utf8, MODIFY `description` varchar(255) CHARACTER SET utf8 ");
    }

}

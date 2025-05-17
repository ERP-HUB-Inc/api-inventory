import { String, StringBuilder } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class changeCharsetVariantattribute1534821546707 extends BaseMigration {

    constructor() {
        super();

        const entityName = "VariantAtrribute";
        this.runQuery = String.Format(this.alterQuery, entityName,
            " MODIFY `name` varchar(100) CHARACTER SET utf8mb4,  MODIFY `description` varchar(255) CHARACTER SET utf8mb4 ");
        this.downQuery = String.Format(this.alterQuery, entityName,
            " MODIFY `name` varchar(100) CHARACTER SET utf8,  MODIFY `description` varchar(255) CHARACTER SET utf8 ");
    }

}
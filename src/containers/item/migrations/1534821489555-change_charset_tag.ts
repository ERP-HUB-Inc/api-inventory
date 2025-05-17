import { String, StringBuilder } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";

export class changeCharsetTag1534821489555 extends BaseMigration {

    constructor() {
        super();

        const entityName = "Tag";
        this.runQuery = String.Format(this.alterQuery, entityName,
            " MODIFY `tag` varchar(255) CHARACTER SET utf8mb4 ");
        this.downQuery = String.Format(this.alterQuery, entityName,
            " MODIFY `tag` varchar(255) CHARACTER SET utf8 ");
    }

}

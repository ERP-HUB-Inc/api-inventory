import { String, StringBuilder } from 'typescript-string-operations';
import { BaseMigration } from "../../../core/common/migration/BaseMigration";


export class createProduct1533780677836 extends BaseMigration {

    constructor() {
        super();

        const entityName = "Product";
        this.runQuery = String.Format(this.createQuery[0], entityName,
            "`clientId` varchar(40), `categoryId` char(40), `brandId` char(40), `unitOfMeasurementId` char(40), `stockUnitId` char(40), `sellUnitId` char(40), `unitConversion` decimal(10, 2), `defaultLocationId` char(40), `supplierId` char(40), `supplierPercentage` decimal(10, 2), `supplierItemCode` varchar(100), `preferredSupplierId` char(40), `manufacturerId`  char(40), `purchasePrice` decimal(10, 2), `image` varchar(255), `videoUrl` varchar(255), `name` varchar(255), `nameKM` varchar(255), `enableInventoryTracking` tinyint(1) DEFAULT 0, `serialType` tinyint(1), `barcode` varchar(20), `highlightTag` varchar(255), " +
            "`quantity` float, `reorderPoint` float, `factoryCost` float, `cost` float, `price` float, `isAvialableSale` tinyint(1), `isSplittable` tinyint(1) DEFAULT 0, `enableDescription` tinyint(1) DEFAULT 0, `isPublic` tinyint(1)  DEFAULT 0, `type` tinyint(1), ");
        this.downQuery = String.Format(this.createQuery[1], entityName);
    }
}

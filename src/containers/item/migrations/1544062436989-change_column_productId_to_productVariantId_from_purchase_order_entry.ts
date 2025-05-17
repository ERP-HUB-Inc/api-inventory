import {MigrationInterface, QueryRunner} from "typeorm";

export class changeColumnProductIdToProductVariantIdFromPurchaseOrderEntry1544062436989 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `PurchaseOrderEntry` CHANGE `productId` `productVariantId` varchar(40)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `PurchaseOrderEntry` CHANGE `productVariantId` `productId` varchar(40)");
    }

}

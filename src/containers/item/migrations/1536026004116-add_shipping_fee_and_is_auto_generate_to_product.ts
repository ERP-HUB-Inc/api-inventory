import {MigrationInterface, QueryRunner} from "typeorm";

export class add_shipping_fee_and_is_auto_generate_to_product1536026004116 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `Product` ADD COLUMN `isAutoGenerateBarcode` tinyint(1) DEFAULT 0 AFTER isPublic, ADD COLUMN `shippingFee` float(10) AFTER factoryCost");
        await queryRunner.query("ALTER TABLE `Product` ADD COLUMN `isAutoGenerateSKU` tinyint(1) DEFAULT 0 AFTER `isAutoGenerateBarcode`");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `Product` DROP COLUMN `isAutoGenerateBarcode`, DROP COLUMN `isAutoGenerateSKU`, DROP COLUMN `shippingFee`");
    }

}

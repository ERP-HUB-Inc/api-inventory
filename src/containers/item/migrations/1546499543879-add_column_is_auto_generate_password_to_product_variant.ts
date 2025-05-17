import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnIsAutoGeneratePasswordToProductVariant1546499543879 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `ProductVariant` ADD COLUMN `isAutoGenerateBarcode` tinyint(1) DEFAULT 0 AFTER `barcode`");
        await queryRunner.query("ALTER TABLE `ProductVariant` ADD COLUMN `isAutoGenerateSKU tinyint(1) DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `ProductVariant` DROP COLUMN `isAutoGenerateBarcode`,DROP COLUMN `isAutoGenerateSKU`");
    }

}

import {MigrationInterface, QueryRunner} from "typeorm";

export class removeSomeColumnInProductThatExistingProductVariant1546665088822 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `Product` DROP COLUMN `cost`, DROP COLUMN `price`, DROP COLUMN `factoryCost`, DROP COLUMN `quantity`, DROP COLUMN `barcode`");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}

import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnTaxIdTaxRateToProduct1574905656580 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `Product` ADD COLUMN `taxId` varchar(40) AFTER `stockUnitId`");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `Product` DROP COLUMN `taxId`");
    }

}

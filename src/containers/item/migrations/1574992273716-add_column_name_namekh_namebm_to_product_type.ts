import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnNameNamekhNamebmToProductType1574992273716 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `ProductType` ADD COLUMN `name` varchar(255) AFTER `image`");
        await queryRunner.query("ALTER TABLE `ProductType` ADD COLUMN `namekm` varchar(255) AFTER `name`");
        await queryRunner.query("ALTER TABLE `ProductType` ADD COLUMN `namebm` varchar(255) AFTER `namekm`");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `ProductType` DROP COLUMN `name`");
        await queryRunner.query("ALTER TABLE `ProductType` DROP COLUMN `namekm`");
        await queryRunner.query("ALTER TABLE `ProductType` DROP COLUMN `namebm`");
    }

}

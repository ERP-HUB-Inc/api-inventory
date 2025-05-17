import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnNameAndNameKhToProduct1574849273418 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `Product` ADD COLUMN `name` varchar(255) AFTER `stockUnitId`");
        await queryRunner.query("ALTER TABLE `Product` ADD COLUMN `namekm` varchar(255) AFTER `name`");
        await queryRunner.query("ALTER TABLE `Product` ADD COLUMN `namebm` varchar(255) AFTER `namekm`");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `Product` DROP COLUMN `name`");
        await queryRunner.query("ALTER TABLE `Product` DROP COLUMN `namekm`");
        await queryRunner.query("ALTER TABLE `Product` DROP COLUMN `namebm`");
    }

}

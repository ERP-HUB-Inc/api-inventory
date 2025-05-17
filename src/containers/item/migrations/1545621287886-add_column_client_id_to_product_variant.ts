import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnClientIdToProductVariant1545621287886 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `ProductVariant` ADD COLUMN `clientId` varchar(50) AFTER `productId`");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `ProductVariant` DROP COLUMN `clientId`");
    }

}

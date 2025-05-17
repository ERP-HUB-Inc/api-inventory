import {MigrationInterface, QueryRunner} from "typeorm";

export class dropColumnProductIdFromProductLocation1543558899304 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `ProductLocation` DROP COLUMN `productId`");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `ProductLocation` ADD COLUMN `productId` varchar(40) AFTER `locationId`");
    }

}

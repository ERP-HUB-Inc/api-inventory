import {MigrationInterface, QueryRunner} from "typeorm";

export class dropColumnProductIdFromProductCost1544060525593 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `ProductCost` DROP COLUMN `productId`,  ADD COLUMN `productVariantId` varchar(40) AFTER `id`");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `ProductCost` ADD COLUMN `productId` varchar(40) AFTER `id`, DROP COLUMN `productVariantId`");
    }

}

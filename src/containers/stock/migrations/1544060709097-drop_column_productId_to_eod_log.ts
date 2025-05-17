import {MigrationInterface, QueryRunner} from "typeorm";

export class dropColumnProductIdToEodLog1544060709097 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `EODLog` DROP COLUMN `productId`,  ADD COLUMN `productVariantId` varchar(40) AFTER `clientId`");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `EODLog` ADD COLUMN `productId` varchar(40) AFTER `clientId`, DROP COLUMN `productVariantId`");
    }

}

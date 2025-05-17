import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnReceiverByToStockTransfer1547560021236 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `StockTransfer` ADD COLUMN `receiverId` varchar(40) AFTER `userId`");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `StockTransfer` DROP COLUMN `receiverId");
    }

}

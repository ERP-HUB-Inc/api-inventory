import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnReceiveDateStockTransfer1547560058793 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `StockTransfer` ADD COLUMN `receiveDate` datetime(6) AFTER `receiverId`");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `StockTransfer` DROP COLUMN `receiveDate`");
    }

}

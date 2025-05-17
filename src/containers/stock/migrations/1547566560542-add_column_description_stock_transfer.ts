import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnDescriptionStockTransfer1547566560542 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `StockTransfer` ADD COLUMN `description` varchar(255) AFTER `name`");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `StockTransfer` DROP COLUMN `description`");
    }

}

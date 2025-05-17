import {MigrationInterface, QueryRunner} from "typeorm";

export class changeColumnProductIdToProductVariantIdFromStockTransferEntry1544062696193 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `StockTransferEntry` CHANGE `productId` `productVariantId` varchar(40)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `StockTransferEntry` CHANGE `productVariantId` `productId` varchar(40)");
    }

}

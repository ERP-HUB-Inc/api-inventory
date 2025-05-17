import {MigrationInterface, QueryRunner} from "typeorm";

export class createTableStockCountEntry1673248839917 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `StockCountEntry` (`id` char(40) PRIMARY KEY NOT NULL UNIQUE, `clientId` char(40), `stockCountId` char(40), `productId` char(40), `productVariantId` char(40), `expected` float, `count` float, `cost` double(20, 8), `status` enum('UNCOUNTED', 'COUNTED', 'INCLUDE','EXCLUDE')) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `StockCountEntry`");
    }

}

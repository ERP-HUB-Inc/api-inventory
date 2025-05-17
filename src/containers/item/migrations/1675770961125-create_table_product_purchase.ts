import {MigrationInterface, QueryRunner} from "typeorm";

export class createTableProductPurchase1675770961125 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `ProductPurchase` (`id` char(40) PRIMARY KEY NOT NULL UNIQUE, `clientId` char(40), `purchaseOrderId` char(40), `supplierId` char(40), `productVariantId` char(40), `orderDate` datetime(6), `quantity` float, `cost` float, `expiredDate` date) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `ProductPurchase`");
    }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class createProductVariant1533542919182 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `ProductVariant` (`id` char(40) PRIMARY KEY NOT NULL UNIQUE, `productId` char(40), `productAttributeValueId` varchar(1000), `name` varchar(100), `barcode` varchar(20), `sku` varchar(20), `image` varchar(255), `factoryCost` float, `cost` float, `price` float, `quantity` float, `status` tinyint(1) NOT NULL COMMENT '2=disabled,1=active,0=deactive' DEFAULT 1, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `ProductVariant`"); 
    }

}

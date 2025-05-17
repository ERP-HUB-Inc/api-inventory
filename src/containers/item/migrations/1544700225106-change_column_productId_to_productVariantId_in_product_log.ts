import {MigrationInterface, QueryRunner} from "typeorm";

export class changeColumnProductIdToProductVariantIdInProductLog1544700225106 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `ProductLog` CHANGE `productId` `productVariantId` varchar(40)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `ProductLog` CHANGE `productVariantId` `productId` varchar(40)");
    }

}

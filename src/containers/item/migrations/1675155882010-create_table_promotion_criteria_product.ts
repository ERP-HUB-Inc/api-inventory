import {MigrationInterface, QueryRunner} from "typeorm";

export class createTablePromotionCriteriaProduct1675155882010 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `PromotionCriteriaProduct` (`id` char(40) PRIMARY KEY NOT NULL UNIQUE, `clientId` char(40), `promotionId` char(40), `promotionCriteriaId` char(40), `productId` char(40), `productVariantId` char(40), `productName` varchar(255), `type` enum('THEN','WHEN')) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `PromotionCriteriaProduct`");
    }

}

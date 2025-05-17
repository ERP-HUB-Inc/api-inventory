import {MigrationInterface, QueryRunner} from "typeorm";

export class createTablePromotionCriteria1675154237351 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `PromotionCriteria` (`id` char(40) PRIMARY KEY NOT NULL UNIQUE, `clientId` char(40), `promotionId` char(40), `when` enum('BUY_ITEMS','SPEND_AMOUNT') COMMENT 'BUY_ITEMS: Buys the following items, SPEND_AMOUNT: Spends the following amount', `whenTarget` enum('specific', 'all'), `buyQuantity` float, `spendAmount` float, `then` enum('GET_ITEMS', 'SAVE_AMOUNT'), `getQuantity` float, `getPercentage` float, `getAmount` float, `thenTarget` enum('specific', 'all')) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `PromotionCriteria`");
    }

}

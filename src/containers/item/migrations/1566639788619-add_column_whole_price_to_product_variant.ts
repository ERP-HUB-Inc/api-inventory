import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnWholePriceToProductVariant1566639788619 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `ProductVariant` ADD COLUMN `wholePrice` float(10) AFTER `price`");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `ProductVariant` DROP COLUMN `wholePrice`");
    }

}

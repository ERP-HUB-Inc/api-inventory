import {MigrationInterface, QueryRunner} from "typeorm";

export class addColumnDistributePriceToProductVariant1566699821343 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `ProductVariant` ADD COLUMN `distributePrice` float(10) AFTER `wholePrice`");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `ProductVariant` DROP COLUMN `distributePrice`");
    }

}

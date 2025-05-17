import {MigrationInterface, QueryRunner} from "typeorm";

export class addReorderPointToProductVariant1548992138798 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `ProductVariant` ADD COLUMN `reorderPoint` int(10) AFTER `quantity`");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `ProductVariant` DROP COLUMN `reorderPoint`");
    }

}

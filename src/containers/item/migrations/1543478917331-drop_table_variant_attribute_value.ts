import {MigrationInterface, QueryRunner} from "typeorm";

export class dropTableVariantAttributeValue1543478917331 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `VariantAttributeValue`");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}

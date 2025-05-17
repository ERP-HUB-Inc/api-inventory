import { MigrationInterface, QueryRunner } from "typeorm";

export class renameVariantAttributeToAttribute1541996089844 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("RENAME TABLE `VariantAtrribute` TO `Attribute`");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("RENAME TABLE `Attribute` TO  `VariantAtrribute`");
    }

}
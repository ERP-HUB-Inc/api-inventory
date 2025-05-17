import {MigrationInterface, QueryRunner} from "typeorm";

export class renameAttributeValueToProductAttributeValue1542005119353 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("RENAME TABLE `AttributeValue` TO `ProductAttributeValue`");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("RENAME TABLE `ProductAttributeValue` TO  `AttributeValue`");
    }

}
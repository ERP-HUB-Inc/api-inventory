import { MigrationInterface, QueryRunner } from "typeorm";

export class createVariantAttribute1533542905109 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `VariantAtrribute` (`id` char(40) PRIMARY KEY NOT NULL UNIQUE, `clientId` char(40), `name` varchar(100), `description` varchar(255), `status` tinyint(1) NOT NULL COMMENT '2=disabled,1=active,0=deactive' DEFAULT 1, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `VariantAtrribute`");
    }

}

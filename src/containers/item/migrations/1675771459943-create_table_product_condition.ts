import {MigrationInterface, QueryRunner} from "typeorm";

export class createTableProductCondition1675771459943 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `ProductCondition` (`id` char(40) PRIMARY KEY NOT NULL UNIQUE, `clientId` char(40), `name` varchar(255), `status` TINYINT(1) DEFAULT '1') ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `ProductCondition`");
    }

}

import {MigrationInterface, QueryRunner} from "typeorm";

export class createTableConsigment1662605912329 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `Consignment` (`id` char(40) PRIMARY KEY NOT NULL UNIQUE, `clientId` char(40), `locationId` char(40), `supplierId` char(40), `description` varchar(255), `date` date, `status` enum('draft','received','returned'), `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `Consignment`");
    }
}

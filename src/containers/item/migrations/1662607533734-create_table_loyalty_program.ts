import {MigrationInterface, QueryRunner} from "typeorm";

export class createTableLoyaltyProgram1662607533734 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `LoyaltyProgram` (`id` char(40) PRIMARY KEY NOT NULL UNIQUE, `clientId` char(40), `locationId` char(40), `name` varchar(255), `pointPerAmount` float, `pointPerOrder` float, `pointPerProduct` float, `pointIncreament` float, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `LoyaltyProgram`");
    }

}

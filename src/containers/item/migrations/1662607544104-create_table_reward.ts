import {MigrationInterface, QueryRunner} from "typeorm";

export class createTableReward1662607544104 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `Reward` (`id` char(40) PRIMARY KEY NOT NULL UNIQUE, `clientId` char(40), `loyaltyProgramId` char(40), `name` varchar(255), `type` enum('gift','discount_value','discount_percentage'), `cost` float) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `Reward`");
    }

}

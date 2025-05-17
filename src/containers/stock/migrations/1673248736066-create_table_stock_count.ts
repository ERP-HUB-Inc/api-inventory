import {MigrationInterface, QueryRunner} from "typeorm";

export class createTableStockCount1673248736066 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `StockCount` (`id` char(40) PRIMARY KEY NOT NULL UNIQUE, `clientId` char(40), `locationId` int, `name` varchar(255), `startDate` date, `startTime` time, `endDate` date, `endTime` time , `type` enum('PARTIAL', 'FULL'), `status` enum('IN_PROGRESS', 'PAUSE','COMPLETED')) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `StockCount`");
    }

}

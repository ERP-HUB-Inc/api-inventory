import {MigrationInterface, QueryRunner} from "typeorm";

export class createTableConsigmentEntry1662605920637 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `ConsignmentEntry` (`id` char(40) PRIMARY KEY NOT NULL UNIQUE, `clientId` char(40), `consigmentId` char(40), `productVariantId` char(40), `productName` varchar(255), `barcode` varchar(50), `quantity` int) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `ConsignmentEntry`");
    }

}

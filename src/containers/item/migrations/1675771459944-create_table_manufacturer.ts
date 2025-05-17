import {MigrationInterface, QueryRunner} from "typeorm";

export class createTableManufacturer1675771459943 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE \`Manufacturer\` (
                \`id\` char(40) PRIMARY KEY NOT NULL UNIQUE, 
                \`clientId\` char(40), 
                \`name\` varchar(255) NOT NULL, 
                \`description\` text NULL, 
                \`address\` varchar(255) NULL, 
                \`city\` varchar(100) NULL, 
                \`state\` varchar(100) NULL, 
                \`country\` varchar(100) NULL, 
                \`postalCode\` varchar(20) NULL, 
                \`phoneNumber\` varchar(20) NULL, 
                \`email\` varchar(100) NULL, 
                \`website\` varchar(255) NULL, 
                \`taxId\` varchar(50) NULL, 
                \`businessLicense\` varchar(50) NULL, 
                \`establishedDate\` datetime NOT NULL, 
                \`status\` TINYINT(1) DEFAULT '1', 
                \`createdAt\` datetime DEFAULT CURRENT_TIMESTAMP, 
                \`updatedAt\` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `Manufacturer`");
    }

}

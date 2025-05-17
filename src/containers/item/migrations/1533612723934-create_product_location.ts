import { MigrationInterface, QueryRunner } from "typeorm";

export class createProductLocation1533612723934 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `ProductLocation` (`id` varchar(40) PRIMARY KEY NOT NULL UNIQUE, `locationId` int(10), `productId` varchar(40), `quantity` int(10), `status` tinyint(1) NOT NULL COMMENT '2=disabled,1=active,0=deactive' DEFAULT 1, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `ProductLocation`");
    }

}

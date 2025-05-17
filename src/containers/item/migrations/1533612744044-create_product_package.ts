import { MigrationInterface, QueryRunner } from "typeorm";

export class createProductPackage1533612744044 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `ProductPackage` (`id` varchar(40) PRIMARY KEY NOT NULL UNIQUE, `productId` varchar(40), `rawProductId` varchar(40), `quantity` int(10), `status` tinyint(1) NOT NULL COMMENT '2=disabled,1=active,0=deactive' DEFAULT 1, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `ProductPackage`");
    }

}

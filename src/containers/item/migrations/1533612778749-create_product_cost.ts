import { MigrationInterface, QueryRunner } from "typeorm";

export class createProductCost1533612778749 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `ProductCost` (`id` varchar(40) PRIMARY KEY NOT NULL UNIQUE, `productId` varchar(40), `purchaseOrderId` varchar(40), `userId` varchar(40), `clientId` varchar(40), `date` datetime(6), `cost` float(10), `status` tinyint(1) NOT NULL COMMENT '2=disabled,1=active,0=deactive' DEFAULT 1, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `ProductCost`");
    }

}

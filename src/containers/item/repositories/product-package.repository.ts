import { EntityRepository } from "typeorm";
import BaseRepository from "../../../core/common/repositories/BaseRepository";
import ProductPackage from "../entities/ProductPackage";

@EntityRepository(ProductPackage)
export default class ProductPackageRepository extends BaseRepository<ProductPackage> {

    entityName: string = "ProductPackage";

    selectField: string[] = [
        "id",
        "productId",
        "rawProductId",
        "quantity",
        "status",
        "createdAt",
        "updatedAt"
    ];

    constructor() {
        super();
    }
}
import { EntityRepository } from "typeorm";
import BaseRepository from "../../../core/common/repositories/BaseRepository";
import ProductTax from "../entities/ProductTax";

@EntityRepository(ProductTax)
export default class ProductTaxRepository extends BaseRepository<ProductTax> {

    entityName: string = "ProductTax";

    selectField: string[] = [
        "id",
        "taxId",
        "productId",
        "rate",
        "status",
        "createdAt",
        "updatedAt"
    ];

    constructor() {
        super();
    }
}
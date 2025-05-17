import { EntityRepository } from "typeorm";
import BaseRepository from "../../../core/common/repositories/BaseRepository";
import Brand from "../entities/Brand";
import ProductDescription from "../entities/ProductDescription";

@EntityRepository(ProductDescription)
export default class ProductDescriptionRepository extends BaseRepository<ProductDescription> {

    entityName: string = "ProductDescription";

    selectField: string[] = [
        "id",
        "productId",
        "languageId",
        "name",
        "description",
        "status",
        "createdAt",
        "updatedAt"
    ];

    constructor() {
        super();
    }
}
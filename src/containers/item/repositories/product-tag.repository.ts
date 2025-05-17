import { EntityRepository } from "typeorm";
import BaseRepository from "../../../core/common/repositories/BaseRepository";
import Brand from "../entities/Brand";
import ProductTag from "../entities/ProductTag";

@EntityRepository(ProductTag)
export default class ProductTagRepository extends BaseRepository<ProductTag> {

    entityName: string = "ProductTag";

    selectField: string[] = [
        "id",
        "tagId",
        "productId",
        "status",
        "createdAt",
        "updatedAt"
    ];

    constructor() {
        super();
    }
}
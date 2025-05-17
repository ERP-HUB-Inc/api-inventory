import { EntityRepository } from "typeorm";
import BaseRepository from "../../../core/common/repositories/BaseRepository";
import ProductImage from "../entities/ProductImage";

@EntityRepository(ProductImage)
export default class ProductImageRepository extends BaseRepository<ProductImage> {

    entityName: string = "ProductImage";

    selectField: string[] = [
        "id",
        "productId",
        "image",
        "order",
        "status",
        "createdAt",
        "updatedAt"
    ];

    constructor() {
        super();
    }
}
import { EntityRepository } from "typeorm";
import BaseRepository from "../../../core/common/repositories/BaseRepository";
import ProductAttributeValue from "../entities/ProductAttributeValue";

@EntityRepository(ProductAttributeValue)
export default class ProductAttributeValueRepository extends BaseRepository<ProductAttributeValue> {

    entityName: string = "ProductAttributeValue";

    selectField: string[] = [
        "id",
        "productAttributeId",
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
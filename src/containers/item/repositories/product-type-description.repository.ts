import { EntityRepository } from "typeorm";
import BaseRepository from "../../../core/common/repositories/BaseRepository";
import ProductTypeDescription from "../entities/ProductTypeDescription";

@EntityRepository(ProductTypeDescription)
export default class ProductTypeDescriptionRepository extends BaseRepository<ProductTypeDescription> {

    entityName: string = "ProductTypeDescription";

    selectField: string[] = [
        "id",
        "productTypeId",
        "languageId",
        "name",
        "description",
        "status",
        "createdAt",
        "updatedAt"
    ];
}
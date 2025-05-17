import { EntityRepository } from "typeorm";
import ProductLocation from "../entities/ProductLocation";
import BaseRepository from "../../../core/common/repositories/BaseRepository";

@EntityRepository(ProductLocation)
export default class ProductLocationRepository extends BaseRepository<ProductLocation> {

    entityName: string = "ProductLocation";

    selectField: string[] = [
        "id",
        "locationId",
        "clientId",
        "productVariantId",
        "quantity",
        "status",
        "createdAt",
        "updatedAt"
    ];
}
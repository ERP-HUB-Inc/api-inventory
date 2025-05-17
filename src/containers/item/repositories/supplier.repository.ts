import { EntityRepository } from "typeorm";
import BaseRepository from "../../../core/common/repositories/BaseRepository";
import Supplier from "../entities/Supplier";

@EntityRepository(Supplier)
export default class SupplierRepository extends BaseRepository<Supplier> {

    entityName: string = "Supplier";

    selectField: string[] = [
        "id",
        "clientId",
        "name",
        "description",
        "phoneNumber",
        "email",
        "status",
        "createdAt",
        "updatedAt"
    ];

    defaultOrder: string[] = ["name", "ASC"];
}
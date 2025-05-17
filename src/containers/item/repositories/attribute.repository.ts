import { EntityRepository } from "typeorm";
import BaseRepository from "../../../core/common/repositories/BaseRepository";
import Attribute from "../entities/Attribute";

@EntityRepository(Attribute)
export default class AttributeRepository extends BaseRepository<Attribute> {

    entityName: string = "Attribute";

    selectField: string[] = [
        "clientId",
        "id",
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
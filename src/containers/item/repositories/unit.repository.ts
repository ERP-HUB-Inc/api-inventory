import {EntityRepository} from "typeorm";
import Unit from "../entities/Unit";
import BaseRepository from "../../../core/common/repositories/BaseRepository";


@EntityRepository(Unit)
export default class UnitRepository extends BaseRepository<Unit> {

    entityName: string = "Unit";

    selectField: string[] = [
        "id",
        "clientId",
        "name",
        "multiple",
        "label",
        "isSystem",
        "status",
        "createdAt",
        "updatedAt",
        "isDefault"
    ];
}
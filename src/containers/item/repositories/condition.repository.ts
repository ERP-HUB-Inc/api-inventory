import { EntityRepository } from "typeorm";
import Condition from "../entities/Condition";
import BaseRepository from "../../../core/common/repositories/BaseRepository";
import Filter from "../../../core/common/filters";
import Utils from "../../../core/common/utils";

@EntityRepository(Condition)
export default class BrandRepository extends BaseRepository<Condition> {

    entityName: string = "Condition";

    defaultOrder: string[] = ["name", "ASC"];

    selectField: string[] = [
        "id",
        "clientId",
        "name"
    ];
}
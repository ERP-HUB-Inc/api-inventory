import { EntityRepository } from "typeorm";
import BaseRepository from "../../../core/common/repositories/BaseRepository";
import { ConsignmentEntry } from "../entities";

@EntityRepository(ConsignmentEntry)
export default class ConsignmentRepository extends BaseRepository<ConsignmentEntry> {

    entityName: string = "ConsignmentEntry";

    selectField: string[] = [
        "id",
        "locationId",
        "supplierId",
        "description",
        "date",
        "status"
    ];
}
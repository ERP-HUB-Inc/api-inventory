import {EntityRepository} from "typeorm";
import { Manufacturer } from "../entities";
import BaseRepository from "../../../core/common/repositories/BaseRepository";


@EntityRepository(Manufacturer)
export default class ManufacturerRepository extends BaseRepository<Manufacturer> {

    entityName: string = "Manufacturer";

    selectField: string[] = [
        "id",
        "name",
        "description",
        "address",
        "city",
        "state",
        "country",
        "postalCode",
        "phoneNumber",
        "email",
        "website",
        "taxId",
        "businessLicense",
        "establishedDate",
        "status",
        "createdAt",
        "updatedAt"
    ];
}
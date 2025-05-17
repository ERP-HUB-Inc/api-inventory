import {getCustomRepository, getManager} from "typeorm";
import {Service} from "typedi";
import Unit from "../entities/Unit";
import UnitRepository from "../repositories/UnitRepository";
import {
    BadRequestError
} from "../../../../exceptions";
import BaseService from "../../../core/common/services/BaseService";
import Product from "../entities/Product";

@Service()
export default class UnitService extends BaseService<Unit> {
    constructor() {
        super();
        this.repository = getCustomRepository(UnitRepository);
    }

    async deleteById(data: string, clientId: string) {
        const ids = data.split(",");

        const promises = ids.map(async(id: string) => {
            const foundLinkedProduct: Product = await this.repository.connection.createQueryBuilder(Product, "P")
            .select("id")
            .where("P.clientId = :clientId AND P.stockUnitId = :unitId", {clientId, unitId: id})
            .getRawOne();
            
            if (foundLinkedProduct != null) {
                throw new BadRequestError("You cannot delete this unit as it has been linked to other products.");
            }

            await getManager().delete(Unit, {clientId, id});
        });

        await Promise.all(promises);

        return this.response({success: true});
    }
}
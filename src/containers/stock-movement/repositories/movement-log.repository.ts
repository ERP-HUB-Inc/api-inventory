
import {
    EntityRepository,
    EntityManager,
    getConnection
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { MovementLog } from "../entities";
import { StockEnums } from "../enums/StockEnums";

@EntityRepository(MovementLog)
export default class MovementLogRepository {

    async findMany(productId: string, clientId: string): Promise<MovementLog[]> {
        const results: MovementLog[] = await getConnection().createQueryBuilder(MovementLog, "ML")
        .innerJoin("ML.location", "L")
        .select([
            "ML.id AS id",
            "entityId",
            "productVariantId",
            "productVariant",
            "quantity AS currentQuantity",
            "oldQuantity",
            "cost AS currentCost",
            "oldCost",
            "type",
            "ML.createdAt AS date",
            "L.name AS locationName"
        ])
        .where("productId = :productId AND ML.clientId = :clientId", {productId, clientId})
        .orderBy("ML.createdAt", "DESC")
        .getRawMany();

        return results;
    }

    async log(movementLog: MovementLog, type: StockEnums, manager: EntityManager) {
        movementLog.id = uuidv4();
        let movementType: string = movementLog.type;

        if (type == StockEnums.SALE) {
            movementType = "SALE";
        } else if (type == StockEnums.PO) {
            movementType = "PURCHASE";
        } else if (type == StockEnums.ADJUST) {
            movementType = "ADJUSTMENT";
        } else if (type == StockEnums.EDIT_COST) {
            movementType = "EDIT_COST";
        }

        if (movementType) {
            movementLog.type = movementType;
            await manager.insert(MovementLog, movementLog);
        }
    }
}
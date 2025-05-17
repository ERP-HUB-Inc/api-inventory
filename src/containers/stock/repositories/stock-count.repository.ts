
import { EntityRepository } from "typeorm";
import { StockCount } from "../entities";
import BaseRepository from "../../../core/common/repositories/BaseRepository";

@EntityRepository(StockCount)
export default class StockCountRepository extends BaseRepository<StockCount> {

    entityName: string = "StockCount";
}
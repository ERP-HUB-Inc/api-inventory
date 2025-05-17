import { getCustomRepository } from "typeorm";
import { Service } from "typedi";
import ProductCostRepository from "../repositories/ProductCostRepository";
import ProductCost from "../entities/ProductCost";
import BaseService from "../../../core/common/services/BaseService";

@Service()
export default class ProductCostService extends BaseService<ProductCost> {
    constructor() {
        super();
        this.repository = getCustomRepository(ProductCostRepository);
    }
}
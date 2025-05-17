import { getCustomRepository } from "typeorm";
import { Service } from "typedi";
import BaseService from "../../../core/common/services/BaseService";
import ProductLogRepository from "../repositories/ProductLogRepository";
import ProductLog from "../entities/ProductLog";

@Service()
export default class ProductLogService extends BaseService<ProductLog> {
    constructor() {
        super();
        this.repository = getCustomRepository(ProductLogRepository);
    }
}
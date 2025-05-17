import { getCustomRepository } from "typeorm";
import { Service } from "typedi";
import BaseService from "../../../core/common/services/BaseService";
import Product from "../entities/Product";
import ProductRepository from "../repositories/ItemRepository";

@Service()
export default class ProductSeachService extends BaseService<Product> {
    constructor() {
        super();
        this.repository = getCustomRepository(ProductRepository);
    }
}
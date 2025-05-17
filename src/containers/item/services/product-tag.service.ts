import { getCustomRepository } from "typeorm";
import { Service } from "typedi";
import BaseService from "../../../core/common/services/BaseService";
import ProductTag from "../entities/ProductTag";
import ProductTagRepository from "../repositories/ProductTagRepository";

@Service()
export default class ProductTagService extends BaseService<ProductTag> {
    constructor() {
        super();
        this.repository = getCustomRepository(ProductTagRepository);
    }
}
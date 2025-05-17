import { getCustomRepository } from "typeorm";
import { Service } from "typedi";
import ProductLocation from "../entities/ProductLocation";
import ProductLocationRepository from "../repositories/ProductLocationRepository";
import BaseService from "../../../core/common/services/BaseService";

@Service()
export default class ProductLocationService extends BaseService<ProductLocation> {
    protected repository: ProductLocationRepository;
    
    constructor() {
        super();
        this.repository = getCustomRepository(ProductLocationRepository);
    }
}
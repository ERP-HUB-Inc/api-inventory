import { getCustomRepository } from "typeorm";
import { Service } from "typedi";
import BaseService from "../../../core/common/services/BaseService";
import ProductPackage from "../entities/ProductPackage";
import ProductPackageRepository from "../repositories/ProductPackageRepository";

@Service()
export default class ProductPackageService extends BaseService<ProductPackage> {
    constructor() {
        super();
        this.repository = getCustomRepository(ProductPackageRepository);
    }
}
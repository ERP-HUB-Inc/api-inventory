import { getCustomRepository } from "typeorm";
import { Service } from "typedi";
import BaseService from "../../../core/common/services/BaseService";
import ProductTaxRepository from "../repositories/ProductTaxRepository";
import ProductTax from "../entities/ProductTax";

@Service()
export default class ProductTaxService extends BaseService<ProductTax> {
    constructor() {
        super();
        this.repository = getCustomRepository(ProductTaxRepository);
    }
}
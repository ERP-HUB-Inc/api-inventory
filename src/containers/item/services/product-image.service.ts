import { getCustomRepository } from "typeorm";
import { Service } from "typedi";
import BaseService from "../../../core/common/services/BaseService";
import ProductImageRepository from "../repositories/ProductImageRepository";
import ProductImage from "../entities/ProductImage";

@Service()
export default class ProductImageService extends BaseService<ProductImage> {
    constructor() {
        super();
        this.repository = getCustomRepository(ProductImageRepository);
    }
}
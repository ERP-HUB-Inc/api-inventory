import { getCustomRepository } from "typeorm";
import { Service } from "typedi";
import Supplier from "../entities/Supplier";
import BaseService from "../../../core/common/services/BaseService";
import SupplierRepository from "../repositories/SupplierRepository";

@Service()
export default class SupplierService extends BaseService<Supplier> {

    protected repository: SupplierRepository;

    constructor() {
        super();
        this.repository = getCustomRepository(SupplierRepository);
    }
}
import { getCustomRepository } from "typeorm";
import { Service } from "typedi";
import BaseService from "../../../core/common/services/BaseService";
import Attribute from "../entities/Attribute";
import AttributeRepository from "../repositories/AttributeRepository";

@Service()
export default class AttributeService extends BaseService<Attribute> {
    constructor() {
        super();
        this.repository = getCustomRepository(AttributeRepository);
    }
}
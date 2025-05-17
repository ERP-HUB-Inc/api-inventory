import { getCustomRepository } from "typeorm";
import { Service } from "typedi";
import Condition from "../entities/Condition";
import ConditionRepository from "../repositories/ConditionRepository";
import BaseService from "../../../core/common/services/BaseService";

@Service()
export default class ConditionService extends BaseService<Condition> {
    protected repository: ConditionRepository;
    
    constructor() {
        super();
        this.repository = getCustomRepository(ConditionRepository);
    }
}
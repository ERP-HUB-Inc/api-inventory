import { getCustomRepository } from "typeorm";
import { Service } from "typedi";
import BaseService from "../../../core/common/services/BaseService";
import Tag from "../entities/Tag";
import TagRepository from "../repositories/TagRepository";

@Service()
export default class TagService extends BaseService<Tag> {
    constructor() {
        super();
        this.repository = getCustomRepository(TagRepository);
    }
}
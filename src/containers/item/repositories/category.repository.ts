import { EntityRepository, getRepository } from "typeorm";
import BaseRepository from "../../../core/common/repositories/BaseRepository";
import Category from "../entities/Category";
import Filter from "../../../core/common/filters";

@EntityRepository(Category)
export default class CategoryRepository extends BaseRepository<Category> {

    entityName: string = "Category";

    selectField: string[] = [
        "id",
        "clientId",
        "parentId",
        "name",
        "namekm",
        "namebm",
        "image",
        "isFeature",
        "description",
        "label",
        "status",
        "createdAt",
        "updatedAt"
    ];

    defaultOrder: string[] = ["name", "ASC"];

    findMany(filter: Filter): Promise<[Category[], number]> {
        const query = getRepository(Category)
            .createQueryBuilder("category")
            .leftJoinAndSelect("category.parent", "parent");
    
        // Apply search filter
        if (filter.similar) {
            query.where("(category.name LIKE :key OR category.namekm LIKE :key)", { key: `%${filter.similar}%` });
        }
    
        // Handle pagination
        if (filter.offset !== undefined && filter.offset >= 0) {
            query.skip(filter.offset);
        }
    
        const limit = filter.limit ?? this.limit;
        query.take(parseInt(limit));
    
        // Set order explicitly
        query.orderBy("category.name", "ASC");
    
        return query.getManyAndCount();
    }    
}
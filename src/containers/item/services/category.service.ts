import {
    JoinOptions, getCustomRepository
} from "typeorm";
import { Service } from "typedi";
import { plainToInstance } from "class-transformer";
import CategoryRepository from "../repositories/CategoryRepository";
import Filter from "../../../core/common/filters";
import { 
    CategoryCreateDto, 
    CategoryResponseDto 
} from "../dto";
import { 
    fromCategoryCreateDtoToCategory, 
    fromCategoryToCategoryResponseDto,
    fromCategoryToCategoryResponsesDto
} from "../mappers";

@Service()
export default class CategoryService {
    private repository: CategoryRepository;

    constructor() {
        this.repository = getCustomRepository(CategoryRepository);
    }

    response(data: CategoryResponseDto) {
        return {
            data
        }
    }

    responseT<D>(data: D | D[], user?: any) {
        return {
            data,
            user
        }
    }

    responses(datas: CategoryResponseDto[], total: number = datas.length, limit: number = 0, offset: number = 0) {
        return {
            data: datas,
            pagination: {
                total,
                offset,
                limit
            }
        }
    }

    async findMany(filter: Filter) {
        const results = await this.repository.findMany(filter);
        return this.responses(fromCategoryToCategoryResponsesDto(results[0]), results[1], filter.limit, filter.offset);
    }

    async findOne(
        condition: Object,
        select?: string[],
        relations?: any,
        joinOptions?: JoinOptions
    ) {
        const result = await this.repository.findOneByFieldName(condition, select, relations, joinOptions);
        return this.response(fromCategoryToCategoryResponseDto(result));
    }

    async create(dto: CategoryCreateDto, columnCheckExist?: Object) {
        const category = fromCategoryCreateDtoToCategory(dto);
        const createdCategory = await this.repository.create(category, columnCheckExist);

        return this.response(fromCategoryToCategoryResponseDto(createdCategory));
    }

    async update(data: Object, condition: Object) {
        return this.response(plainToInstance(CategoryResponseDto, await this.repository.update(data, condition)));
    }

    archive(data: string) {
        return this.repository.archive(data);
    }

    changeStatus(ids: string) {
        return this.repository.changeStatus(ids);
    }
}
import { JoinOptions, getCustomRepository } from "typeorm";
import { Service } from "typedi";
import ManufacturerRepository from "../repositories/ManufacturerRepository";
import { 
    ManufacturerCreateDto,
    ManufacturerResponseDto
} from "../dto/ManufacturerDto";
import Filter from "../../../core/common/filters";
import { instanceToInstance, plainToInstance } from "class-transformer";
import { Manufacturer } from "../entities";

@Service()
export default class ManufacturerService{
    private repository: ManufacturerRepository;
    constructor() {
        this.repository = getCustomRepository(ManufacturerRepository);
    }

    response(data: ManufacturerResponseDto) {
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

    responses(datas: ManufacturerResponseDto[], total: number = datas.length, limit: number = 0, offset: number = 0) {
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
        return this.responses(plainToInstance(ManufacturerResponseDto, results[0], { excludeExtraneousValues: true }), results[1], filter.limit, filter.offset);
    }

    async findOne(
        condition: Object,
        select?: string[],
        relations?: any,
        joinOptions?: JoinOptions
    ) {
        return this.response(plainToInstance(ManufacturerResponseDto, await this.repository.findOneByFieldName(condition, select, relations, joinOptions), { excludeExtraneousValues: true }));
    }

    async create(data: ManufacturerCreateDto, columnCheckExist?: Object) {
        console.log(plainToInstance(Manufacturer, data, { excludeExtraneousValues: true }))
        return this.response(plainToInstance(ManufacturerResponseDto, await this.repository.create(plainToInstance(Manufacturer, data, { excludeExtraneousValues: true }), columnCheckExist), { excludeExtraneousValues: true }));
    }

    async update(data: Object, condition: Object) {
        return this.response(plainToInstance(ManufacturerResponseDto, await this.repository.update(data, condition)));
    }

    archive(data: string) {
        return this.repository.archive(data);
    }

    changeStatus(ids: string) {
        return this.repository.changeStatus(ids);
    }
}
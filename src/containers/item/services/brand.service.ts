
import { Injectable, NotFoundException } from "@nestjs/common";
import { DeepPartial } from "typeorm";
import { Brand } from "@entities/item/bran.entity";
import { BrandRepository } from "../repositories";

@Injectable()
export class BrandService {
    constructor(private readonly brandRepository: BrandRepository) {}

    /**
     * Creates a new Brand entity in the database.
     * @param data - Partial data to create the brand.
     * @returns The created Brand entity.
     */
    async create(data: DeepPartial<Brand>): Promise<Brand> {
        const brand = this.brandRepository.repository.create(data);
        return this.brandRepository.repository.save(brand);
    }

    /**
     * Retrieves all Brand entities from the database.
     * @returns An array of all Brand entities.
     */
    async findAll(): Promise<Brand[]> {
        return this.brandRepository.repository.find();
    }

    /**
     * Finds a single Brand entity by its ID.
     * Throws NotFoundException if the brand does not exist.
     * @param id - The ID of the brand to find.
     * @returns The found Brand entity.
     */
    async findOne(id: string): Promise<Brand> {
        const brand = await this.brandRepository.repository.findOne({ where: { id } });
        if (!brand) {
            throw new NotFoundException(`Brand with id ${id} not found`);
        }
        return brand;
    }

    /**
     * Updates an existing Brand entity by its ID.
     * Throws NotFoundException if the brand does not exist.
     * @param id - The ID of the brand to update.
     * @param data - Partial data to update the brand.
     * @returns The updated Brand entity.
     */
    async update(id: string, data: DeepPartial<Brand>): Promise<Brand> {
        const brand = await this.findOne(id);
        Object.assign(brand, data);
        return this.brandRepository.repository.save(brand);
    }

    /**
     * Removes a Brand entity from the database by its ID.
     * Throws NotFoundException if the brand does not exist.
     * @param id - The ID of the brand to remove.
     * @returns void
     */
    async remove(id: string): Promise<void> {
        const brand = await this.findOne(id);
        await this.brandRepository.repository.remove(brand);
    }
}

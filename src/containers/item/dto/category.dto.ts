import { Expose, Transform } from "class-transformer";
import Category from "../entities/Category";

export class CategoryCreateDto {
    @Expose()
    parentId: string;
    
    @Expose()
    name: string;

    @Expose()
    namekm: string;

    @Expose()
    namebm: string;

    @Expose()
    image: string;

    @Expose()
    description: string;

    @Expose()
    label: string;

    @Expose()
    isDefault: boolean;

    @Expose()
    isFeature: boolean;
}

export class CategoryUpdateDto {
    @Expose()
    parentId: string;
    
    @Expose()
    name: string;

    @Expose()
    namekm: string;

    @Expose()
    namebm: string;

    @Expose()
    image: string;

    @Expose()
    description: string;

    @Expose()
    label: string;

    @Expose()
    isDefault: boolean;

    @Expose()
    isFeature: boolean;
}

export class CategoryResponseDto {
    @Expose()
    id: string;
    
    @Expose()
    parentId: string;
    
    @Expose()
    name: string;

    @Expose()
    namekm: string;

    @Expose()
    namebm: string;

    @Expose()
    image: string;

    @Expose()
    description: string;

    @Expose()
    label: string;

    @Expose()
    @Transform(({ value }) => value === 1)
    isDefault: boolean;

    @Expose()
    isFeature: boolean;

    @Expose()
    parent: Category;
}
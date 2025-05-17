import { EntityRepository } from "typeorm";
import ProductVariant from "../entities/ProductVariant";
import ProductDescription from "../entities/ProductDescription";
import Utils from "../../../core/common/utils";
import BaseRepository from "../../../core/common/repositories/BaseRepository";
import Filter, { QueryBuilderRelationship } from "../../../core/common/filters";
import { RecordStatus } from "../../../core/setting/enums";

@EntityRepository(ProductVariant)
export default class ProductVariantRepository extends BaseRepository<ProductVariant> {

    entityName: string = "ProductVariant";

    selectField: string[] = [
        "id",
        "productId",
        "productAttributeValueId",
        "name",
        "image",
        "cost",
        "price",
        "wholePrice",
        "distributePrice",
        "factoryCost",
        "barcode",
        "isAutoGenerateBarcode",
        "sku",
        "isAutoGenerateSKU",
        "quantity",
        "reorderPoint",
        "status",
        "createdAt",
        "updatedAt"
    ];

    async findMany(filter: Filter): Promise<[ProductVariant[], number]> {
        const entities: string[] = ["Product", "ProductDescription", "ProductLocation"];

        const description = new ProductDescription();

        // language
        var conditionString = "";
        var conditionObject = {};

        if (filter.similar != null && Utils.isJsonString(filter.similar)) {
            const similarFilter = JSON.parse(filter.similar);
            // similar search
            if (similarFilter["value"] != null && similarFilter["value"] != "undefined") {
                let similarString = "";

                similarFilter["column"].forEach(columnSearch => {
                    // SEARCH SIMILAR WITH PRODUCT DESCRIPTION
                    if (columnSearch in description) {

                        let operatorOR = "";
                        if (similarString != "") {
                            operatorOR = " OR ";
                        }
                            
                        similarString += ` ${operatorOR} productDescriptions.${columnSearch} LIKE :key`;
                    }

                    // SEARCH SIMILAR WITH PRODUCT VARIANT
                    if (this.selectField.indexOf(columnSearch) > -1) {
                        let operatorOR = "";
                        if (similarString != "") {
                            operatorOR = " OR ";
                        }   
                        similarString += ` ${operatorOR} ${this.entityName}.${columnSearch} LIKE :key`;
                    }    
                });

                if (similarString != "") {
                    conditionString += " (" + similarString + ") ";
                    conditionObject["key"] = "%" + similarFilter["value"] + "%";
                }
            }
        }

        let relationShipCollection: QueryBuilderRelationship[] = [{
            entityName: entities[0],
            relation: "product",
            condition: ["Product.status = :productStatus", {productStatus: RecordStatus.Active}],
            subRelation: [
                {
                    name: "productDescriptions",
                    subRelationCondition: ["productDescriptions.languageId =:languageId", {languageId: filter.languageId}]
                }
            ],
        }];

        if (!filter.locationId) {
            const locationRelation: QueryBuilderRelationship  = {
                entityName: entities[2],
                relation: "productLocations",
                condition: [​`${entities[2]}.locationId = :locationId`, {locationId: filter.locationId}],
            };

            delete filter["locationId"]; // TO PROTECT FILTER DIRECT WITH TABLE PRODUCT VARAITN

            relationShipCollection.push(locationRelation);
        }

        return await this.findManyQueryBuilder(ProductVariant, relationShipCollection, filter, [conditionString, conditionObject]).getManyAndCount();
    }

    async findDetailByLocation(id: string, locationId: string): Promise<any> {

        const entities: string[] = [
            "Product",
            "ProductLocation"
        ];

        let relationShipCollection: QueryBuilderRelationship[] = [{
            entityName: entities[0],
            relation: "product",
            select: ["id", "serialType"]
        },
        {
            entityName: entities[1],
            relation: "productLocations",
            condition: [`${entities[1]}.locationId = :locationId`, {locationId}],
            relationType: "LEFT"
        }];

        return await this.findManyQueryBuilder(ProductVariant, relationShipCollection, {}, [`${this.entityName}.id = :id`, {id}]).getOne();
    }
}
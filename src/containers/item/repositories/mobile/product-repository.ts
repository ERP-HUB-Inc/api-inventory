import { EntityRepository } from "typeorm";
import * as _ from "lodash";
import Product from "../../entities/Product";
import BaseRepository from "../../../../core/common/repositories/BaseRepository";
import Filter from "../../../../core/common/filters";
import { RecordStatus } from "../../../../core/setting/enums";
import ProductVariant from "../../entities/ProductVariant";
import User from "../../../../core/setting/models/User";
import ProductLocation from "../../entities/ProductLocation";
import Location from "../../../../core/setting/models/Location";

@EntityRepository(Product)
export default class ProductRepository extends BaseRepository<Product> {

    entityName: string = "Product";

    async findOneByVariantId(productVariantId: string, user: User) {
        const productLocations: ProductLocation[] = await this.connection.createQueryBuilder(ProductLocation, "PL")
        .select([
            "locationId",
            "quantity"
        ])
        .where("PL.clientId = :clientId AND PL.productVariantId = :productVariantId", {clientId: user.clientId, productVariantId})
        .getRawMany();

        const result: ProductVariant = await this.connection.manager.getRepository(ProductVariant)
            .createQueryBuilder("pv")
            .innerJoin("pv.product", "p")
            .leftJoin("p.brand", "b")
            .innerJoin("p.category", "c")
            .innerJoin("p.unitOfMeasurement", "u")
            .select([
                "pv.id as id",
                "p.id as productId",
                "p.name as name",
                "p.namekm as namekm",
                "enableDescription",
                "b.name as brandName",
                "c.name as categoryName",
                "categoryId",
                "brandId",
                "enableDescription",
                "p.isAutoGenerateBarcode as isAutoGenerateBarcode",
                "type",
                "serialType",
                "pv.name as variantName",
                "cost",
                "price",
                "wholePrice",
                "distributePrice",
                "barcode",
                "p.image as image",
                "'0' as quantityOnHand",
                "'0' as quantity",
                "p.reorderPoint AS reorderPoint",
                "u.id as unitId",
                "u.name as unitName",
                "multiple"
            ])
            .where("pv.id = :productVariantId AND pv.clientId = :clientId", {productVariantId, clientId: user.clientId})
            .getRawOne();
        
        result["quantityOnHand"] = parseFloat(result["quantityOnHand"]);
        const currentLocation: ProductLocation = productLocations.find(productLocation => productLocation.locationId == user.locationId);
        const otherLocations: ProductLocation[] = productLocations.filter(productLocation => productLocation.locationId != user.locationId);
        if (currentLocation)  result["quantityOnHand"] = currentLocation.quantity;
        if (otherLocations.length > 0) result["quantity"] = _.sumBy(otherLocations, value => value.quantity) 

        return this.response(result);
    }

    async findDetailStockByVariantId(productVariantId: string, user: User) {
        const result = await this.connection.manager.getRepository(Location)
            .createQueryBuilder("L")
            .leftJoin("L.productLocations", "PL", "PL.clientId = :clientId AND PL.productVariantId = :productVariantId", {clientId: user.clientId, productVariantId})
            .select([
                "L.id AS id",
                "L.name AS name",
                "IFNULL(SUM(PL.quantity), 0) AS quantity"
            ])
            .where("L.clientId = :clientId", {clientId: user.clientId})
            .groupBy("L.id")
            .getRawMany();

        return this.response(result);
    }

    async getProducts(filter: Filter, viewStock?: string, isSearchingBarcode?: boolean) {
        let condition = "",
            orderStr = "",
            limitStr = "";

        if (filter.similar != null && filter.similar != "undefined") {
            if (isSearchingBarcode) {
                condition = ` pv.barcode = '${filter.similar}' `;
            } else if (filter.similar) {
                const similar = `'%${filter.similar}%'`;
                condition = ` (p.name LIKE ${similar} OR p.namekm LIKE ${similar} OR pv.barcode LIKE ${similar})`;
            }
        }

        if (filter.advanceFilter != null) {
            const advSize = filter.advanceFilter.length;
            if (condition) {
                condition = ` AND ${condition}`;
            }

            for (var i = 0; i < advSize; i++) {
                if (filter.advanceFilter[i].column == "categoryId") {
                    condition = ` ${condition} AND p.${filter.advanceFilter[i].column} = '${filter.advanceFilter[i].value}'`;
                } else {
                    condition = ` ${condition} AND p.${filter.advanceFilter[i].column} IN('${filter.advanceFilter[i].value}')`;
                }
            }
        }

        if (filter.limit == null) {
            filter.limit = this.limit;
        }

        limitStr = `LIMIT ${filter.limit}`;

        if (filter.offset >= 0) {
            limitStr = `LIMIT ${filter.offset}, ${filter.limit}`;
        }

        if (filter.sortField != null && filter.sortField != "" && filter.sortField != "undefined") {
            orderStr = `ORDER BY p.${filter.sortField} ${filter.sortOrder},pv.name`;
        } else {
            orderStr = `ORDER BY p.${this.defaultOrder[0]} ${this.defaultOrder[1]},pv.name`;
        }

        if (viewStock == "zeroStock") {
            condition = ` ${condition} AND pv.quantity = 0`;
        } else if (viewStock == "reorder") {
            condition = ` ${condition} AND pv.quantity <= p.reorderPoint AND pv.quantity > 0`;
        } else if (viewStock == "errorStock") {
            condition = ` ${condition} AND pv.quantity < 0`;
        }

        const results = await this.connection.query(`
            SELECT 
                p.id,
                p.categoryId,
                pv.id AS productVariantId,
                pv.barcode,
                p.name,
                p.namekm,
                p.namebm,
                p.enableDescription,
                pv.name as variantName,
                pv.image as variantImage,
                p.image,
                p.serialType,
                p.type,
                pv.cost,
                pv.price,
                pv.wholePrice,
                pv.distributePrice,
                p.productOption as isProductVariant,
                0 AS productOption,
                0 AS currentQuantity,
                u.name AS unit,
                u.id AS unitId,
                u.multiple AS multiple        
            FROM
                Product p 
                INNER JOIN ProductVariant pv ON pv.productId = p.id
                INNER JOIN Unit u ON u.id = p.stockUnitId
                -- LEFT JOIN ProductLocation pl ON pl.productVariantId = pv.id AND pl.locationId = ${filter.locationId}
                WHERE p.status = ${RecordStatus.Active} AND p.clientId = '${filter.clientId}'
                ${condition}
                ${orderStr}
                ${limitStr}
        `);

        return this.responses(results, results.length, filter.limit, filter.offset);
    }
}


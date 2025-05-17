import { EntityRepository } from "typeorm";
import * as _ from "lodash";
import BaseRepository from "../../../core/common/repositories/BaseRepository";
import PurchaseOrder from "../models/PurchaseOrder";
import Filter from "../../../core/common/filters";
import { RecordStatus } from "../../../core/setting/enums";
import Utils from "../../../core/common/utils";
import { PurchaseStepEnums } from "../enums";

@EntityRepository(PurchaseOrder)
export default class PurchaseOrderRepository extends BaseRepository<PurchaseOrder> {

    entityName: string = "PurchaseOrder";

    selectField: string[] = [
        "id",
        "clientId",
        "supplierId",
        "locationId",
        "userId",
        "receiverId",
        "referenceId",
        "deliveryDueDate",
        "invoiceNo",
        "name",
        "number",
        "shippingFee",
        "requestTotal",
        "returnTotal",
        "receiveTotal",
        "step",
        "type",
        "description",
        "status",
        "createdAt",
        "updatedAt"
    ];

    async findMany(filter: Filter): Promise<[PurchaseOrder[], number]> {
        const query = this.connection.createQueryBuilder<PurchaseOrder>(this.entityName, "PO")
        .innerJoin("PO.supplier", "Supplier")
        .innerJoin("PO.location", "Location")
        .leftJoin("PO.receiver", "Receiver")
        .select([
            "PO.id",
            "PO.number",
            "PO.referenceNo",
            "PO.name",
            "PO.requestTotal",
            "PO.receiveTotal",
            "PO.returnTotal",
            "PO.createdAt",
            "PO.step",
            "PO.description",
            "Location.id",
            "Location.name",
            "Receiver.id",
            "Receiver.fullName",
            "Supplier.id",
            "Supplier.name"
        ])
        .where("PO.clientId = :clientId AND PO.status = 1", {clientId: filter.clientId});

        if (filter.similar != null && Utils.isJsonString(filter.similar)) {
            const similarFilter = JSON.parse(filter.similar);
            
            if (!_.isEmpty(similarFilter["value"])) {
                query.andWhere(`(PO.number LIKE '%${similarFilter["value"]}%' OR PO.name LIKE '%${similarFilter["value"]}%' OR PO.invoiceNo LIKE '%${similarFilter["value"]}%')`)
            }
        }

        if (filter.advanceFilter != null) {
            const advSize = filter.advanceFilter.length;
            for (let i = 0; i < advSize; i++) {
                const filterValue = filter.advanceFilter[i].value,
                    filterColumn = filter.advanceFilter[i].column;

                if (Array.isArray(filterValue) && filterValue.length > 1) {
                    query.andWhere(`PO.${filterColumn} IN(${filterValue})`);
                } else {
                    query.andWhere(`PO.${filterColumn} = ${filterValue}`);
                }
            }
        }

        if (filter.rangFilter) {
            if (Utils.isJsonString(filter.rangFilter)) {
                const rangFilter = JSON.parse(filter.rangFilter);
                query.andWhere(`DATE_FORMAT(PO.createdAt, '%Y-%m-%d') >= :startDate AND DATE_FORMAT(PO.createdAt, '%Y-%m-%d') <= :endDate`, {startDate: rangFilter["value"][0], endDate: rangFilter["value"][1]});
            }
        }

        if (filter.offset >= 0) {
            query.offset(filter.offset);
        }

        if (filter.limit == null) {
            filter.limit = this.limit;
        }

        query.limit(filter.limit);

        query.orderBy("PO.createdAt", "DESC");

        return [await query.getMany(), await query.getCount()];
    }

    async detail(id: string, clientId: string): Promise<PurchaseOrder> {
        const query = this.connection.createQueryBuilder(PurchaseOrder, "PO")
        .leftJoin("PO.purchaseOrderEntries", "POE", "POE.status = 1")
        .innerJoin("PO.user", "User")
        .leftJoin("PO.receiver", "Receiver")
        .innerJoin("PO.location", "L")
        .select([
            "PO.id",
            "PO.locationId",
            "PO.name",
            "PO.description",
            "PO.number",
            "PO.referenceNo",
            "PO.supplierId",
            "PO.supplierName",
            "PO.requestTotal",
            "PO.returnTotal",
            "PO.receiveTotal",
            "PO.type",
            "PO.payTermNumber",
            "PO.payTermType",
            "PO.paymentDueDate",
            "PO.createdAt",
            "POE.id",
            "POE.productVariantId",
            "POE.productName",
            "POE.variantName",
            "POE.requestQuantity",
            "POE.receiveQuantity",
            "POE.returnQuantity",
            "POE.price",
            "POE.unitId",
            "POE.unitName",
            "POE.status",
            "L.id",
            "L.name",
            "User.id",
            "User.fullName",
            "Receiver.id",
            "Receiver.fullName",
            "PO.step"
        ])
        .where("PO.clientId = :clientId AND PO.id = :id", {clientId, id});

        const result = await query.getOne();

        result["POEntries"] = result.purchaseOrderEntries;

        delete result["purchaseOrderEntries"];

        return result;
    }

    async purchaseSummary(clientId: string, type: number = 1, rangFilter: string, similar: string) {
        const TYPE = {
            summary: 0,
            product: 1,
            supplier: 2
        };

        let groupByStr = "";

        const query = this.connection.createQueryBuilder(this.entityName, "PO")
        .innerJoin("PO.purchaseOrderEntries", "PE")
        .select("PO.createdAt", "date")
        .where("PO.clientId = :clientId AND PO.step = :step AND PO.status = :status", {clientId, step: PurchaseStepEnums.RECEIVED, status: RecordStatus.Active});

        if (TYPE.product == type) {
            query.innerJoin("PE.unitOfMeasurement", "Unit")
            .innerJoin("PO.supplier", "Supplier")
            .innerJoin("PE.productVariant", "ProductVariant")
            .innerJoin("ProductVariant.product", "Product")
            .addSelect("PO.id", "id")
            .addSelect("PO.createdAt", "date")
            .addSelect("ProductVariant.name", "variant")
            .addSelect("ProductVariant.barcode", "barcode")
            .addSelect("Product.productOption", "productOption")
            .addSelect("Product.name", "name")
            .addSelect("Product.namekm", "namekm")
            .addSelect("Supplier.name", "supplierName")
            .addSelect("Unit.name", "unit")
            .addSelect("PE.price", "price")
            .addSelect("SUM(PE.requestQuantity)", "quantity")
            .addSelect("ROUND(SUM(PE.requestQuantity * Unit.multiple * PE.price), 2)", "amount")
            .orderBy("PO.createdAt", "ASC");

            if (similar && Utils.isJsonString(similar)) {
                const similarFilter = JSON.parse(similar);
                query.andWhere(`(ProductVariant.barcode = '${similarFilter["value"]}'OR Product.name LIKE '%${similarFilter["value"]}%' OR Product.namekm LIKE '%${similarFilter["value"]}%')`);
            }

            groupByStr = "PE.id";
        } else if (TYPE.supplier == type) {
            groupByStr = "Supplier.id";

            query.innerJoin(`PO.supplier`, "Supplier")
            .addSelect("Supplier.id", "id")
            .addSelect("Supplier.name", "supplier")
            .addSelect("ROUND(SUM(PO.requestTotal), 2)", "amount")
            .orderBy("Supplier.name");
        }

        if (rangFilter) {
            const range = JSON.parse(rangFilter);
            const valueRange = range["value"];
            query.andWhere(`DATE_FORMAT(PO.createdAt,'%Y-%m-%d') >= :rangFilterStartValue AND DATE_FORMAT(PO.createdAt,'%Y-%m-%d') <= :rangFilterEndValue`, {rangFilterStartValue: valueRange[0], rangFilterEndValue: valueRange[1]});
        }

        if (groupByStr) query.groupBy(groupByStr);

        return await query.getRawMany();
    }
}
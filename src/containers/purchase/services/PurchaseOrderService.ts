import {
    getCustomRepository,
    getManager,
    EntityManager
} from "typeorm";
import {
    Service,
    Container
} from "typedi";
import PurchaseOrder from "../models/PurchaseOrder";
import PurchaseOrderEntryRepository from "../repositories/PurchaseOrderEntryRepository";
import { PurchaseStepEnums } from "../enums/PurchaseStepEnums";
import BaseService from "../../../core/common/services/BaseService";
import PurchaseOrderRepository from "../repositories/PurchaseOrderRepository";
import ProductRepository from "../../item/repositories/ItemRepository";
import LocationRepository from "../../../core/setting/repositories/LocationRepository";
import SupplierRepository from "../../item/repositories/SupplierRepository";
import PurchaseOrderEntry from "../models/PurchaseOrderEntry";
import {
    NotFoundError,
    BadRequestError
} from "../../../../exceptions";
import { HttpCode } from "../../../../enums/HttpCode";
import {
    RecordStatus
} from "../../../core/setting/enums";
import { PurchaseTypeEnums } from "../enums/PurchaseTypeEnums";
import Filter from "../../../core/common/filters";
import Utils from "../../../core/common/utils";
import StockService from "../../stock/services/StockService";
import { StockEnums } from "../../stock/enums/StockEnums";
import PurchaseOrderEnum  from "../enums/index";
import * as moment from "moment";
import UnitRepository from "../../item/repositories/UnitRepository";
import Unit from "../../item/entities/Unit";

@Service()
export default class PurchaseOrderService extends BaseService<PurchaseOrder> {
    protected repository: PurchaseOrderRepository;
    private purchaseOrderEntryRepository: PurchaseOrderEntryRepository;
    private locationRepository: LocationRepository;
    private supplierRepository: SupplierRepository;
    private productRepository: ProductRepository;
    private unitRepository: UnitRepository;
    private stockService: StockService;
    constructor() {
        super();
        this.repository = getCustomRepository(PurchaseOrderRepository);
        this.productRepository = getCustomRepository(ProductRepository);
        this.locationRepository = getCustomRepository(LocationRepository);
        this.supplierRepository = getCustomRepository(SupplierRepository);
        this.purchaseOrderEntryRepository = getCustomRepository(PurchaseOrderEntryRepository);
        this.stockService = Container.get(StockService);
        this.unitRepository = getCustomRepository(UnitRepository);
    }

    public async checkPONumber(number: string) {
        if (await this.checkExistPONumber(number)) {
            throw new BadRequestError("PO number is already exist", HttpCode.ALREADY_EXIST);
        }
        return number;
    }

    private async checkExistPONumber(number: string): Promise<boolean> {
        var result = await this.repository.findOneByFieldName({ number: number });
        return await (result != null);
    }

    public async saveRecordOutScope(manager: EntityManager, data: PurchaseOrder, condition?: object) {
        this.repository.clientId = data.clientId;
        this.locationRepository.clientId = data.clientId;
        this.supplierRepository.clientId = data.clientId;
        this.productRepository.clientId = data.clientId;
        this.purchaseOrderEntryRepository.clientId = data.clientId;

        let po = new PurchaseOrder();

        if (data.payTermNumber && data.payTermType){
            data["paymentDueDate"] = moment().add(Number(data.payTermNumber), PurchaseOrderEnum.PaymentTermType.DAY === data.payTermType ? "days" : "months").toDate();
        }

        if (condition == null || condition["id"] == null) {
            po = Object.assign(po, data);
            po.id = await this.repository.generateUUId();
            po.type = PurchaseTypeEnums.NORMAL;
        } else {
            po = await this.repository.findOneByFieldName({ id: condition["id"] });
            if (po == null) {
                throw new NotFoundError("PO not found", HttpCode.PO_NOT_FOUND);
            }
            po = Object.assign(po, data);
        }

        if (po.step == PurchaseStepEnums.RECEIVED) {
            po.receiverId = po.userId;
            po.receiveTotal = po.requestTotal;
        }

        delete data["number"];

        const resultPurchaseOrder = await manager.save(this.repository.entityName, po);

        const entryString = "POEntries";
        const entries = data[entryString];
        if (Array.isArray(entries)) {
            const lenght = entries.length;
            for (let i = 0; i < lenght; i++) {

                let entry: PurchaseOrderEntry;
                const productVariantId: string = entries[i].productVariantId;

                let unitMultiple = 1;
                const unit = await this.unitRepository.connection.createQueryBuilder(Unit, "U")
                .where("clientId = :clientId AND id = :id", {clientId: data.clientId, id: entries[i].unitId})
                .getOne();

                if (unit) {
                    unitMultiple = unit.multiple;
                }
                
                if (entries[i].id == null || entries[i].id == "") {
                    entry = new PurchaseOrderEntry();
                    entry.id = await this.purchaseOrderEntryRepository.generateUUId();
                    entry.clientId = data.clientId;
                    entry.purchaseOrderId = resultPurchaseOrder.id;
                    entry.productVariantId = productVariantId;
                    entry.productName = entries[i].productName;
                    entry.variantName = entries[i].variantName;
                    entry.requestQuantity = entries[i].requestQuantity;
                    entry.price = entries[i].price;
                    entry.receiveQuantity = data.step == PurchaseStepEnums.RECEIVED ? entries[i].requestQuantity : 0;
                    entry.returnQuantity = 0;
                    entry.unitId = entries[i].unitId;
                    entry.unitName = unit ? unit.name : "";
                    await manager.insert(PurchaseOrderEntry, entry);
                } else {
                    entry = new PurchaseOrderEntry();
                    entry = Object.assign(entry, entries[i]);
                    entry.unitName = unit ? unit.name : "";
                    entry.receiveQuantity = data.step == PurchaseStepEnums.RECEIVED ? entries[i].requestQuantity : 0;
                    await manager.update(PurchaseOrderEntry, {clientId: data.clientId, id: entries[i].id}, entry);
                }

                if (data.step == PurchaseStepEnums.RECEIVED) {
                    const productVariant = await manager.createQueryBuilder("ProductVariant", "PV")
                    .leftJoin("PV.productLocations", "PL")
                    .select([
                        "PV.id AS id",
                        "PV.productId AS productId",
                        "PV.quantity AS quantity",
                        "cost"
                    ])
                    .where("PV.clientId = :clientId AND PV.id = :productVariantId", {clientId: data.clientId, productVariantId})
                    .getRawOne();
                    
                    const retailQuantity = entry.requestQuantity * unitMultiple;
                    const totalWholeCost = entries[i].price * entry.requestQuantity;

                    await this.stockService.processProductStock(
                        manager,
                        productVariant,
                        data.locationId,
                        retailQuantity,
                        data.userId,
                        totalWholeCost / retailQuantity,
                        StockEnums.PO,
                        resultPurchaseOrder.id,
                        resultPurchaseOrder.number,
                        data.clientId);
                }

                data[entryString][i] = entry;
            }
            data = resultPurchaseOrder;
        }

        return data;
    }

    private async saveRecord(data: PurchaseOrder, condition?: object) {
        await getManager().transaction(async manager => {
            await this.saveRecordOutScope(manager, data, condition);
        });

        return data;
    }

    async create(data: PurchaseOrder) {
        return this.response(await this.saveRecord(data));
    }

    async update(data: PurchaseOrder, condition: object) {
        return this.response(await this.saveRecord(data, condition));
    }

    async archive(data: string) {

        const ids = data.split(",");
        const length = ids.length;
        for (var i = 0; i < length; i++) {
            this.repository.clientId = this.clientId;
            const po = await this.repository.findOneByFieldName({ id: ids[i] });
            if (po != null) {
                if (po.step != PurchaseStepEnums.DRAFT) {
                    if (po.step == PurchaseStepEnums.PROCESS || po.step == PurchaseStepEnums.RECEIVED) {
                        throw new BadRequestError("This PO cannot be archived", HttpCode.FORBIDEN_STEP_PROCESS);
                    }
                }
            }
        }


        this.repository.clientId = this.clientId;
        return await this.repository.archive(data);
    }

    async detail(id: string, clientId: string) {
        const result = await this.repository.detail(id, clientId);
        return this.response(result);
    }

    async purchaseSummary(clientId: string, type: number, rangFilter: string, similar: string) {
        this.repository.clientId = this.clientId;
        return this.responses(await this.repository.purchaseSummary(clientId, type, rangFilter, similar));
    }

    async purchaseReport(filter: Filter) {
        const query = this.repository.connection.createQueryBuilder(this.repository.entityName, "PO")
        .leftJoin("PO.reference", "Reference")
        .innerJoin("PO.supplier", "Supplier")
        .innerJoin("PO.location", "Location")
        .innerJoin("PO.receiver", "Receiver")
        .select([
            "PO.id AS id",
            "PO.name AS name",
            "PO.number AS number",
            "Location.name AS location",
            "Supplier.name AS supplier",
            "Receiver.fullName AS receiver",
            "Reference.number AS referenceNo",
            "PO.step AS step",
            "PO.requestTotal AS requestTotal",
            "PO.receiveTotal AS receiveTotal",
            "PO.returnTotal AS returnTotal",
            "PO.createdAt AS createdAt"
        ])
        .where("PO.clientId = :clientId AND PO.status <> :status AND PO.step = :step", {clientId: filter.clientId, status: RecordStatus.Archive, step: PurchaseStepEnums.RECEIVED});

        if (filter.similar != null && Utils.isJsonString(filter.similar)) {
            const similarFilter = JSON.parse(filter.similar);
            query.andWhere(`(PO.name LIKE '%${similarFilter['value']}%' OR PO.number LIKE '%${similarFilter['value']}%')`);
        }

        if (filter.rangFilter) {
            const range = JSON.parse(filter.rangFilter),
                valueRange = range["value"];
            query.andWhere("DATE_FORMAT(PO.createdAt, '%Y-%m-%d') >= :start AND DATE_FORMAT(PO.createdAt, '%Y-%m-%d') <= :end", {start: valueRange[0], end: valueRange[1]})
        }

        if (filter.advanceFilter) {
            filter.advanceFilter.forEach(row => {
                query.andWhere(`PO.${row.column} = '${row.value}'`)
            });
        }

        query.orderBy("PO.createdAt", "DESC");

        return this.responses(await query.getRawMany(), await query.getCount());
    }
}
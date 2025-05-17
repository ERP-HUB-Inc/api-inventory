import { getCustomRepository, getManager } from "typeorm";
import { Service } from "typedi";
import BaseService from "../../../core/common/services/BaseService";
import PurchaseOrder from "../models/PurchaseOrder";
import PurchaseOrderRepository from "../repositories/PurchaseOrderRepository";
import { NotFoundError } from "../../../../exceptions";
import { HttpCode } from "../../../../enums/HttpCode";
import PurchaseOrderEntryRepository from "../repositories/PurchaseOrderEntryRepository";
import { PurchaseStepEnums } from "../enums/PurchaseStepEnums";
import { Container } from 'typedi';
import StockService from "../../stock/services/StockService";
import { StockEnums } from "../../stock/enums/StockEnums";
import PurchaseOrderService from "./PurchaseOrderService";
import PurchaseOrderEntry from "../models/PurchaseOrderEntry";
import UnitRepository from "../../item/repositories/UnitRepository";

@Service()
export default class ReceiveOrderService extends BaseService<PurchaseOrder> {
    
    private purchaseOrderRepository: PurchaseOrderRepository;
    private purchaseOrderEntryRepository: PurchaseOrderEntryRepository;
    private stockService: StockService;
    private purchaseOrderService: PurchaseOrderService;
    private unitRepository: UnitRepository;

    constructor() {
        super();
        this.repository = getCustomRepository(PurchaseOrderRepository);
        this.purchaseOrderRepository = getCustomRepository(PurchaseOrderRepository);
        this.purchaseOrderEntryRepository = getCustomRepository(PurchaseOrderEntryRepository);
        this.stockService = Container.get(StockService);
        this.purchaseOrderService = Container.get(PurchaseOrderService);
        this.unitRepository = getCustomRepository(UnitRepository);
    }

    private async saveRecord(data: PurchaseOrder, condition?: object) {

        await getManager().transaction(async manager => {
            this.repository.clientId = this.clientId;
            this.repository.deviceNumber = this.deviceNumber;
            this.purchaseOrderEntryRepository.deviceNumber = this.deviceNumber;
            this.purchaseOrderService.clientId = this.clientId;
            this.purchaseOrderService.deviceNumber = this.deviceNumber;

            var isPartial = false;
            let po = new PurchaseOrder();
            if (condition == null || condition["id"] == null) {
                throw new NotFoundError("PO is not found", HttpCode.NotFound);
            } else {

                po = await this.repository.findOneByFieldName(condition);
                po = Object.assign(po, data);
            }

            // SAVE PO
            const PONumber = po.number;
            po.step = PurchaseStepEnums.RECEIVED;
            po.receiverId = data.userId;
            const resultPurchaseOrder = await manager.save(this.repository.entityName, po);

            var partialEntries: PurchaseOrderEntry[] = [];
            var partialTotal = 0;
            const entryString = "POEntries";
            const entries = data[entryString];
            if (entryString in data && Array.isArray(entries)) {
                const lenght = entries.length;
                for (var i = 0; i < lenght; i++) {
                    let entry = await this.purchaseOrderEntryRepository.findOneByFieldName({ id: entries[i].id });

                    if(entries[i].receiveQuantity < entry.requestQuantity) {
                        var partialEntry = new PurchaseOrderEntry();
                        partialEntry = Object.assign(partialEntry, entries[i]);
                        partialEntry.requestQuantity = entry.requestQuantity - entries[i].receiveQuantity;
                        partialEntry.receiveQuantity = 0;
                        partialEntry.returnQuantity = 0;
                        partialEntry.price = entry.price;
                        partialTotal+= partialEntry.requestQuantity * entry.price;
                        partialEntry.unitId = entry.unitId;
                        delete partialEntry["id"]; // PROTECT UPDATE EXISTING RECORD
                        partialEntries.push(partialEntry);
                        isPartial = true;
                    }
                    
                    this.purchaseOrderEntryRepository.clientId = data.clientId;

                    let purchaseOrderEntry = new PurchaseOrderEntry();
                    purchaseOrderEntry = Object.assign(purchaseOrderEntry, entry);
                    purchaseOrderEntry.purchaseOrderId = resultPurchaseOrder.id;
                    purchaseOrderEntry.productVariantId = entries[i].productVariantId;
                    purchaseOrderEntry.receiveQuantity = entries[i].receiveQuantity <= entry.requestQuantity ? entries[i].receiveQuantity : entry.requestQuantity;

                    const resultEntry = await manager.save(this.purchaseOrderEntryRepository.entityName, purchaseOrderEntry);
                    entries[i] = resultEntry;

                    let unitMultiple = 1;
                    if(entries[i].unitId != null && entries[i].unitId != "") {
                        const unitResult = await this.unitRepository.findOneByFieldName({id: entries[i].unitId});
                        if (unitResult == null) {
                            throw new NotFoundError("Unit not found", HttpCode.PRODUCT_UNIT_NOT_FOUND);
                        }

                        unitMultiple = unitResult.multiple;
                    }

                    const productVariant = await manager.createQueryBuilder("ProductVariant", "PV")
                    .leftJoin("PV.productLocations", "PL")
                    .select([
                        "PV.id AS id",
                        "PV.quantity AS quantity",
                        "cost"
                    ])
                    .where("PV.clientId = :clientId AND PV.id = :productVariantId", {clientId: this.clientId, productVariantId: entries[i].productVariantId})
                    .getRawOne();
                    
                    // Log
                    const retailQuantity = purchaseOrderEntry.receiveQuantity * unitMultiple;
                    const totalWholeCost = entries[i].price * purchaseOrderEntry.receiveQuantity;
                    this.stockService.clientId = data.clientId;
                    this.stockService.deviceNumber = this.deviceNumber;
                    await this.stockService.processProductStock(
                        manager,
                        productVariant,
                        data.locationId,
                        retailQuantity,
                        data.userId,
                        totalWholeCost / retailQuantity,
                        StockEnums.PO,
                        resultPurchaseOrder.id,
                        PONumber,
                        data.clientId);
                }
            }

            if(isPartial && data.isReceivePartial) {
                var partialPO = new PurchaseOrder();
                partialPO = Object.assign(partialPO, data);
                partialPO.name = `${partialPO.name} [Continued]`;
                partialPO.number = null;
                partialPO.step = PurchaseStepEnums.PROCESS;
                partialPO.locationId = po.locationId;
                partialPO.referenceId = data.id;
                partialPO.requestTotal = partialTotal;
                partialPO.receiveTotal = 0;
                partialPO.shippingFee = 0;
                partialPO.returnTotal = 0;
                partialPO.receiverId = null;
                partialPO["POEntries"] = partialEntries;
                partialPO.clientId = data.clientId;
                await this.purchaseOrderService.saveRecordOutScope(manager, partialPO);
            }
        });

        return data;
    }

    async update(data: PurchaseOrder, condition: object) {
        return this.response(await this.saveRecord(data, condition));
    }

    async detail(id: string, languageId: string) {
        this.purchaseOrderRepository.clientId = this.clientId;
        const result = await this.purchaseOrderRepository.detail(id, languageId);
        return this.response(result);
    }
}
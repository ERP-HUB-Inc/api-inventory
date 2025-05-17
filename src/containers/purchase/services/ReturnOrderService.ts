import { getCustomRepository, getManager } from "typeorm";
import { Service } from "typedi";
import BaseService from "../../../core/common/services/BaseService";
import PurchaseOrder from "../models/PurchaseOrder";
import PurchaseOrderRepository from "../repositories/PurchaseOrderRepository";
import PurchaseOrderEntryRepository from "../repositories/PurchaseOrderEntryRepository";
import { Container } from 'typedi';
import StockService from "../../stock/services/StockService";
import { HttpCode } from "../../../../enums/HttpCode";
import { NotFoundError } from "../../../../exceptions";
import { PurchaseStepEnums } from "../enums/PurchaseStepEnums";
import { PurchaseTypeEnums } from "../enums/PurchaseTypeEnums";
import ClientAutoNumberService from "../../../core/setting/services/ClientAutoNumberService";
import { AutoNumberType } from "../../../core/setting/enums";
import { StockEnums } from "../../stock/enums/StockEnums";
import PurchaseOrderEntry from "../models/PurchaseOrderEntry";

@Service()
export default class PurchaseOrderService extends BaseService<PurchaseOrder> {

    private purchaseOrderRepository: PurchaseOrderRepository;
    private purchaseOrderEntryRepository: PurchaseOrderEntryRepository;
    private stockService: StockService = null;
    private clientAutoNumberService: ClientAutoNumberService = null;

    constructor() {
        super();
        this.repository = getCustomRepository(PurchaseOrderRepository);
        this.purchaseOrderRepository = getCustomRepository(PurchaseOrderRepository);
        this.purchaseOrderEntryRepository = getCustomRepository(PurchaseOrderEntryRepository);
        this.stockService = Container.get(StockService);
        this.clientAutoNumberService = Container.get(ClientAutoNumberService);
    }

    private async checkExistPONumber(number: string): Promise<boolean> {
        var result = await this.repository.findOneByFieldName({ number: number });
        return await (result != null);
    }
    private async saveRecord(data: PurchaseOrder, condition?: object) {
        await getManager().transaction(async manager => {
            this.repository.clientId = this.clientId;
            this.repository.deviceNumber = this.deviceNumber;
            this.purchaseOrderEntryRepository.clientId = this.clientId;
            this.purchaseOrderEntryRepository.deviceNumber = this.deviceNumber;
            this.stockService.clientId = this.clientId;
            this.stockService.deviceNumber = this.deviceNumber;
            this.clientAutoNumberService.clientId = this.clientId;

            let po = new PurchaseOrder();
            if (condition == null || condition["id"] == null) {
                throw new NotFoundError("PO is not found", HttpCode.NotFound);
            } else {

                po = await this.repository.findOneByFieldName(condition);
                if (po == null) {
                    throw new NotFoundError("PO is not found", HttpCode.NotFound);
                }

                if (po.step != PurchaseStepEnums.RECEIVED) {
                    throw new NotFoundError("This PO cannot change becuase of forbiden step", HttpCode.FORBIDEN_STEP_PROCESS);
                }

                po = Object.assign(po, data);
            }

            po.number = await this.clientAutoNumberService.getAutoNumber(manager, this.clientId, AutoNumberType.PURCHASE);

            if (po.number == null || po.number == "") {
                throw new NotFoundError("PO number is not allowed empty", HttpCode.IS_EMPTY);
            }
            else if (await this.checkExistPONumber(po.number)) {
                throw new NotFoundError("PO number is already exist", HttpCode.ALREADY_EXIST);
            }

            // SAVE PO
            //data.id = await this.repository.generateUUId();
            po.referenceId = po.id;
            po.id = await this.repository.generateUUId();
            po.step = PurchaseStepEnums.RETURN;
            po.type = PurchaseTypeEnums.RETURN;

            await this.clientAutoNumberService.updateLast(manager, this.clientId, po.number, AutoNumberType.PURCHASE);

            const resultPurchaseOrder = await manager.save(this.repository.entityName, po);

            const entryString = "POEntries";
            const entries = data[entryString];
            if (entryString in data && Array.isArray(entries)) {
                const lenght = entries.length;
                for (var i = 0; i < lenght; i++) {

                    let oldEntry = await this.purchaseOrderEntryRepository.findOneByFieldName({ id: entries[i].id });
                    
                    // TO PROTECT USER RETURN QUANTITY GREATER THAN RECEIVE
                    if (entries[i].returnQuantity <= oldEntry.receiveQuantity) {
                        await manager.save(this.purchaseOrderEntryRepository.entityName, oldEntry);

                        let newEntry = new PurchaseOrderEntry();
                        newEntry.id = await this.purchaseOrderEntryRepository.generateUUId(i + 1);
                        newEntry.purchaseOrderId = resultPurchaseOrder.id;
                        newEntry.productVariantId = entries[i].productVariantId;
                        newEntry.requestQuantity = 0;
                        newEntry.receiveQuantity = 0;
                        newEntry.returnQuantity = entries[i].returnQuantity;
                        newEntry.price = oldEntry.price;

                        const resultnEWEntry = await manager.save(this.purchaseOrderEntryRepository.entityName, newEntry);
                        entries[i] = resultnEWEntry;

                        await this.stockService.returnProductStock(
                            manager,
                            entries[i].productVariantId,
                            resultPurchaseOrder.locationId,
                            newEntry.receiveQuantity,
                            resultPurchaseOrder.userId
                        );
                    }
                }
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
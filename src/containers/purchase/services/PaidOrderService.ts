import { getCustomRepository, getManager } from "typeorm";
import { Service } from "typedi";
import BaseService from "../../../core/common/services/BaseService";
import PurchaseOrder from "../models/PurchaseOrder";
import PurchaseOrderRepository from "../repositories/PurchaseOrderRepository";
import PurchaseOrderEntryRepository from "../repositories/PurchaseOrderEntryRepository";
import { PurchaseStepEnums } from "../enums/PurchaseStepEnums";
import { NotFoundError } from "../../../../exceptions";
import { HttpCode } from "../../../../enums/HttpCode";

@Service()
export default class PaidOrderService extends BaseService<PurchaseOrder> {

    private purchaseOrderRepository: PurchaseOrderRepository;
    private purchaseOrderEntryRepository: PurchaseOrderEntryRepository;
    constructor() {
        super();
        this.repository = getCustomRepository(PurchaseOrderRepository);
        this.purchaseOrderRepository = getCustomRepository(PurchaseOrderRepository);
        this.purchaseOrderEntryRepository = getCustomRepository(PurchaseOrderEntryRepository);
    }

    private async saveRecord(data: PurchaseOrder, condition?: object) {
        await getManager().transaction(async manager => {
            this.repository.clientId = this.clientId;

            if (condition == null || condition["id"] == null) {
                throw new NotFoundError("PO is not found", HttpCode.NotFound);
            } else {
                
                let po = await this.repository.findOneByFieldName(condition);
                if (po == null) {
                    throw new NotFoundError("PO is not found", HttpCode.NotFound);
                }

                if (po.step != PurchaseStepEnums.RECEIVED) {
                    throw new NotFoundError("This PO cannot change becuase of forbiden step", HttpCode.FORBIDEN_STEP_PROCESS);
                }

                // SAVE PO 
                po.step = PurchaseStepEnums.PAID;
                await manager.save(this.repository.entityName, po);
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
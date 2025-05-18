import StockTransferEntryRepository from '../repositories/StockTransferEntryRepository';
import StockTransferRepository from '../repositories/StockTransferRepository';
import BaseService from '../../../core/common/services/BaseService';
import UnitRepository from '../../item/repositories/UnitRepository';
import { TransferStepEnums } from '../enums/TransferStepEnums';
import { getCustomRepository, getManager } from 'typeorm';
import { NotFoundError } from '../../../../exceptions';
import { HttpCode } from '../../../../enums/HttpCode';
import { StockTransfer } from '../entities';
import { Service, Container } from 'typedi';
import StockService from './StockService';
import * as moment from 'moment';

@Service()
export default class ApproveTransferService extends BaseService {
  private stockTransferEntryRepository: StockTransferEntryRepository;
  private unitRepository: UnitRepository;
  private stockService: StockService;
  constructor() {
    super();
    this.repository = getCustomRepository(StockTransferRepository);
    this.stockTransferEntryRepository = getCustomRepository(
      StockTransferEntryRepository,
    );
    this.unitRepository = getCustomRepository(UnitRepository);
    this.stockService = Container.get(StockService);
  }

  private async saveRecord(data: StockTransfer, condition?: object) {
    await getManager().transaction(async (manager) => {
      this.repository.clientId = data.clientId;
      this.unitRepository.clientId = data.clientId;
      this.stockTransferEntryRepository.clientId = data.clientId;

      if (data.locationId == data.fromLocationId) {
        throw new NotFoundError(
          "You was created this transfer, so we don't allow to receive",
          HttpCode.INVALID_LOCATION_FOR_RECEIVE,
        );
      }

      let stockTransferData: StockTransfer;
      if (condition != null && condition['id'] != null) {
        stockTransferData = await this.repository.findOneByFieldName(condition);
        if (
          stockTransferData == null ||
          stockTransferData.step != TransferStepEnums.PROCESS
        ) {
          throw new NotFoundError(
            'Transfer is not found',
            HttpCode.TRANSFER_NOT_FOUND,
          );
        }
      }

      stockTransferData.receiveDate = moment(
        moment().format('YYYY-MM-DD h:mm:ss A'),
      ).toDate();
      stockTransferData.step = TransferStepEnums.RECEIVED;
      stockTransferData.receiverId = data.userId;
      const resultStockTransfer = await manager.save(
        this.repository.entityName,
        stockTransferData,
      );

      const entryString = 'transferEntries';
      const entries = data[entryString];
      if (Array.isArray(entries)) {
        const lenght = entries.length;
        for (var i = 0; i < lenght; i++) {
          let unitMultiple = 1;

          if (entries[i].unitId != null && entries[i].unitId != '') {
            const unitResult = await this.unitRepository.findOneByFieldName({
              id: entries[i].unitId,
            });
            if (unitResult == null) {
              throw new NotFoundError(
                'Unit not found',
                HttpCode.PRODUCT_UNIT_NOT_FOUND,
              );
            }
            unitMultiple = unitResult.multiple;
          }

          let entry =
            await this.stockTransferEntryRepository.findOneByFieldName({
              id: entries[i].id,
            });
          entry.receiveQuantity =
            entries[i].receiveQuantity <= entry.transferQuantity
              ? entries[i].receiveQuantity * unitMultiple
              : entries[i].transferQuantity * unitMultiple;
          const resultStockTransferEntry = await manager.save(
            this.stockTransferEntryRepository.entityName,
            entry,
          );
          entries[i] = resultStockTransferEntry;

          // Log
          this.stockService.clientId = data.clientId;
          await this.stockService.transferProductStock(
            manager,
            entry.productVariantId,
            resultStockTransfer.fromLocationId,
            resultStockTransfer.toLocationId,
            entry.receiveQuantity,
            resultStockTransfer.userId,
            resultStockTransfer.number,
            i,
          );
        }
      }

      return data;
    });
  }

  async update(data: StockTransfer, condition: object) {
    return this.response(await this.saveRecord(data, condition));
  }
}

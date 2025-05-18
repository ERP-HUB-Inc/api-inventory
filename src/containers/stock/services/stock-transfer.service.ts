import MovementLogRepository from '../../../inventory/stock/repositories/MovementLogRepository';
import ClientAutoNumberService from '../../../core/setting/services/ClientAutoNumberService';
import ProductVariantRepository from '../../item/repositories/ProductVariantRepository';
import LocationRepository from '../../../core/setting/repositories/LocationRepository';
import { NotFoundError, BadRequestError } from '../../../../exceptions';
import StockTransferRepository from '../repositories/StockTransferRepository';
import { StockTransfer, StockTransferEntry, MovementLog } from '../entities';
import BaseService from '../../../core/common/services/BaseService';
import ProductLocation from '../../item/entities/ProductLocation';
import { getCustomRepository, getManager } from 'typeorm';
import ProductVariant from '../../item/entities/ProductVariant';
import { TransferStepEnums } from '../enums/TransferStepEnums';
import { ModelStatus } from '../../../../enums/ModelStatus';
import { HttpCode } from '../../../../enums/HttpCode';
import Filter from '../../../core/common/filters';
import { StockEnums } from '../enums/StockEnums';
import Container, { Service } from 'typedi';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';
import * as _ from 'lodash';

@Service()
export default class StockTransferService extends BaseService {
  private locationRepository: LocationRepository;
  private productVariantRepository: ProductVariantRepository;
  private stockTransferRepository: StockTransferRepository;
  private movementLogRepository: MovementLogRepository;
  constructor() {
    super();
    this.productVariantRepository = getCustomRepository(
      ProductVariantRepository,
    );
    this.repository = getCustomRepository(StockTransferRepository);
    this.stockTransferRepository = getCustomRepository(StockTransferRepository);
    this.locationRepository = getCustomRepository(LocationRepository);
    this.movementLogRepository = getCustomRepository(MovementLogRepository);
  }

  private async saveRecord(data: StockTransfer, condition?: object) {
    await getManager().transaction(async (manager) => {
      this.locationRepository.clientId = data.clientId;
      this.productVariantRepository.clientId = data.clientId;
      let transferStep: number = data.step;
      let stockTransferId: string;

      let stock: StockTransfer = new StockTransfer();
      if (condition == null || _.isEmpty(condition['id'])) {
        stockTransferId = uuidv4();
        stock.id = stockTransferId;
        stock.clientId = data.clientId;
        stock.userId = data.userId;
        stock.number = await Container.get(
          ClientAutoNumberService,
        ).getStockTransferNumber(manager, data.clientId);
        stock.description = data.description;
        stock.fromLocationId = data.fromLocationId;
        stock.toLocationId = data.toLocationId;
        stock.deliveryDueDate = data.deliveryDueDate;
        stock.step = transferStep;
        if (transferStep == TransferStepEnums.RECEIVED) {
          stock.receiveDate = moment().toDate();
          stock.receiverId = data.userId;
        }
        await manager.insert(StockTransfer, stock);
      } else {
        delete stock.status;

        stock.description = data.description;
        stock.fromLocationId = data.fromLocationId;
        stock.toLocationId = data.toLocationId;
        stock.deliveryDueDate = data.deliveryDueDate;
        stock.receiverId = data.receiverId;
        stock.step = transferStep;

        if (transferStep == TransferStepEnums.RECEIVED) {
          stock.receiveDate = moment().toDate();
          stock.receiverId = data.userId;
        }

        await manager.update(
          StockTransfer,
          { id: condition['id'], clientId: data.clientId },
          stock,
        );

        stockTransferId = condition['id'];
      }

      const entryString = 'transferEntries';
      const entries = data[entryString];
      if (Array.isArray(entries)) {
        const promises = entries.map(async (stockTransferEntry) => {
          const transferQuantity: number = stockTransferEntry.transferQuantity,
            productVariantId: string = stockTransferEntry.productVariantId;

          const sourceProductLocation = await this.repository.connection
            .createQueryBuilder(ProductVariant, 'PV')
            .leftJoin(
              'PV.productLocations',
              'PL',
              'PL.locationId = :locationId',
              { locationId: stock.fromLocationId },
            )
            .select([
              'IFNULL(PL.quantity, 0) AS quantity',
              'productId',
              'PV.name AS name',
              'barcode',
              'cost',
            ])
            .where('PV.id = :productVariantId AND PV.clientId = :clientId', {
              productVariantId,
              clientId: data.clientId,
            })
            .getRawOne();

          let entry: StockTransferEntry = new StockTransferEntry();
          if (_.isEmpty(stockTransferEntry.id)) {
            entry = new StockTransferEntry();
            entry.id = uuidv4();
            entry.stockTransferId = stockTransferId;
            entry.clientId = data.clientId;
            entry.productVariantId = stockTransferEntry.productVariantId;
            entry.productName = stockTransferEntry.productName;
            entry.variantName = stockTransferEntry.variantName;
            entry.barcode = stockTransferEntry.barcode;
            entry.transferQuantity = transferQuantity;
            entry.unitId = stockTransferEntry.unitId;
            entry.receiveQuantity =
              stock.step == TransferStepEnums.RECEIVED ? transferQuantity : 0;
            entry.price = sourceProductLocation['cost'];
            entry.status = _.isEmpty(stockTransferEntry.status)
              ? ModelStatus.ACTIVE
              : stockTransferEntry.status;
            await manager.insert(StockTransferEntry, entry);
          } else {
            entry.transferQuantity = transferQuantity;
            entry.price = stockTransferEntry.cost;
            entry.status = stockTransferEntry.status;
            await manager.update(
              StockTransferEntry,
              { stockTransferId, id: stockTransferEntry.id },
              entry,
            );
          }

          if (transferStep == TransferStepEnums.RECEIVED) {
            const receiveProductLocation: ProductLocation =
              await this.repository.connection
                .createQueryBuilder(ProductLocation, 'PL')
                .select(['productVariantId', 'quantity'])
                .where(
                  'PL.locationId = :locationId AND PL.productVariantId = :productVariantId',
                  { locationId: stock.toLocationId, productVariantId },
                )
                .getRawOne();

            let receiveQuantity: number = transferQuantity;

            if (receiveProductLocation) {
              const newQuantity: number =
                receiveQuantity + receiveProductLocation.quantity;
              await manager.update(
                ProductLocation,
                { productVariantId, locationId: stock.toLocationId },
                { quantity: newQuantity },
              );
            } else {
              const newProductLocation: ProductLocation = new ProductLocation();
              newProductLocation.id = await this.repository.generateUUId();
              newProductLocation.locationId = stock.toLocationId;
              newProductLocation.clientId = stock.clientId;
              newProductLocation.productVariantId = productVariantId;
              newProductLocation.quantity = receiveQuantity;
              await manager.insert(ProductLocation, newProductLocation);
            }

            let leftQuantity: number = sourceProductLocation['quantity'];
            leftQuantity = leftQuantity - transferQuantity;
            await manager.update(
              ProductLocation,
              { productVariantId, locationId: stock.fromLocationId },
              { quantity: leftQuantity },
            );

            const movementLog: MovementLog = new MovementLog();
            movementLog.id = uuidv4();
            movementLog.clientId = data.clientId;
            movementLog.userId = data.userId;
            movementLog.locationId = stock.fromLocationId;
            movementLog.entityId = stock.id;
            movementLog.productId = sourceProductLocation['productId'];
            movementLog.productVariantId = productVariantId;
            movementLog.productVariant = sourceProductLocation.name;
            movementLog.quantity = leftQuantity;
            movementLog.oldQuantity = sourceProductLocation
              ? sourceProductLocation.quantity
              : 0;
            movementLog.type = 'TRANSFER_OUT';

            await this.movementLogRepository.log(
              movementLog,
              StockEnums.TRANSFER,
              manager,
            );

            movementLog.id = uuidv4();
            movementLog.locationId = stock.toLocationId;
            movementLog.type = 'TRANSFER_IN';
            movementLog.quantity = receiveQuantity;
            movementLog.oldQuantity = receiveProductLocation
              ? receiveProductLocation.quantity
              : 0;
            await this.movementLogRepository.log(
              movementLog,
              StockEnums.TRANSFER,
              manager,
            );
          }
        });

        await Promise.all(promises);
      }

      return data;
    });
  }

  async cancelStockTransfer(condition?: object) {
    this.repository.clientId = this.clientId;

    const stockTransfer = await this.repository.findOneByFieldName(condition, [
      'step',
    ]);
    if (stockTransfer == null) {
      throw new NotFoundError(
        'Transfer is not found',
        HttpCode.TRANSFER_NOT_FOUND,
      );
    }

    if (stockTransfer.step == TransferStepEnums.RECEIVED) {
      throw new BadRequestError(
        'This transfer has been received',
        HttpCode.FORBIDEN_STEP_PROCESS,
      );
    }

    return await super.update({ step: TransferStepEnums.CANCEL }, condition);
  }

  async findManyOfReceiveList(filter: Filter) {
    this.stockTransferRepository.clientId = filter.clientId;
    const results = await this.stockTransferRepository.findManyOfReceiveList(
      filter,
    );
    return this.responses(results[0], results[1], filter.limit, filter.offset);
  }

  async create(data: StockTransfer) {
    return this.response(await this.saveRecord(data));
  }

  async update(data: StockTransfer, condition: object) {
    return this.response(await this.saveRecord(data, condition));
  }

  async detail(id: string, languageId: string) {
    this.stockTransferRepository.clientId = this.clientId;
    const result = await this.stockTransferRepository.detail(id, languageId);
    return this.response(result);
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { FilterDto } from '@common/dto';
import * as _ from 'lodash';
import { StockAdjustment, StockAdjustmentEntry } from '../entities';
import { StockAdjustmentStepEnums } from '../enums/stock-adjustment-step.enums';
import StockService from './stock.service';
import { HttpCode } from '../enums/http-code.enum';
import { ProductVariant } from '@item/entities/product-variant.entity';
import StockAdjustmentRepository from '../repositories/stock-adjustment.repository';
import StockAdjustmentEntryRepository from '../repositories/stock-adjustment-entry.repository';
import UnitRepository from 'containers/item/repositories/unit.repository';
import MovementLogRepository from 'containers/stock-movement/repositories/movement-log.repository';

@Injectable()
export class StockAdjustmentService {
  private readonly stockAdjustmentRepository: StockAdjustmentRepository;
  private readonly stockAdjustmentEntryRepository: StockAdjustmentEntryRepository;
  private unitRepository: UnitRepository;
  private movementLogRepository: MovementLogRepository;

  /**
   * Saves or updates a stock adjustment and its entries.
   * Also handles inventory quantity updates if step is APPROVED.
   */
  private async saveRecord(data: StockAdjustment, condition?: object) {
    let id = null;

    await getManager().transaction(async (manager) => {
      let stock = new StockAdjustment();
      let locationId = data.locationId;

      // Create new stock adjustment if no condition provided
      if (condition == null || condition['id'] == null) {
        stock = Object.assign(stock, data);
        id = uuidv4();
        stock.id = id;
        stock.approverId =
          stock.step == StockAdjustmentStepEnums.APPROVED ? data.userId : '';
        await manager.insert(StockAdjustment, stock);
      } else {
        // Update existing stock adjustment
        stock = await this.stockAdjustmentRepository.findOneByFieldName({
          id: condition['id'],
        });

        // Only allow update if the step is REQUESTED
        if (stock.step != StockAdjustmentStepEnums.REQUESTED) {
          throw new BadRequestException({
            message: 'Forbidden step for update',
            errorCode: HttpCode.FORBIDDEN_STEP_PROCESS,
          });
        }

        stock = Object.assign(stock, data);
        await manager.save(StockAdjustment, stock);
      }

      // Save all stock adjustment entries
      const entries = data['entries'];
      if (Array.isArray(entries)) {
        const lenght = entries.length;
        let entry: StockAdjustmentEntry;

        for (let i = 0; i < lenght; i++) {
          let {
            productVariantId,
            productName,
            variantName,
            currentQuantity,
            adjustQuantity,
            unitId,
            status,
          } = entries[i];

          // Get barcode and productId from productVariant
          const productVariant: ProductVariant = await this.repository
              .createQueryBuilder('PV')
              .select(['productId', 'barcode'])
              .where('PV.id = :id', { id: productVariantId })
              .getRawOne();

          // Insert or update entry
          if (!entries[i].id) {
            entry = new StockAdjustmentEntry();
            entry.id = uuidv4();
            entry.stockAdjustmentId = stock.id;
            entry.productVariantId = productVariantId;
            entry.productName = productName;
            entry.variantName = variantName;
            entry.barcode = productVariant.barcode;
            entry.unitId = unitId;
            entry.currentQuantity = currentQuantity;
            entry.adjustQuantity = adjustQuantity;
            entry.status = data.step;
            await manager.insert(StockAdjustmentEntry, entry);
          } else {
            const updateEntry = {
              currentQuantity,
              adjustQuantity,
              productName,
              variantName,
              status: status == null ? ModelStatus.ACTIVE : status,
            };
            await manager.update(
              StockAdjustmentEntry,
              { id: entries[i].id },
              updateEntry,
            );
          }

          // If approved, update inventory and log movement
          if (data.step == StockAdjustmentStepEnums.APPROVED) {
            let productLocations: ProductLocation[] = await manager
              .createQueryBuilder<ProductLocation>('ProductLocation', 'PL')
              .select(['id', 'locationId', 'productVariantId', 'quantity'])
              .where('productVariantId = :productVariantId', {
                productVariantId,
              })
              .getRawMany();

            let productLocation = productLocations.find(
              (value) => value.locationId == locationId,
            );
            const previousQuantity: number = productLocation
              ? productLocation.quantity
              : 0;

            // Insert or update ProductLocation record
            if (!productLocation) {
              productLocation = new ProductLocation();
              productLocation.id = uuidv4();
              productLocation.locationId = locationId;
              productLocation.productVariantId = productVariantId;
              productLocation.quantity = adjustQuantity;
              await manager.insert(ProductLocation, productLocation);
            } else {
              await manager.update(
                ProductLocation,
                { locationId, productVariantId },
                { quantity: adjustQuantity },
              );
            }

            // Update total quantity in ProductVariant
            const quantity: number =
              _.sumBy(
                productLocations.filter(
                  (value) => value.locationId != locationId,
                ),
                'quantity',
              ) + adjustQuantity;
            await manager.update(
              ProductVariant,
              { id: productVariantId },
              { quantity },
            );

            // Create and log stock movement
            const movementLog: MovementLog = new MovementLog();
            movementLog.id = uuidv4();
            movementLog.userId = data.userId;
            movementLog.locationId = locationId;
            movementLog.entityId = data.id;
            movementLog.productId = productVariant.productId;
            movementLog.productVariantId = productVariantId;
            movementLog.productVariant = productVariant.name;
            movementLog.quantity = adjustQuantity;
            movementLog.oldQuantity = previousQuantity;
            movementLog.type = 'ADJUSTMENT';
            await this.movementLogstockAdjustmentRepository.log(
              movementLog,
              StockEnums.TRANSFER,
              manager,
            );
          }
        }
      }
    });

    return id;
  }

  /**
   * Get paginated list of stock adjustments waiting for approval
   */
  async findManyOfApproveList(filter: FilterDto) {
    const results = await this.stockAdjustmentRepository.findManyOfApproveList(filter);
    return this.responses(results[0], results[1], filter.limit, filter.offset);
  }

  /**
   * Create a new stock adjustment record
   */
  create(data: StockAdjustment) {
    return this.saveRecord(data);
  }

  /**
   * Update an existing stock adjustment record
   */
  update(data: StockAdjustment, condition: object) {
    return this.saveRecord(data, condition);
  }

  /**
   * Approve a stock adjustment, and update all related inventory
   */
  async approve(data: StockAdjustment, condition: object) {
    await getManager().transaction(async (manager) => {
      let stockAdjustment = await this.stockAdjustmentRepository.findOneByFieldName(condition);

      // Set new state and save
      stockAdjustment = Object.assign(stockAdjustment, data);
      stockAdjustment.approverId = data.userId;
      stockAdjustment.step = StockAdjustmentStepEnums.APPROVED;
      const resultStockAdjustment = await manager.save(
        this.stockAdjustmentRepository.entityName,
        stockAdjustment,
      );

      // Update entries
      const entries = data['entries'];
      if (Array.isArray(entries)) {
        const lenght = entries.length;
        for (let i = 0; i < lenght; i++) {
          let stockAdjustmentEntry =
            await this.stockAdjustmentEntrystockAdjustmentRepository.findOneByFieldName({
              id: entries[i].id,
              stockAdjustmentId: resultStockAdjustment.id,
            });

          // Approve entry
          if (entries[i].isApprove == StockAdjustmentStepEnums.APPROVED && stockAdjustmentEntry.status == StockAdjustmentStepEnums.REQUESTED) {
            let unitMultiple = 1;

            // Get unit conversion if needed
            if (entries[i].unitId) {
              const unitResult = await this.unitstockAdjustmentRepository.findOneByFieldName({ id: stockAdjustmentEntry.unitId }, ['multiple']);
              unitMultiple = unitResult.multiple;
            }

            // Perform inventory adjustment
            const stockService = new StockService();
            stockAdjustmentEntry.status = StockAdjustmentStepEnums.APPROVED;
            await stockService.adjustmentProductStock(
              manager,
              stockAdjustmentEntry.productVariantId,
              resultStockAdjustment.locationId,
              stockAdjustmentEntry.adjustQuantity * unitMultiple,
            );
          } else {
            stockAdjustmentEntry.status = StockAdjustmentStepEnums.DISAPPROVED;
          }

          // Save entry update
          stockAdjustmentEntry = await manager.save(
            this.stockAdjustmentEntrystockAdjustmentRepository.entityName,
            stockAdjustmentEntry,
          );
          entries[i] = stockAdjustmentEntry;
        }
      }

      resultStockAdjustment.details = entries;
      data = resultStockAdjustment;
    });

    delete data['entries'];
    return data;
  }

  /**
   * Get full detail of a stock adjustment by ID
   */
  detail(id: string) {
    return this.stockAdjustmentRepository.detail(id);
  }

  /**
   * Archive (deactivate) stock adjustment(s) by comma-separated ID string
   */
  async archive(data: string) {
    const ids = data.split(',');
    const length = ids.length;

    for (var i = 0; i < length; i++) {
      const stockAdjustment = await this.stockAdjustmentRepository.findOneByFieldName({
        id: ids[i],
      });
      if (stockAdjustment != null) {
        if (stockAdjustment.step != StockAdjustmentStepEnums.REQUESTED) {
          throw new BadRequestError(
            'Stock adjustment can not archive',
            HttpCode.FORBIDEN_STEP_PROCESS,
          );
        }
      }
    }

    const result = await this.stockAdjustmentRepository.findOneByFieldName({ id: data });
    if (result != null && result.step == StockAdjustmentStepEnums.APPROVED) {
      throw new BadRequestError(
        'Forbiden step for delete',
        HttpCode.FORBIDEN_STEP_PROCESS,
      );
    }

    return super.archive(data);
  }
}

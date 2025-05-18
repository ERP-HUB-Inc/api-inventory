import {
  getCustomRepository,
  EntityManager,
} from '../../../../../node_modules/typeorm';
import ProductLocationRepository from '../../item/repositories/ProductLocationRepository';
import ProductPackageRepository from '../../item/repositories/ProductPackageRepository';
import ProductVariantRepository from '../../item/repositories/ProductVariantRepository';
import { NotFoundError, BadRequestError } from '../../../../exceptions';
import { ProductionOptionEnums } from '../../item/enums/ProductionOptionEnums';
import MovementLogRepository from '../repositories/MovementLogRepository';
import ItemRepository from '../../item/repositories/ItemRepository';
import ProductLocation from '../../item/entities/ProductLocation';
import ProductVariant from '../../item/entities/ProductVariant';
import EODLogRepository from '../repositories/EODLogRepository';
import { StockEnums } from '../../stock/enums/StockEnums';
import { HttpCode } from '../../../../enums/HttpCode';
import { MovementLog } from '../entities';
import { v4 as uuidv4 } from 'uuid';
import { Service } from 'typedi';

@Service()
export default class StockService {
  public clientId: string;

  public deviceNumber: string;

  private itemRepository: ItemRepository;
  private productLocationRepository: ProductLocationRepository;
  private eodLogRepository: EODLogRepository;
  private movementLogRepository: MovementLogRepository;
  private productPackageRepository: ProductPackageRepository;
  private productVariantRepository: ProductVariantRepository;

  constructor() {
    this.itemRepository = getCustomRepository(ItemRepository);
    this.productLocationRepository = getCustomRepository(
      ProductLocationRepository,
    );
    this.eodLogRepository = getCustomRepository(EODLogRepository);
    this.movementLogRepository = getCustomRepository(MovementLogRepository);
    this.productPackageRepository = getCustomRepository(
      ProductPackageRepository,
    );
    this.productVariantRepository = getCustomRepository(
      ProductVariantRepository,
    );
  }

  public async transferProductStock(
    manager: EntityManager,
    productVariantId: string,
    fromLocationId: string,
    toLocationId: string,
    quantity: number,
    userId: string,
    transferNo: string,
    increamentIndex: number = 0,
  ) {
    this.productVariantRepository.clientId = this.clientId;
    this.itemRepository.clientId = this.clientId;
    this.productLocationRepository.clientId = this.clientId;

    // PRODUCT VARAINT
    let productVariant = await this.productVariantRepository.findOneByFieldName(
      { id: productVariantId },
      ['id'],
    );
    if (productVariant == null) {
      throw new NotFoundError(
        'Product variant not found',
        HttpCode.PRODUCT_NOT_FOUND,
      );
    }

    let beginingFromQuantity = 0;
    let beginingToQuantity = 0;

    // PRODUCT FROM LOCATION
    let fromProductLocation =
      await this.productLocationRepository.findOneByFieldName({
        locationId: fromLocationId,
        productVariantId,
      });
    if (fromProductLocation == null) {
      // This case we need to think about stock that allow negative quantity(mean that we allow you to transfer product in case you have not quantity)
      fromProductLocation = new ProductLocation();
      fromProductLocation.id = uuidv4();
      fromProductLocation.locationId = fromLocationId;
      fromProductLocation.productVariantId = productVariantId;
      fromProductLocation.quantity = Math.abs(quantity) * -1;
      await manager.save(
        this.productLocationRepository.entityName,
        fromProductLocation,
      );
    } else {
      if (quantity > fromProductLocation.quantity) {
        throw new BadRequestError(
          'Not enought quantity for receive from source location',
          HttpCode.RECEIVE_STOCK_TRANSFER_NOT_ENOUGHT_QUANTITY,
        );
      }

      beginingFromQuantity = fromProductLocation.quantity;
      fromProductLocation.quantity -= quantity;
      await manager.save(
        this.productLocationRepository.entityName,
        fromProductLocation,
      );
    }

    // PRODUCT TO LOCATION
    let toProductLocation =
      await this.productLocationRepository.findOneByFieldName({
        locationId: toLocationId,
        productVariantId: productVariant.id,
      });
    if (toProductLocation == null) {
      toProductLocation = new ProductLocation();
      toProductLocation.id = uuidv4();
      toProductLocation.locationId = toLocationId;
      toProductLocation.productVariantId = productVariantId;
      toProductLocation.quantity = quantity;
      await manager.save(
        this.productLocationRepository.entityName,
        toProductLocation,
      );
    } else {
      toProductLocation.quantity += quantity;
      await manager.save(
        this.productLocationRepository.entityName,
        toProductLocation,
      );
    }
  }

  public async adjustmentProductStock(
    manager: EntityManager,
    productVariantId: string,
    locationId: string,
    quantity: number,
  ) {
    await manager.update(
      ProductVariant,
      { id: productVariantId },
      { quantity },
    );

    let productLocation =
      await this.productLocationRepository.findOneByFieldName({
        locationId,
        productVariantId,
      });
    if (productLocation == null) {
      productLocation = new ProductLocation();
      productLocation.id = uuidv4();
      productLocation.locationId = locationId;
      productLocation.productVariantId = productVariantId;
      productLocation.quantity = quantity;
      await manager.save(ProductLocation, productLocation);
    } else {
      await manager.update(
        ProductLocation,
        { productVariantId, locationId },
        { quantity },
      );
    }
  }

  public async processProductStock(
    manager: EntityManager,
    productVariant: ProductVariant,
    locationId: string,
    quantity: number,
    userId: string,
    cost?: number,
    refType?: StockEnums,
    refId?: string,
    refNo?: string,
    clientId?: string,
  ) {
    await this.processProductStockOneByOne(
      manager,
      productVariant,
      locationId,
      quantity,
      userId,
      cost,
      refType,
      refId,
      refNo,
      clientId,
    );
  }

  private async processProductStockOneByOne(
    manager: EntityManager,
    productVariant: ProductVariant, //product: Product,
    locationId: string,
    quantity: number,
    userId: string,
    cost?: number,
    refType?: StockEnums,
    refId?: string,
    refNo?: string,
    clientId?: string,
  ) {
    this.itemRepository.clientId = this.clientId;
    productVariant.quantity = Number(productVariant.quantity);
    quantity = Number(quantity);
    console.log(
      `=================START PROCESS STOCK ONE BY ONE WITH QTY: ${quantity} INTO LOCATION ${locationId}=====================`,
    );
    this.productVariantRepository.clientId = clientId;
    this.productLocationRepository.clientId = clientId;
    this.eodLogRepository.clientId = clientId;

    if (refType == null) {
      refType = StockEnums.SALE;
    }

    if (refId == null) {
      refId = '';
    }

    if (cost == null) {
      cost = 0;
    }

    if (refNo == null) {
      refNo = '';
    }

    const beginingQuantity = productVariant.quantity;
    const finalQuantity = productVariant.quantity + quantity;
    const updateProductVariant = { quantity: finalQuantity };
    const beginingCost = productVariant.cost;
    let newCost = 0;

    if (refType == StockEnums.PO) {
      if (beginingCost == 0 || beginingQuantity + quantity == 0) newCost = cost;
      else
        newCost =
          (beginingCost * Math.abs(Math.max(beginingQuantity, 0)) +
            cost * quantity) /
          (Math.max(beginingQuantity, 0) + quantity);

      updateProductVariant['cost'] = newCost;
    } else {
      newCost = beginingCost;
    }

    await manager.update(
      ProductVariant,
      { id: productVariant.id, clientId },
      updateProductVariant,
    );

    let productLocation: ProductLocation =
      await this.productLocationRepository.connection
        .createQueryBuilder<ProductLocation>('ProductLocation', 'PL')
        .select(['id', 'clientId', 'locationId', 'quantity'])
        .where(
          'locationId = :locationId AND productVariantId = :productVariantId',
          { locationId, productVariantId: productVariant.id },
        )
        .getRawOne();

    const previousQuantity: number = productLocation
      ? productLocation.quantity
      : 0;
    let currentQuantity: number;

    if (productLocation == null) {
      productLocation = new ProductLocation();
      productLocation.id = uuidv4();
      productLocation.clientId = clientId;
      productLocation.locationId = locationId;
      productLocation.productVariantId = productVariant.id;
      productLocation.quantity = quantity;
      currentQuantity = quantity;
      await manager.insert(ProductLocation, productLocation);
    } else {
      productLocation.quantity += quantity;
      currentQuantity = productLocation.quantity;
      productLocation.clientId = clientId;
      await manager.update(
        ProductLocation,
        {
          id: productLocation.id,
          locationId,
          productVariantId: productVariant.id,
        },
        { quantity: productLocation.quantity, clientId },
      );
    }

    const movementLog: MovementLog = new MovementLog();
    movementLog.id = uuidv4();
    movementLog.clientId = clientId;
    movementLog.userId = userId;
    movementLog.locationId = locationId;
    movementLog.entityId = refId;
    movementLog.productId = productVariant.productId;
    movementLog.productVariantId = productVariant.id;
    movementLog.productVariant = productVariant.name;
    movementLog.quantity = currentQuantity;
    movementLog.oldQuantity = previousQuantity;
    movementLog.cost = newCost;
    movementLog.oldCost = beginingCost;
    await this.movementLogRepository.log(movementLog, refType, manager);
  }

  public async returnProductStock(
    manager: EntityManager,
    productVariant: ProductVariant,
    locationId: string,
    quantity: number,
    clientId: string,
  ) {
    console.log(
      '=================START RETURN PRODUCT STOCK=====================',
    );

    this.productLocationRepository.clientId = clientId;
    this.itemRepository.clientId = clientId;
    await manager.update(
      ProductVariant,
      { id: productVariant.id, clientId },
      { quantity: productVariant.quantity + quantity },
    );

    // PRODUCT LOCATION
    let productLocation =
      await this.productLocationRepository.findOneByFieldName({
        locationId,
        productVariantId: productVariant.id,
      });
    if (productLocation == null) {
      productLocation = new ProductLocation();
      productLocation.id = await this.productLocationRepository.generateUUId();
      productLocation.locationId = locationId;
      productLocation.productVariantId = productVariant.id;
      productLocation.clientId = clientId;
      productLocation.quantity = quantity;
      await manager.insert(ProductLocation, productLocation);
    } else {
      await manager.update(
        ProductLocation,
        { clientId, productVariantId: productVariant.id, locationId },
        { quantity: productLocation.quantity + quantity },
      );
    }
  }

  public async makeFinalProductStock(
    manager: EntityManager,
    productId: string,
    locationId: string,
    quantity: number,
    userId: string,
    cost?: number,
    refId?: string,
    refNo?: string,
  ) {
    console.log(
      '=================START MAKE FINAL PRODUCT STOCK=====================',
    );
    this.itemRepository.clientId = this.clientId;
    this.productPackageRepository.clientId = this.clientId;
    let product = await this.itemRepository.findOneByFieldName({
      id: productId,
    });
    if (product == null) {
      throw new NotFoundError(
        'Product is not found',
        HttpCode.PRODUCT_NOT_FOUND,
      );
    }

    if (product.productOption == ProductionOptionEnums.COMPOSITE) {
      // Add Stock to Final Products
      let finalProductVariant =
        await this.productVariantRepository.findOneByFieldName({ productId });
      await this.processProductStock(
        manager,
        finalProductVariant,
        locationId,
        quantity,
        userId,
        cost,
        StockEnums.MAKE,
        refId,
        refNo,
      );

      // Cut Stock from Raw Products
      const list = await this.productPackageRepository.findMany({
        condition: { productId },
      });
      if (list != null) {
        const packageList = list[0];
        const length = packageList.length;
        for (var i = 0; i < length; i++) {
          let packageProduct = packageList[i];
          let rawProduct = await this.itemRepository.findOneByFieldName({
            id: packageProduct.rawProductId,
          });
          let rawProductVariant =
            await this.productVariantRepository.findOneByFieldName({
              productId: rawProduct.id,
            });
          await this.processProductStockOneByOne(
            manager,
            rawProductVariant,
            locationId,
            -1 * quantity * packageProduct.quantity,
            userId,
            rawProductVariant.cost,
            StockEnums.MAKE,
            refId,
            refNo,
          );
        }
      }
    } else {
      throw new BadRequestError(
        'This product is not composite, so cannot do make production.',
        HttpCode.FORBIDEN_STEP_PROCESS,
      );
    }
  }
}

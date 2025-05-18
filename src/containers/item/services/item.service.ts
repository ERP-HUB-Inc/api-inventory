import { plainToInstance } from 'class-transformer';
import * as _ from 'lodash';
import { NotFoundError } from 'routing-controllers';
import { Service } from 'typedi';
import { getConnection, getCustomRepository, getManager } from 'typeorm';
import { HttpCode } from '../../../../enums/HttpCode';
import { BadRequestError } from '../../../../exceptions';
import Filter from '../../../core/common/filters';
import { RecordStatus } from '../../../core/setting/enums';
import Location from '../../../core/setting/models/Location';
import User from '../../../core/setting/models/User';
import ClientRepository from '../../../core/setting/repositories/ClientRepository';
import LocationRepository from '../../../core/setting/repositories/LocationRepository';
import Transaction from '../../../sales/transaction/models/Transaction';
import TransactionEntry from '../../../sales/transaction/models/TransactionEntry';
import TransactionPayment from '../../../sales/transaction/models/TransactionPayment';
import { PurchaseStepEnums } from '../../purchase/enums';
import { MovementLog } from '../../stock/entities';
import { StockEnums } from '../../stock/enums/StockEnums';
import MovementLogRepository from '../../stock/repositories/MovementLogRepository';
import {
  ProductCreateDTO,
  ProductUpdateDto,
  VariantDto,
  VariantRequestDto,
} from '../dto';
import { ProductDTO } from '../dto/ProductDto';
import Brand from '../entities/Brand';
import ProductType from '../entities/Category';
import Condition from '../entities/Condition';
import Product from '../entities/Product';
import ProductAttribute from '../entities/ProductAttribute';
import ProductLocation from '../entities/ProductLocation';
import ProductPackage from '../entities/ProductPackage';
import ProductVariant from '../entities/ProductVariant';
import Unit from '../entities/Unit';
import { ProductSerialTypeEnums } from '../enums/ProductSerialTypeEnums';
import { ProductionOptionEnums } from '../enums/ProductionOptionEnums';
import { TypeOfProductGenerateSKU } from '../enums/TypeOfProductGenerateSKU';
import {
  fromItemDtoToItem,
  fromItemUpdateDtoToItemDto,
  fromVariantDtoToVariant,
} from '../mappers';
import BrandRepository from '../repositories/BrandRepository';
import CategoryRepository from '../repositories/CategoryRepository';
import ItemRepository from '../repositories/ItemRepository';
import ProductLocationRepository from '../repositories/ProductLocationRepository';
import ProductVariantRepository from '../repositories/ProductVariantRepository';
import UnitRepository from '../repositories/UnitRepository';

@Service()
export default class ItemService {
  protected repository: ItemRepository;
  private itemRepository: ItemRepository;
  private productVariantRepository: ProductVariantRepository;
  private CategoryRepository: CategoryRepository;
  private unitRepository: UnitRepository;
  private brandRepository: BrandRepository;
  private clientRepository: ClientRepository;
  private productLocationRepository: ProductLocationRepository;
  private locationRepository: LocationRepository;
  private movementLogRepsitory: MovementLogRepository;

  constructor() {
    this.repository = getCustomRepository(ItemRepository);
    this.itemRepository = getCustomRepository(ItemRepository);
    this.CategoryRepository = getCustomRepository(CategoryRepository);
    this.unitRepository = getCustomRepository(UnitRepository);
    this.brandRepository = getCustomRepository(BrandRepository);
    this.productVariantRepository = getCustomRepository(
      ProductVariantRepository,
    );
    this.clientRepository = getCustomRepository(ClientRepository);
    this.productLocationRepository = getCustomRepository(
      ProductLocationRepository,
    );
    this.locationRepository = getCustomRepository(LocationRepository);
    this.movementLogRepsitory = getCustomRepository(MovementLogRepository);
  }

  response(data: Product | any) {
    return {
      data,
    };
  }

  responseT<D>(data: D | D[], user?: any) {
    return {
      data,
      user,
    };
  }

  responses(
    datas: Product[],
    total: number = datas.length,
    limit: number = 0,
    offset: number = 0,
  ) {
    return {
      data: datas,
      pagination: {
        total,
        offset,
        limit,
      },
    };
  }

  responsesT<D>(
    datas: D[],
    total: number = datas.length,
    limit: number = 0,
    offset: number = 0,
  ) {
    return {
      data: datas,
      pagination: {
        total,
        offset,
        limit,
        current: offset / limit + 1,
      },
    };
  }

  async findMany(filter: Filter) {
    const results = await this.repository.findMany(filter);
    return this.responses(results[0], results[1], filter.limit, filter.offset);
  }

  private async saveRecord(data: ProductDTO, condition?: object) {
    let id = null;

    if (condition && condition['id']) {
      id = condition['id'];
    }

    await getManager().transaction(async (manager) => {
      let product = new Product();
      let unit: Unit;
      let isUpdateProduct = false;
      const isSavingNewRecord = condition == null || condition['id'] == null;
      if (isSavingNewRecord) {
        product = Object.assign(product, data);

        if (_.isEmpty(product.categoryId)) {
          let productType = await this.CategoryRepository.connection
            .createQueryBuilder<ProductType>('Category', 'PT')
            .select(['id'])
            .where('isDefault = 1')
            .getRawOne();
          if (productType == null) {
            productType = new ProductType();
            productType.id = await this.CategoryRepository.generateUUId();
            productType.name = 'Uncategorized';
            productType.isDefault = RecordStatus.isDefault;
            await manager.insert(ProductType, productType);
          }

          data.categoryId = productType.id;
        }

        if (_.isEmpty(product.brandId)) {
          let brand: Brand = await this.brandRepository.connection
            .createQueryBuilder<Brand>('Brand', 'B')
            .select(['id'])
            .where('isDefault = 1')
            .getRawOne();
          if (brand == null) {
            brand = new Brand();
            brand.id = await this.CategoryRepository.generateUUId();
            brand.name = 'General';
            brand.isDefault = RecordStatus.isDefault;
            await manager.insert(Brand, brand);
          }

          data.brandId = brand.id;
        }

        if (_.isEmpty(product.stockUnitId)) {
          unit = await this.unitRepository.connection
            .createQueryBuilder(Unit, 'U')
            .select(['id'])
            .where('isDefault = 1')
            .getRawOne();
          if (unit == null) {
            unit = new Unit();
            unit.id = await this.unitRepository.generateUUId();
            unit.name = 'Piece';
            unit.multiple = 1;
            unit.label = 'Piece';
            unit.isDefault = RecordStatus.isDefault;
            await manager.insert(Unit, unit);
          }

          data.stockUnitId = unit.id;
        } else {
          unit = await this.repository.connection
            .createQueryBuilder(Unit, 'U')
            .select('name')
            .where('U.id = :id', { id: product.stockUnitId })
            .getRawOne();
        }

        data.type = _.isEmpty(product.type) ? 0 : product.type;
      } else {
        product = await this.repository.findOneByFieldName({
          id: condition['id'],
        });
        product = Object.assign(product, data);

        isUpdateProduct = true;

        unit = await this.repository.connection
          .createQueryBuilder(Unit, 'U')
          .select('name')
          .where('U.id = :id', { id: product.stockUnitId })
          .getRawOne();
      }

      const productVariants: any[] = (data as any).productVariants ?? [];

      if (!data.id) {
        data.productOption =
          productVariants && productVariants.length > 0
            ? ProductionOptionEnums.VARIANT
            : ProductionOptionEnums.STANDARD;
      }

      data.minPrice = data.price;

      const resultProduct = await manager.save(
        Product,
        fromItemDtoToItem(data),
      );

      id = resultProduct.id;

      if (resultProduct.productOption != ProductionOptionEnums.VARIANT) {
        const productVariant = {
          id: isUpdateProduct
            ? condition['id']
            : await this.repository.generateUUId(),
          productId: resultProduct.id,
          name: '',
          image: '',
          barcode:
            data.isAutoGenerateBarcode == TypeOfProductGenerateSKU.AUTO
              ? await this.clientRepository.generateProductCodeSequenceStart()
              : data.barcode,
          isAutoGenerateBarcode: data.isAutoGenerateBarcode,
          sku: data.sku,
          isAutoGenerateSKU: data.isAutoGenerateSKU,
          price: data.price,
          wholePrice: data.wholePrice,
          distributePrice: data.distributePrice,
          factoryCost: data.factoryCost,
          isPublic: data.isPublic,
        };

        if (
          data.isAutoGenerateBarcode == TypeOfProductGenerateSKU.AUTO &&
          !isUpdateProduct
        ) {
          productVariant['barcode'] =
            await this.clientRepository.generateProductCodeSequenceStart();
        }

        productVariants.push(productVariant);
      }

      // SAVE PRODUCT VARIANT
      if (Array.isArray(productVariants)) {
        const promiseSaveVariants = productVariants.map(
          async (variantDto: any) => {
            let productVariant: ProductVariant;

            if (variantDto) {
              productVariant = fromVariantDtoToVariant(variantDto);
            } else {
              productVariant = new ProductVariant();
              productVariant.productId = resultProduct.id;
              productVariant.name = variantDto.name;
              productVariant.image = variantDto.image;
              productVariant.barcode =
                variantDto.isAutoGenerateBarcode ==
                TypeOfProductGenerateSKU.AUTO
                  ? await this.clientRepository.generateProductCodeSequenceStart()
                  : variantDto.barcode;
              productVariant.sku = variantDto.sku;
              productVariant.isAutoGenerateSKU = variantDto.sku ? 0 : 1;
              productVariant.price = variantDto.price;
              productVariant.wholePrice = variantDto.wholePrice;
              productVariant.distributePrice = variantDto.distributePrice;
              productVariant.cost = 0;
              productVariant.quantity = 0;
              productVariant.reorderPoint = data.reorderPoint;
              productVariant.factoryCost = variantDto.factoryCost;
            }

            await manager.save(ProductVariant, productVariant);
          },
        );

        await Promise.all(promiseSaveVariants);
      }

      const foundProductVariantMinPrice = _.minBy(
        productVariants,
        (productVariant) => productVariant['price'],
      );
      if (foundProductVariantMinPrice)
        await manager.update(
          Product,
          { id: resultProduct.id },
          { minPrice: foundProductVariantMinPrice['price'] },
        );

      //Sync product to MKP Database
      const enableSync = false;
      if (enableSync) {
        let ec_product = await getConnection('MKP')
          .createQueryBuilder('Product', 'P')
          .where('P.sync_product_id = :productId', {
            productId: resultProduct.id,
          })
          .getOne();

        const ec_product_data = {
          sync_product_id: resultProduct.id,
          name: resultProduct.name,
          name_kh: resultProduct.namekm,
          price: data.price,
          unit: unit.name,
          description: resultProduct.description,
          image: resultProduct.image,
        };

        if (ec_product) {
          await getConnection('MKP')
            .createQueryBuilder()
            .update('Product')
            .set(ec_product_data)
            .where('sync_product_id = :productId', {
              productId: resultProduct.id,
            })
            .execute();
        } else {
          await getConnection('MKP')
            .createQueryBuilder()
            .insert()
            .into('Product')
            .values(ec_product_data)
            .execute();
        }
      }
    });

    return id;
  }

  async getProductById(
    productId: string,
    productOption: number,
    isIncludeLocation: boolean,
  ) {
    const query = this.repository.connection
      .createQueryBuilder(Product, 'P')
      .leftJoin('P.category', 'PT')
      .leftJoin('P.brand', 'B')
      .leftJoin('P.supplier', 'S')
      .leftJoin('P.unitOfMeasurement', 'U')
      .innerJoin('P.productVariants', 'PV')
      .select([
        'P.id',
        'P.unitOfMeasurementId',
        'P.stockUnitId',
        'P.sellUnitId',
        'P.unitConversion',
        'P.categoryId',
        'P.brandId',
        'P.taxId',
        'P.conditionId',
        'P.supplierId',
        'P.preferredSupplierId',
        'P.manufacturerId',
        'P.supplierItemCode',
        'P.supplierPercentage',
        'P.purchasePrice',
        'P.defaultLocationId',
        'P.image',
        'P.videoUrl',
        'P.name',
        'P.namekm',
        'P.description',
        'P.specification',
        'P.reorderPoint',
        'P.shippingFee',
        'P.highlightTag',
        'P.tag',
        'P.isAvialableSale',
        'P.isSplittable',
        'P.enableDescription',
        'P.warrantyDuration',
        'P.warrantyDurationType',
        'P.isFeatured',
        'P.isPublic',
        'P.enableInventoryTracking',
        'P.serialType',
        'P.isAutoGenerateBarcode',
        'P.isAutoGenerateSKU',
        'P.type',
        'P.productOption',
        'P.status',
        'PV.id',
        'PV.productId',
        'PV.barcode',
        'PV.sku',
        'PV.price',
        'PV.wholePrice',
        'PV.distributePrice',
        'PT.id',
        'PT.name',
        'B.id',
        'B.name',
        'U.id',
        'U.name',
        'U.multiple',
        'S.id',
        'S.name',
      ])
      .where('P.id = :productId', { productId });

    const result: Product = await query.getOne();

    if (result == null) {
      throw new NotFoundError('Product not found');
    }

    if (isIncludeLocation && result.productVariants) {
      // const productLocations: ProductLocation[] = await this.repository.connection.createQueryBuilder(ProductLocation, "PL")
      // .innerJoin("PL.location", "L")
      // .select([
      //     "PL.id AS id",
      //     "name",
      //     "PL.locationId AS locationId",
      //     "PL.quantity AS quantity",
      //     "PL.updatedAt AS lastUpdatedAt"
      // ])
      // .where("PL.productVariantId = :productVariantId AND PL.status = 1", {productVariantId: result.productVariants[0].id})
      // .getRawMany();

      result['productLocations'] = [];
    }

    result.productAttributes = [];

    if (productOption == ProductionOptionEnums.VARIANT) {
      result.productAttributes = await this.repository.connection
        .createQueryBuilder<ProductAttribute>('ProductAttribute', 'PA')
        .innerJoin('PA.attributeValues', 'ATV', 'ATV.status = 1')
        .select([
          'PA.id',
          'PA.attributeId',
          'PA.sort',
          'ATV.id',
          'ATV.name',
          'ATV.productAttributeId',
          'ATV.status',
        ])
        .where('PA.productId = :productId AND PA.status = 1', { productId })
        .getMany();
    }
    return this.response(result);
  }

  async getVariantsByItemId(dto: VariantRequestDto): Promise {
    const results = await this.itemRepository.findVariantsByItemId(dto);
    return this.responsesT<VariantDto>(
      plainToInstance(VariantDto, results[0], {
        excludeExtraneousValues: true,
      }),
      results[1],
      dto.limit,
      dto.offset,
    );
  }

  async getPOSProducts(filter: Filter) {}

  async getFormData(clientId: string) {
    const conditions: Condition[] = await this.repository.connection
      .createQueryBuilder(Condition, 'C')
      .select(['id', 'name'])
      .where('clientId = :clientId', { clientId })
      .orderBy('name')
      .getRawMany();

    return this.response({
      conditions,
    });
  }

  async findDetailStockByProductId(clientId: string, productId: string) {
    let productVariants = await this.repository.connection
      .createQueryBuilder('ProductVariant', 'PV')
      .leftJoin('PV.productLocations', 'PL')
      .innerJoin('PL.location', 'L')
      .select([
        'PV.id',
        'PV.name',
        'PV.quantity',
        'PL.quantity',
        'PL.updatedAt',
        'L.name',
      ])
      .where('PV.clientId = :clientId AND PV.productId = :productId', {
        clientId,
        productId,
      })
      .getMany();

    productVariants = productVariants.map((productVariant) => {
      productVariant['productLocations'] = productVariant[
        'productLocations'
      ].map((productLocation) => ({
        location: productLocation.location.name,
        quantity: productLocation.quantity,
        lastModified: productLocation.updatedAt,
      }));
      return productVariant;
    });

    return this.response(productVariants);
  }

  async getPurchaseByProduct(
    clientId: string,
    productId: string,
    startDate: string,
    endDate: string,
    offset: number,
    limit: number,
  ) {
    const query = this.repository.connection
      .createQueryBuilder('PurchaseOrder', 'PO')
      .innerJoin('PO.location', 'L')
      .innerJoin('PO.supplier', 'S')
      .innerJoin(
        'PO.purchaseOrderEntries',
        'PE',
        'PE.status = 1 AND PE.clientId = :clientId',
      )
      .innerJoin('PE.productVariant', 'PV', 'PV.clientId = :clientId')
      .innerJoin('PV.product', 'P', 'P.clientId = :clientId')
      .innerJoin('PE.unit', 'U')
      .select([
        'PE.productVariantId AS id',
        'L.name AS locationName',
        'PO.id AS purchaseOrderId',
        "DATE_FORMAT(PO.createdAt, '%Y-%m-%d') AS date",
        'P.name AS productName',
        'PV.name AS variantName',
        'barcode',
        'productOption',
        'S.name AS supplierName',
        'U.name AS unitName',
        'PE.receiveQuantity AS quantity',
        'PE.price AS cost',
        'PE.price * PE.receiveQuantity AS total',
      ]);

    query.where('PO.clientId = :clientId AND P.id = :productId', {
      clientId,
      productId,
    });

    if (offset) query.offset(offset);
    if (limit) query.limit(limit);

    if (startDate && endDate)
      query.andWhere(
        "DATE_FORMAT(PO.createdAt, '%Y-%m-%d') >= :startDate AND DATE_FORMAT(PO.createdAt, '%Y-%m-%d') <= :endDate",
        { startDate, endDate },
      );

    query
      .andWhere('PO.status = 1 AND PO.step = :step', {
        step: PurchaseStepEnums.RECEIVED,
      })
      .orderBy('PO.createdAt', 'DESC');

    const results = await query.getRawMany();
    const count = await query.getCount();

    return this.responses(results, count, limit, offset);
  }

  async findDetailForSplit(productVariantId: string, locationId: string) {
    const result: ProductVariant = await this.repository.connection
      .createQueryBuilder<ProductVariant>('ProductVariant', 'PV')
      .innerJoin('PV.product', 'P')
      .innerJoin('P.unitOfMeasurement', 'U')
      .leftJoin('PV.productLocations', 'PL', 'PL.locationId = :locationId', {
        locationId,
      })
      .leftJoin('PL.location', 'L')
      .select([
        'P.id AS id',
        'P.name AS name',
        'P.namekm AS namekm',
        'PV.id AS productVariantId',
        'barcode',
        'cost',
        'price',
        'wholePrice',
        'distributePrice',
        'U.name AS unitName',
        'IFNULL(PL.quantity, 0) AS quantity',
        'IFNULL(PV.quantity - PL.quantity, 0) AS otherQuantity',
        'L.name AS locationName',
      ])
      .where('PV.id = :productVariantId', { productVariantId })
      .getRawOne();

    result.productPackages = await this.repository.connection
      .createQueryBuilder<ProductPackage>('ProductPackage', 'PP')
      .innerJoin('PP.rawProduct', 'PV')
      .innerJoin('PV.product', 'P')
      .innerJoin('P.unitOfMeasurement', 'U')
      .innerJoin('PV.productLocations', 'PL', 'PL.locationId = :locationId', {
        locationId,
      })
      .select([
        'PP.id AS id',
        'PV.id AS productVariantId',
        'P.image AS image',
        'P.name AS name',
        'PV.barcode AS barcode',
        'PL.quantity AS currentQuantity',
        'PV.cost AS currentCost',
        'PV.price AS price',
        'P.stockUnitId AS unitId',
        'U.name AS unitName',
      ])
      .where('PP.productId = :productVariantId', { productVariantId })
      .getRawMany();

    return this.response(result);
  }

  async create(data: ProductCreateDTO) {
    return await this.saveRecord(data);
  }

  async update(dto: ProductUpdateDto, condition: object) {
    await this.saveRecord(fromItemUpdateDtoToItemDto(dto), condition);
  }

  async modifyCost(productVariantId: string, cost: number, clientId: string) {
    await this.repository.connection
      .createQueryBuilder()
      .update(ProductVariant)
      .set({
        cost,
      })
      .where('clientId = :clientId AND id = :productVariantId', {
        clientId,
        productVariantId,
      })
      .execute();
  }

  async findManyForDropDown(filter: Filter, isSearchingBarcode: boolean) {
    const results = await this.repository.findManyForDropDown(
      filter,
      isSearchingBarcode,
    );
    return this.responses(results[0], results[1], filter.limit, filter.offset);
  }

  async searchProducts(filter: Filter, isSearchingBarcode: boolean) {
    const results = await this.itemRepository.searchProducts(
      filter,
      isSearchingBarcode,
    );
    return this.responses(results[0], results[1], filter.limit, filter.offset);
  }

  async editProductCost(user: User, productVariantId: string, newCost: number) {
    await getManager().transaction(async (manager) => {
      const productVariant: ProductVariant = await this.repository.connection
        .createQueryBuilder(ProductVariant, 'PV')
        .select(['productId', 'name', 'cost'])
        .where('PV.clientId = :clientId AND PV.id = :productVariantId', {
          clientId: user.clientId,
          productVariantId,
        })
        .getRawOne();

      await manager.update(
        ProductVariant,
        { clientId: user.clientId, id: productVariantId },
        { cost: newCost },
      );

      const productLocation: ProductLocation = await this.repository.connection
        .createQueryBuilder(ProductLocation, 'PL')
        .select('quantity')
        .where(
          'PL.clientId = :clientId AND PL.locationId = :locationId AND PL.productVariantId = :productVariantId',
          {
            clientId: user.clientId,
            locationId: user.locationId,
            productVariantId,
          },
        )
        .getRawOne();

      if (productLocation) {
        const movementLog: MovementLog = new MovementLog();
        movementLog.id = await this.repository.generateUUId();
        movementLog.clientId = user.clientId;
        movementLog.userId = user.id;
        movementLog.locationId = user.locationId;
        movementLog.entityId = null;
        movementLog.productId = productVariant.productId;
        movementLog.productVariantId = productVariantId;
        movementLog.productVariant = productVariant.name;
        movementLog.quantity = productLocation.quantity;
        movementLog.oldQuantity = productLocation.quantity;
        movementLog.cost = productVariant.cost;
        movementLog.oldCost = newCost;
        await this.movementLogRepsitory.log(
          movementLog,
          StockEnums.EDIT_COST,
          manager,
        );
      }
    });
  }

  async splitProduct(
    productVariantId: string,
    quantityToSplit: number,
    clientId: string,
    locationId: string,
    outputProducts: Product[],
  ) {
    await getManager().transaction(async (manager) => {
      const mainProduct = await manager.connection
        .createQueryBuilder('ProductVariant', 'PV')
        .innerJoin('PV.productLocations', 'PL')
        .select([
          'PV.quantity AS allQuantity',
          'PL.quantity AS currentLocationQuantity',
        ])
        .where(
          'PL.clientId = :clientId AND productVariantId = :productVariantId AND PL.locationId = :locationId',
          { clientId, productVariantId, locationId },
        )
        .getRawOne();

      if (
        mainProduct &&
        mainProduct['currentLocationQuantity'] >= quantityToSplit
      ) {
        await manager.update(
          ProductLocation,
          { clientId, productVariantId, locationId },
          {
            quantity: mainProduct['currentLocationQuantity'] - quantityToSplit,
          },
        );
        await manager.update(
          ProductVariant,
          { clientId, id: productVariantId },
          { quantity: mainProduct['allQuantity'] - quantityToSplit },
        );

        const promises = outputProducts.map(async (outputProduct) => {
          const product = await manager.connection
            .createQueryBuilder('ProductVariant', 'PV')
            .leftJoin(
              'PV.productLocations',
              'PL',
              'PL.locationId = :locationId',
              { locationId },
            )
            .select([
              'PV.quantity AS allQuantity',
              'cost',
              'PL.quantity AS currentLocationQuantity',
              'locationId',
            ])
            .where('PV.clientId = :clientId AND PV.id = :productVariantId', {
              clientId,
              productVariantId: outputProduct['productVariantId'],
              locationId,
            })
            .getRawOne();

          if (product['locationId'] && product['currentLocationQuantity']) {
            await manager.update(
              ProductLocation,
              {
                clientId,
                locationId,
                productVariantId: outputProduct['productVariantId'],
              },
              {
                quantity:
                  product['currentLocationQuantity'] +
                  outputProduct['quantity'],
              },
            );
          } else {
            const productLocation: ProductLocation = new ProductLocation();
            productLocation.id = await this.repository.generateUUId();
            productLocation.clientId = clientId;
            productLocation.productVariantId =
              outputProduct['productVariantId'];
            productLocation.locationId = locationId;
            productLocation.quantity = outputProduct['quantity'];
            await manager.insert(ProductLocation, productLocation);
          }

          const productVariant: ProductVariant = new ProductVariant();
          productVariant.quantity = product['allQuantity'];
          productVariant.cost = product['cost'];
          const newCost: number = productVariant.getAvgCost(
            outputProduct['quantity'],
            outputProduct['cost'],
          );
          await manager.update(
            ProductVariant,
            { clientId, id: outputProduct['productVariantId'] },
            {
              quantity: product['allQuantity'] + outputProduct['quantity'],
              cost: newCost,
            },
          );

          if (outputProduct['id']) {
            if (outputProduct['status'] == RecordStatus.Archive)
              await manager.delete(ProductPackage, {
                clientId,
                id: outputProduct['id'],
              });
          } else {
            const productPackage: ProductPackage = new ProductPackage();
            productPackage.id = await this.repository.generateUUId();
            productPackage.clientId = clientId;
            productPackage.rawProductId = outputProduct['productVariantId'];
            productPackage.productId = productVariantId;
            await manager.insert(ProductPackage, productPackage);
          }
        });

        await Promise.all(promises);
      } else {
        throw new BadRequestError('Product no avialable stock');
      }
    });
  }

  archive(data: string) {
    return this.repository.archive(data);
  }

  importProducts(products: Product[], clientId: string) {
    getManager().transaction(async (manager) => {
      const lenght = products.length,
        categories: ProductType[] = [],
        units: Unit[] = [],
        productArr: Product[] = [],
        productVariantArr: ProductVariant[] = [],
        productLoactionArr: ProductLocation[] = [],
        existProducts = [],
        duplicateProducts = [];

      for (let i = 1; i < lenght; i++) {
        const value = products[i];
        if (value['A']) {
          let name = value['A'],
            barcode = value['B'],
            categoryName: string = value['C'],
            openingCost = value['D'],
            retailPrice = value['E'],
            wholePrice = value['F'],
            distrPrice = value['G'],
            openingStock = value['H'],
            unitName = value['I'];

          //Check exist product
          const existProductVariant =
            await this.productVariantRepository.connection
              .createQueryBuilder<ProductVariant>('ProductVariant', 'PV')
              .select(['id'])
              .where('clientId = :clientId AND barcode = :barcode', {
                clientId,
                barcode,
              })
              .getRawOne();

          if (existProductVariant) {
            existProducts.push({ name, barcode });
          }

          //Check duplicate products in list
          const existProInList = products.find(
            (product, index) =>
              product['B'] == barcode && index > 0 && index < i,
          );
          if (existProInList) {
            duplicateProducts.push({
              name: existProInList['A'],
              barcode: existProInList['B'],
            });
          }

          if (existProductVariant || existProInList) {
            continue;
          }

          let product = new Product();
          product.id = await this.repository.generateUUId();
          product.clientId = clientId;
          product.type = 0;
          product.name = name;
          product.isAutoGenerateSKU = 1;
          product.productOption = ProductionOptionEnums.STANDARD;
          product.serialType = ProductSerialTypeEnums.STANDARD;

          categoryName = categoryName ? categoryName.trim() : categoryName;
          let category: ProductType = await this.CategoryRepository.connection
            .createQueryBuilder<ProductType>('ProductType', 'Category')
            .select(['id'])
            .where(
              'clientId = :clientId AND (name = :name OR namekm = :name)',
              { clientId, name: categoryName },
            )
            .getRawOne();

          if (category) {
            product.categoryId = category.id;
          } else {
            category = new ProductType();
            category.id = await this.CategoryRepository.generateUUId();
            category.clientId = clientId;
            category.name = categoryName;
            category.namekm = categoryName;
            const existInCategoryList = categories.find(
              (value, index) => value.name == categoryName && index < i,
            );
            if (existInCategoryList) {
              product.categoryId = existInCategoryList.id;
            } else {
              await manager.insert(ProductType, category);
              product.categoryId = category.id;
              categories.push(category);
            }
          }

          let unit: Unit = await this.unitRepository.connection
            .createQueryBuilder<Unit>('Unit', 'U')
            .select(['id'])
            .where('clientId = :clientId AND name = :unitName', {
              clientId,
              unitName,
            })
            .getRawOne();

          if (unit) {
            product.stockUnitId = unit.id;
          } else {
            unit = new Unit();
            unit.id = await this.unitRepository.generateUUId();
            unit.clientId = clientId;
            unit.name = unitName;
            unit.multiple = 1;
            unit.label = unitName;
            const existUnitInList = units.find(
              (value, index) => value.name == unitName && index < i,
            );
            if (existUnitInList) {
              product.stockUnitId = existUnitInList.id;
            } else {
              await manager.insert(Unit, unit);
              product.stockUnitId = unit.id;
              units.push(unit);
            }
          }

          productArr.push(product);

          //Save products variant
          let productVariant: ProductVariant = new ProductVariant();
          productVariant.id =
            await this.productVariantRepository.generateUUId();
          productVariant.clientId = clientId;
          productVariant.productId = product.id;
          productVariant.name = name;
          productVariant.barcode = barcode;
          productVariant.isAutoGenerateSKU = 1;
          productVariant.cost = openingCost;
          productVariant.price = retailPrice;
          productVariant.wholePrice = wholePrice;
          productVariant.distributePrice = distrPrice;
          productVariant.quantity = openingStock;
          productVariantArr.push(productVariant);

          //Save product location if opening stock exist
          if (openingStock) {
            let productLocation: ProductLocation = new ProductLocation();
            productLocation.id =
              await this.productLocationRepository.generateUUId();
            productLocation.clientId = clientId;
            productLocation.productVariantId = productVariant.id;
            productLocation.quantity = openingStock;

            let location: Location = await this.locationRepository.connection
              .createQueryBuilder<Location>('Location', 'Location')
              .select(['id'])
              .where('clientId = :clientId AND isSystem = 1', { clientId })
              .getRawOne();
            productLocation.locationId = location.id;

            if (!location) {
              location = new Location();
              location.clientId = clientId;
              location.name = 'Main Store';
              location.code = '0001';
              location.isDefault = 1;
              location.isSystem = 1;
              const resultLocation: Location = await manager.save(
                Location,
                location,
              );
              location.id = resultLocation.id;
            }
            productLoactionArr.push(productLocation);
          }
        }
      }

      //TODO::Save products
      if (existProducts.length || duplicateProducts.length) {
        throw new BadRequestError(
          {
            message: 'You have insert existing product or duplicate',
            existProducts,
            duplicateProducts,
          },
          HttpCode.RecordExist,
        );
      }

      if (productArr.length) {
        await manager.insert(Product, productArr);
      }

      //TODO:Save products variant
      if (productVariantArr.length) {
        await manager.insert(ProductVariant, productVariantArr);
      }

      //TODO:Save product location if opening stock exist
      if (productLoactionArr.length) {
        await manager.insert(ProductLocation, productLoactionArr);
      }
    });
  }

  clearProducts(clientId: string) {
    getManager().transaction(async (manager) => {
      //Clear product
      await manager.delete(Product, { clientId });

      //Clear product variant
      await manager.delete(ProductVariant, { clientId });

      //Clear product location
      await manager.delete(ProductLocation, { clientId });

      //Clear transaction
      await manager.delete(Transaction, { clientId });
      await manager.delete(TransactionEntry, { clientId });
      await manager.delete(TransactionPayment, { clientId });
    });
  }
}

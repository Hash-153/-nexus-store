import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import { Router } from "../../../api/http/Router.ts";
import { InMemoryWarehouseRepository } from "../infrastructure/InMemoryWarehouseRepository.ts";
import { InMemoryInventoryItemRepository } from "../infrastructure/InMemoryInventoryItemRepository.ts";
import { InMemoryStockLevelRepository } from "../infrastructure/InMemoryStockLevelRepository.ts";
import { InMemoryStockMovementRepository } from "../infrastructure/InMemoryStockMovementRepository.ts";
import { InMemoryBinLocationRepository } from "../infrastructure/InMemoryBinLocationRepository.ts";
import { InMemoryRestockOrderRepository } from "../infrastructure/InMemoryRestockOrderRepository.ts";
import { InMemorySupplierRepository } from "../infrastructure/InMemorySupplierRepository.ts";
import { InMemoryPurchaseOrderRepository } from "../infrastructure/InMemoryPurchaseOrderRepository.ts";
import { InMemoryInventoryAdjustmentRepository } from "../infrastructure/InMemoryInventoryAdjustmentRepository.ts";
import { InMemoryLotBatchRepository } from "../infrastructure/InMemoryLotBatchRepository.ts";
import { InMemoryStockReservationRepository } from "../infrastructure/InMemoryStockReservationRepository.ts";
import { InMemoryTransferOrderRepository } from "../infrastructure/InMemoryTransferOrderRepository.ts";
import { CreateWarehouseUseCase } from "./CreateWarehouseUseCase.ts";
import { AdjustStockUseCase } from "./AdjustStockUseCase.ts";
import { ReserveStockUseCase } from "./ReserveStockUseCase.ts";
import { ReleaseReservationUseCase } from "./ReleaseReservationUseCase.ts";
import { FulfillReservationUseCase } from "./FulfillReservationUseCase.ts";
import { ReceivePurchaseOrderUseCase } from "./ReceivePurchaseOrderUseCase.ts";
import { CreateTransferOrderUseCase } from "./CreateTransferOrderUseCase.ts";
import { CompleteTransferOrderUseCase } from "./CompleteTransferOrderUseCase.ts";
import { AuditInventoryUseCase } from "./AuditInventoryUseCase.ts";
import { SetReorderPointUseCase } from "./SetReorderPointUseCase.ts";
import { TrackLotBatchUseCase } from "./TrackLotBatchUseCase.ts";
import { GetLowStockAlertsUseCase } from "./GetLowStockAlertsUseCase.ts";
import { GetStockMovementHistoryUseCase } from "./GetStockMovementHistoryUseCase.ts";

export interface InventoryWarehouseModuleContext {
  warehouseRepo: InMemoryWarehouseRepository;
  inventoryItemRepo: InMemoryInventoryItemRepository;
  stockLevelRepo: InMemoryStockLevelRepository;
  stockMovementRepo: InMemoryStockMovementRepository;
  binLocationRepo: InMemoryBinLocationRepository;
  restockOrderRepo: InMemoryRestockOrderRepository;
  supplierRepo: InMemorySupplierRepository;
  purchaseOrderRepo: InMemoryPurchaseOrderRepository;
  inventoryAdjustmentRepo: InMemoryInventoryAdjustmentRepository;
  lotBatchRepo: InMemoryLotBatchRepository;
  stockReservationRepo: InMemoryStockReservationRepository;
  transferOrderRepo: InMemoryTransferOrderRepository;
  createWarehouseUseCase: CreateWarehouseUseCase;
  adjustStockUseCase: AdjustStockUseCase;
  reserveStockUseCase: ReserveStockUseCase;
  releaseReservationUseCase: ReleaseReservationUseCase;
  fulfillReservationUseCase: FulfillReservationUseCase;
  receivePurchaseOrderUseCase: ReceivePurchaseOrderUseCase;
  createTransferOrderUseCase: CreateTransferOrderUseCase;
  completeTransferOrderUseCase: CompleteTransferOrderUseCase;
  auditInventoryUseCase: AuditInventoryUseCase;
  setReorderPointUseCase: SetReorderPointUseCase;
  trackLotBatchUseCase: TrackLotBatchUseCase;
  getLowStockAlertsUseCase: GetLowStockAlertsUseCase;
  getStockMovementHistoryUseCase: GetStockMovementHistoryUseCase;
}

export class InventoryWarehouseController {
  private readonly context: InventoryWarehouseModuleContext;

  constructor(eventBus: IEventBus) {
    const warehouseRepo = new InMemoryWarehouseRepository();
    const inventoryItemRepo = new InMemoryInventoryItemRepository();
    const stockLevelRepo = new InMemoryStockLevelRepository();
    const stockMovementRepo = new InMemoryStockMovementRepository();
    const binLocationRepo = new InMemoryBinLocationRepository();
    const restockOrderRepo = new InMemoryRestockOrderRepository();
    const supplierRepo = new InMemorySupplierRepository();
    const purchaseOrderRepo = new InMemoryPurchaseOrderRepository();
    const inventoryAdjustmentRepo = new InMemoryInventoryAdjustmentRepository();
    const lotBatchRepo = new InMemoryLotBatchRepository();
    const stockReservationRepo = new InMemoryStockReservationRepository();
    const transferOrderRepo = new InMemoryTransferOrderRepository();
    
    const createWarehouseUseCase = new CreateWarehouseUseCase(warehouseRepo, eventBus);
    const adjustStockUseCase = new AdjustStockUseCase(inventoryItemRepo, eventBus);
    const reserveStockUseCase = new ReserveStockUseCase(stockLevelRepo, eventBus);
    const releaseReservationUseCase = new ReleaseReservationUseCase(stockMovementRepo, eventBus);
    const fulfillReservationUseCase = new FulfillReservationUseCase(binLocationRepo, eventBus);
    const receivePurchaseOrderUseCase = new ReceivePurchaseOrderUseCase(restockOrderRepo, eventBus);
    const createTransferOrderUseCase = new CreateTransferOrderUseCase(supplierRepo, eventBus);
    const completeTransferOrderUseCase = new CompleteTransferOrderUseCase(purchaseOrderRepo, eventBus);
    const auditInventoryUseCase = new AuditInventoryUseCase(inventoryAdjustmentRepo, eventBus);
    const setReorderPointUseCase = new SetReorderPointUseCase(lotBatchRepo, eventBus);
    const trackLotBatchUseCase = new TrackLotBatchUseCase(stockReservationRepo, eventBus);
    const getLowStockAlertsUseCase = new GetLowStockAlertsUseCase(transferOrderRepo, eventBus);
    const getStockMovementHistoryUseCase = new GetStockMovementHistoryUseCase(warehouseRepo, eventBus);

    this.context = {
      warehouseRepo,
      inventoryItemRepo,
      stockLevelRepo,
      stockMovementRepo,
      binLocationRepo,
      restockOrderRepo,
      supplierRepo,
      purchaseOrderRepo,
      inventoryAdjustmentRepo,
      lotBatchRepo,
      stockReservationRepo,
      transferOrderRepo,
      createWarehouseUseCase,
      adjustStockUseCase,
      reserveStockUseCase,
      releaseReservationUseCase,
      fulfillReservationUseCase,
      receivePurchaseOrderUseCase,
      createTransferOrderUseCase,
      completeTransferOrderUseCase,
      auditInventoryUseCase,
      setReorderPointUseCase,
      trackLotBatchUseCase,
      getLowStockAlertsUseCase,
      getStockMovementHistoryUseCase,
    };
  }

  public getContext(): InventoryWarehouseModuleContext {
    return this.context;
  }

  public registerRoutes(router: Router): void {
    const basePath = "/api/v1/inventory-warehouse";

    
    router.register("GET", `${basePath}/warehouses`, async (req, res) => {
      const items = await this.context.warehouseRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/warehouses/:id`, async (req, res, params) => {
      const item = await this.context.warehouseRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "Warehouse not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/inventoryitems`, async (req, res) => {
      const items = await this.context.inventoryItemRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/inventoryitems/:id`, async (req, res, params) => {
      const item = await this.context.inventoryItemRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "InventoryItem not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/stocklevels`, async (req, res) => {
      const items = await this.context.stockLevelRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/stocklevels/:id`, async (req, res, params) => {
      const item = await this.context.stockLevelRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "StockLevel not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/stockmovements`, async (req, res) => {
      const items = await this.context.stockMovementRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/stockmovements/:id`, async (req, res, params) => {
      const item = await this.context.stockMovementRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "StockMovement not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/binlocations`, async (req, res) => {
      const items = await this.context.binLocationRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/binlocations/:id`, async (req, res, params) => {
      const item = await this.context.binLocationRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "BinLocation not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/restockorders`, async (req, res) => {
      const items = await this.context.restockOrderRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/restockorders/:id`, async (req, res, params) => {
      const item = await this.context.restockOrderRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "RestockOrder not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/suppliers`, async (req, res) => {
      const items = await this.context.supplierRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/suppliers/:id`, async (req, res, params) => {
      const item = await this.context.supplierRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "Supplier not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/purchaseorders`, async (req, res) => {
      const items = await this.context.purchaseOrderRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/purchaseorders/:id`, async (req, res, params) => {
      const item = await this.context.purchaseOrderRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "PurchaseOrder not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/inventoryadjustments`, async (req, res) => {
      const items = await this.context.inventoryAdjustmentRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/inventoryadjustments/:id`, async (req, res, params) => {
      const item = await this.context.inventoryAdjustmentRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "InventoryAdjustment not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/lotbatchs`, async (req, res) => {
      const items = await this.context.lotBatchRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/lotbatchs/:id`, async (req, res, params) => {
      const item = await this.context.lotBatchRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "LotBatch not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/stockreservations`, async (req, res) => {
      const items = await this.context.stockReservationRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/stockreservations/:id`, async (req, res, params) => {
      const item = await this.context.stockReservationRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "StockReservation not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/transferorders`, async (req, res) => {
      const items = await this.context.transferOrderRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/transferorders/:id`, async (req, res, params) => {
      const item = await this.context.transferOrderRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "TransferOrder not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    
    router.register("POST", `${basePath}/actions/createwarehouse`, async (req, res, params, body) => {
      const result = await this.context.createWarehouseUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/adjuststock`, async (req, res, params, body) => {
      const result = await this.context.adjustStockUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/reservestock`, async (req, res, params, body) => {
      const result = await this.context.reserveStockUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/releasereservation`, async (req, res, params, body) => {
      const result = await this.context.releaseReservationUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/fulfillreservation`, async (req, res, params, body) => {
      const result = await this.context.fulfillReservationUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/receivepurchaseorder`, async (req, res, params, body) => {
      const result = await this.context.receivePurchaseOrderUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/createtransferorder`, async (req, res, params, body) => {
      const result = await this.context.createTransferOrderUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/completetransferorder`, async (req, res, params, body) => {
      const result = await this.context.completeTransferOrderUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/auditinventory`, async (req, res, params, body) => {
      const result = await this.context.auditInventoryUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/setreorderpoint`, async (req, res, params, body) => {
      const result = await this.context.setReorderPointUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/tracklotbatch`, async (req, res, params, body) => {
      const result = await this.context.trackLotBatchUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/getlowstockalerts`, async (req, res, params, body) => {
      const result = await this.context.getLowStockAlertsUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/getstockmovementhistory`, async (req, res, params, body) => {
      const result = await this.context.getStockMovementHistoryUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    
  }
}

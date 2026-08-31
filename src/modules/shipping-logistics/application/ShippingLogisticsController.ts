import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import { Router } from "../../../api/http/Router.ts";
import { InMemoryShipmentRepository } from "../infrastructure/InMemoryShipmentRepository.ts";
import { InMemoryCarrierRepository } from "../infrastructure/InMemoryCarrierRepository.ts";
import { InMemoryShippingZoneRepository } from "../infrastructure/InMemoryShippingZoneRepository.ts";
import { InMemoryRateTableRepository } from "../infrastructure/InMemoryRateTableRepository.ts";
import { InMemoryBoxPackageRepository } from "../infrastructure/InMemoryBoxPackageRepository.ts";
import { InMemoryTrackingCheckpointRepository } from "../infrastructure/InMemoryTrackingCheckpointRepository.ts";
import { InMemoryCustomsDeclarationRepository } from "../infrastructure/InMemoryCustomsDeclarationRepository.ts";
import { InMemoryPickupLocationRepository } from "../infrastructure/InMemoryPickupLocationRepository.ts";
import { InMemoryDeliverySlotRepository } from "../infrastructure/InMemoryDeliverySlotRepository.ts";
import { CreateShipmentUseCase } from "./CreateShipmentUseCase.ts";
import { CalculateShippingRatesUseCase } from "./CalculateShippingRatesUseCase.ts";
import { GenerateShippingLabelUseCase } from "./GenerateShippingLabelUseCase.ts";
import { UpdateTrackingCheckpointUseCase } from "./UpdateTrackingCheckpointUseCase.ts";
import { MarkShipmentDeliveredUseCase } from "./MarkShipmentDeliveredUseCase.ts";
import { CancelShipmentUseCase } from "./CancelShipmentUseCase.ts";
import { ManageCarriersUseCase } from "./ManageCarriersUseCase.ts";
import { ConfigureShippingZonesUseCase } from "./ConfigureShippingZonesUseCase.ts";
import { SchedulePickupUseCase } from "./SchedulePickupUseCase.ts";
import { SelectDeliverySlotUseCase } from "./SelectDeliverySlotUseCase.ts";

export interface ShippingLogisticsModuleContext {
  shipmentRepo: InMemoryShipmentRepository;
  carrierRepo: InMemoryCarrierRepository;
  shippingZoneRepo: InMemoryShippingZoneRepository;
  rateTableRepo: InMemoryRateTableRepository;
  boxPackageRepo: InMemoryBoxPackageRepository;
  trackingCheckpointRepo: InMemoryTrackingCheckpointRepository;
  customsDeclarationRepo: InMemoryCustomsDeclarationRepository;
  pickupLocationRepo: InMemoryPickupLocationRepository;
  deliverySlotRepo: InMemoryDeliverySlotRepository;
  createShipmentUseCase: CreateShipmentUseCase;
  calculateShippingRatesUseCase: CalculateShippingRatesUseCase;
  generateShippingLabelUseCase: GenerateShippingLabelUseCase;
  updateTrackingCheckpointUseCase: UpdateTrackingCheckpointUseCase;
  markShipmentDeliveredUseCase: MarkShipmentDeliveredUseCase;
  cancelShipmentUseCase: CancelShipmentUseCase;
  manageCarriersUseCase: ManageCarriersUseCase;
  configureShippingZonesUseCase: ConfigureShippingZonesUseCase;
  schedulePickupUseCase: SchedulePickupUseCase;
  selectDeliverySlotUseCase: SelectDeliverySlotUseCase;
}

export class ShippingLogisticsController {
  private readonly context: ShippingLogisticsModuleContext;

  constructor(eventBus: IEventBus) {
    const shipmentRepo = new InMemoryShipmentRepository();
    const carrierRepo = new InMemoryCarrierRepository();
    const shippingZoneRepo = new InMemoryShippingZoneRepository();
    const rateTableRepo = new InMemoryRateTableRepository();
    const boxPackageRepo = new InMemoryBoxPackageRepository();
    const trackingCheckpointRepo = new InMemoryTrackingCheckpointRepository();
    const customsDeclarationRepo = new InMemoryCustomsDeclarationRepository();
    const pickupLocationRepo = new InMemoryPickupLocationRepository();
    const deliverySlotRepo = new InMemoryDeliverySlotRepository();
    
    const createShipmentUseCase = new CreateShipmentUseCase(shipmentRepo, eventBus);
    const calculateShippingRatesUseCase = new CalculateShippingRatesUseCase(carrierRepo, eventBus);
    const generateShippingLabelUseCase = new GenerateShippingLabelUseCase(shippingZoneRepo, eventBus);
    const updateTrackingCheckpointUseCase = new UpdateTrackingCheckpointUseCase(rateTableRepo, eventBus);
    const markShipmentDeliveredUseCase = new MarkShipmentDeliveredUseCase(boxPackageRepo, eventBus);
    const cancelShipmentUseCase = new CancelShipmentUseCase(trackingCheckpointRepo, eventBus);
    const manageCarriersUseCase = new ManageCarriersUseCase(customsDeclarationRepo, eventBus);
    const configureShippingZonesUseCase = new ConfigureShippingZonesUseCase(pickupLocationRepo, eventBus);
    const schedulePickupUseCase = new SchedulePickupUseCase(deliverySlotRepo, eventBus);
    const selectDeliverySlotUseCase = new SelectDeliverySlotUseCase(shipmentRepo, eventBus);

    this.context = {
      shipmentRepo,
      carrierRepo,
      shippingZoneRepo,
      rateTableRepo,
      boxPackageRepo,
      trackingCheckpointRepo,
      customsDeclarationRepo,
      pickupLocationRepo,
      deliverySlotRepo,
      createShipmentUseCase,
      calculateShippingRatesUseCase,
      generateShippingLabelUseCase,
      updateTrackingCheckpointUseCase,
      markShipmentDeliveredUseCase,
      cancelShipmentUseCase,
      manageCarriersUseCase,
      configureShippingZonesUseCase,
      schedulePickupUseCase,
      selectDeliverySlotUseCase,
    };
  }

  public getContext(): ShippingLogisticsModuleContext {
    return this.context;
  }

  public registerRoutes(router: Router): void {
    const basePath = "/api/v1/shipping-logistics";

    
    router.register("GET", `${basePath}/shipments`, async (req, res) => {
      const items = await this.context.shipmentRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/shipments/:id`, async (req, res, params) => {
      const item = await this.context.shipmentRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "Shipment not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/carriers`, async (req, res) => {
      const items = await this.context.carrierRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/carriers/:id`, async (req, res, params) => {
      const item = await this.context.carrierRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "Carrier not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/shippingzones`, async (req, res) => {
      const items = await this.context.shippingZoneRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/shippingzones/:id`, async (req, res, params) => {
      const item = await this.context.shippingZoneRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "ShippingZone not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/ratetables`, async (req, res) => {
      const items = await this.context.rateTableRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/ratetables/:id`, async (req, res, params) => {
      const item = await this.context.rateTableRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "RateTable not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/boxpackages`, async (req, res) => {
      const items = await this.context.boxPackageRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/boxpackages/:id`, async (req, res, params) => {
      const item = await this.context.boxPackageRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "BoxPackage not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/trackingcheckpoints`, async (req, res) => {
      const items = await this.context.trackingCheckpointRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/trackingcheckpoints/:id`, async (req, res, params) => {
      const item = await this.context.trackingCheckpointRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "TrackingCheckpoint not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/customsdeclarations`, async (req, res) => {
      const items = await this.context.customsDeclarationRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/customsdeclarations/:id`, async (req, res, params) => {
      const item = await this.context.customsDeclarationRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "CustomsDeclaration not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/pickuplocations`, async (req, res) => {
      const items = await this.context.pickupLocationRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/pickuplocations/:id`, async (req, res, params) => {
      const item = await this.context.pickupLocationRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "PickupLocation not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/deliveryslots`, async (req, res) => {
      const items = await this.context.deliverySlotRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/deliveryslots/:id`, async (req, res, params) => {
      const item = await this.context.deliverySlotRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "DeliverySlot not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    
    router.register("POST", `${basePath}/actions/createshipment`, async (req, res, params, body) => {
      const result = await this.context.createShipmentUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/calculateshippingrates`, async (req, res, params, body) => {
      const result = await this.context.calculateShippingRatesUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/generateshippinglabel`, async (req, res, params, body) => {
      const result = await this.context.generateShippingLabelUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/updatetrackingcheckpoint`, async (req, res, params, body) => {
      const result = await this.context.updateTrackingCheckpointUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/markshipmentdelivered`, async (req, res, params, body) => {
      const result = await this.context.markShipmentDeliveredUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/cancelshipment`, async (req, res, params, body) => {
      const result = await this.context.cancelShipmentUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/managecarriers`, async (req, res, params, body) => {
      const result = await this.context.manageCarriersUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/configureshippingzones`, async (req, res, params, body) => {
      const result = await this.context.configureShippingZonesUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/schedulepickup`, async (req, res, params, body) => {
      const result = await this.context.schedulePickupUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/selectdeliveryslot`, async (req, res, params, body) => {
      const result = await this.context.selectDeliverySlotUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    
  }
}

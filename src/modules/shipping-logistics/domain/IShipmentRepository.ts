import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { Shipment } from "./Shipment.ts";

export interface IShipmentRepository extends IRepository<Shipment> {
  findByOrderId(orderId: string): Promise<Shipment | null>;
  findByTrackingNumber(trackingNumber: string): Promise<Shipment | null>;
}

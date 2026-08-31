import { InMemoryRepository } from "../../../shared/infrastructure/Repository.ts";
import { Shipment } from "../domain/Shipment.ts";
import type { IShipmentRepository } from "../domain/IShipmentRepository.ts";

export class InMemoryShipmentRepository extends InMemoryRepository<Shipment> implements IShipmentRepository {
  public async findByOrderId(orderId: string): Promise<Shipment | null> {
    for (const s of this.items.values()) {
      if (s.orderId === orderId) {
        return s;
      }
    }
    return null;
  }

  public async findByTrackingNumber(trackingNumber: string): Promise<Shipment | null> {
    for (const s of this.items.values()) {
      if (s.trackingNumber === trackingNumber) {
        return s;
      }
    }
    return null;
  }
}

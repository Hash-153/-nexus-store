import { ShipmentStatus } from "../../domain/Shipment.ts";

export interface CreateShipmentDTO {
  orderId: string;
  carrier: string;
  trackingNumber: string;
  estimatedDeliveryDays?: number;
}

export interface ShipmentResponseDTO {
  id: string;
  orderId: string;
  carrier: string;
  trackingNumber: string;
  shippingAddress: string;
  status: ShipmentStatus;
  estimatedDeliveryDate?: string;
  createdAt: string;
}

import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { Order } from "./Order.ts";
import { OrderStatus } from "./OrderStatus.ts";

export interface IOrderRepository extends IRepository<Order> {
  findByUserId(userId: string): Promise<Order[]>;
  findByStatus(status: OrderStatus): Promise<Order[]>;
}

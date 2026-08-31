import { InMemoryRepository } from "../../../shared/infrastructure/Repository.ts";
import { Order } from "../domain/Order.ts";
import type { IOrderRepository } from "../domain/IOrderRepository.ts";
import type { OrderStatus } from "../domain/OrderStatus.ts";

export class InMemoryOrderRepository extends InMemoryRepository<Order> implements IOrderRepository {
  public async findByUserId(userId: string): Promise<Order[]> {
    return Array.from(this.items.values()).filter((o) => o.userId === userId);
  }

  public async findByStatus(status: OrderStatus): Promise<Order[]> {
    return Array.from(this.items.values()).filter((o) => o.status === status);
  }
}

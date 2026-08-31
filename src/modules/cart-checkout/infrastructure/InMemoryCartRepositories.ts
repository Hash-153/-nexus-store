import { InMemoryRepository } from "../../../shared/infrastructure/Repository.ts";
import { Cart } from "../domain/Cart.ts";
import type { ICartRepository } from "../domain/ICartRepository.ts";
import { Coupon } from "../domain/Coupon.ts";
import type { ICouponRepository } from "../domain/ICouponRepository.ts";

export class InMemoryCartRepository extends InMemoryRepository<Cart> implements ICartRepository {
  public async findByUserId(userId: string): Promise<Cart | null> {
    for (const cart of this.items.values()) {
      if (cart.userId === userId) {
        return cart;
      }
    }
    return null;
  }
}

export class InMemoryCouponRepository extends InMemoryRepository<Coupon> implements ICouponRepository {
  public async findByCode(code: string): Promise<Coupon | null> {
    const normalized = code.trim().toUpperCase();
    for (const coupon of this.items.values()) {
      if (coupon.code === normalized) {
        return coupon;
      }
    }
    return null;
  }
}


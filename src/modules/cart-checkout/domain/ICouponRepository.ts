import type { IRepository } from "../../../shared/infrastructure/Repository.ts";
import { Coupon } from "./Coupon.ts";

export interface ICouponRepository extends IRepository<Coupon> {
  findByCode(code: string): Promise<Coupon | null>;
}


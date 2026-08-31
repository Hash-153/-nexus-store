import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { ApplyCouponDTO, CartResponseDTO } from "./dtos/CartDTOs.ts";
import type { ICartRepository } from "../domain/ICartRepository.ts";
import type { ICouponRepository } from "../domain/ICouponRepository.ts";
import { NotFoundError } from "../../../shared/errors/DomainError.ts";
import { Cart } from "../domain/Cart.ts";

export class ApplyCouponUseCase implements IUseCase<ApplyCouponDTO, CartResponseDTO> {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly couponRepository: ICouponRepository
  ) {}

  public async execute(dto: ApplyCouponDTO): Promise<CartResponseDTO> {
    const cart = await this.cartRepository.findById(dto.cartId);
    if (!cart) {
      throw new NotFoundError("Cart", dto.cartId);
    }

    const coupon = await this.couponRepository.findByCode(dto.couponCode);
    if (!coupon) {
      throw new NotFoundError("Coupon", dto.couponCode);
    }

    cart.applyCoupon(coupon);
    await this.cartRepository.save(cart);

    return {
      id: cart.id,
      userId: cart.userId,
      items: cart.items.map((i) => ({
        id: i.id,
        productId: i.productId,
        variantId: i.variantId,
        sku: i.sku.value,
        title: i.title,
        variantName: i.variantName,
        unitPrice: i.unitPrice.amount,
        quantity: i.quantity.value,
        lineTotal: i.lineTotal.amount,
      })),
      totalItemsCount: cart.totalItemsCount,
      currency: cart.currency,
      subtotal: cart.subtotal.amount,
      discountTotal: cart.discountTotal.amount,
      total: cart.total.amount,
      appliedCouponCode: cart.appliedCoupon ? cart.appliedCoupon.code : null,
    };
  }
}

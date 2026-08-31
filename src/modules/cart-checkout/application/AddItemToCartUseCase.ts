import type { IUseCase } from "../../../shared/application/UseCase.ts";
import type { AddItemToCartDTO, CartResponseDTO } from "./dtos/CartDTOs.ts";
import type { ICartRepository } from "../domain/ICartRepository.ts";
import type { IProductRepository } from "../../product-catalog/domain/IProductRepository.ts";
import type { IInventoryRepository } from "../../inventory-warehouse/domain/IInventoryRepository.ts";
import { Cart } from "../domain/Cart.ts";
import { CartItem } from "../domain/CartItem.ts";
import { Quantity } from "../../../shared/domain/value-objects/Quantity.ts";
import { NotFoundError, BusinessRuleViolationError, ValidationError } from "../../../shared/errors/DomainError.ts";

export class AddItemToCartUseCase implements IUseCase<AddItemToCartDTO, CartResponseDTO> {
  constructor(
    private readonly cartRepository: ICartRepository,
    private readonly productRepository: IProductRepository,
    private readonly inventoryRepository: IInventoryRepository
  ) {}

  public async execute(dto: AddItemToCartDTO): Promise<CartResponseDTO> {
    if (dto.quantity <= 0) {
      throw new ValidationError("Quantity must be greater than zero.");
    }

    const product = await this.productRepository.findById(dto.productId);
    if (!product) {
      throw new NotFoundError("Product", dto.productId);
    }

    const variant = product.variants.find((v) => v.id === dto.variantId);
    if (!variant) {
      throw new NotFoundError("ProductVariant", dto.variantId);
    }

    // Verify stock availability
    const inventory = await this.inventoryRepository.findBySku(variant.sku.value);
    if (!inventory || inventory.availableQuantity.isLessThan(Quantity.create(dto.quantity))) {
      const available = inventory ? inventory.availableQuantity.value : 0;
      throw new BusinessRuleViolationError(
        `Insufficient stock for '${product.title} - ${variant.name}'. Requested: ${dto.quantity}, Available: ${available}`
      );
    }

    let cart: Cart | null = null;
    if (dto.cartId) {
      cart = await this.cartRepository.findById(dto.cartId);
    } else if (dto.userId) {
      cart = await this.cartRepository.findByUserId(dto.userId);
    }

    if (!cart) {
      cart = Cart.create({
        userId: dto.userId,
        currency: variant.price.currency,
      });
    }

    const item = CartItem.create({
      productId: product.id,
      variantId: variant.id,
      sku: variant.sku,
      title: product.title,
      variantName: variant.name,
      unitPrice: variant.price,
      quantity: Quantity.create(dto.quantity),
    });

    cart.addItem(item);
    await this.cartRepository.save(cart);

    return this.toDTO(cart);
  }

  private toDTO(cart: Cart): CartResponseDTO {
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

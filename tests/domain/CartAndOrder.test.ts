import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { Cart } from "../../src/modules/cart-checkout/domain/Cart.ts";
import { CartItem } from "../../src/modules/cart-checkout/domain/CartItem.ts";
import { Coupon } from "../../src/modules/cart-checkout/domain/Coupon.ts";
import { Order } from "../../src/modules/order-management/domain/Order.ts";
import { OrderItem } from "../../src/modules/order-management/domain/OrderItem.ts";
import { OrderStatus } from "../../src/modules/order-management/domain/OrderStatus.ts";
import { Money } from "../../src/shared/domain/value-objects/Money.ts";
import { SKU } from "../../src/shared/domain/value-objects/SKU.ts";
import { Quantity } from "../../src/shared/domain/value-objects/Quantity.ts";
import { Address } from "../../src/shared/domain/value-objects/Address.ts";
import { BusinessRuleViolationError, ValidationError } from "../../src/shared/errors/DomainError.ts";

describe("Cart and Order Domain State Machine Tests", () => {
  test("calculates cart subtotals and applies percentage discount", () => {
    const cart = Cart.create({ currency: "USD" });

    const item1 = CartItem.create({
      productId: "prod-1",
      variantId: "var-1",
      sku: SKU.create("SKU-PROD-1"),
      title: "Wireless Headphones",
      variantName: "Black",
      unitPrice: Money.create(100.0, "USD"),
      quantity: Quantity.create(2),
    });

    cart.addItem(item1);
    assert.equal(cart.subtotal.amount, 200.0);
    assert.equal(cart.total.amount, 200.0);

    const coupon = Coupon.create({
      code: "SAVE10",
      discountType: "PERCENTAGE",
      discountValue: 10,
    });

    cart.applyCoupon(coupon);
    assert.equal(cart.discountTotal.amount, 20.0);
    assert.equal(cart.total.amount, 180.0);
  });

  test("enforces order lifecycle state transitions", () => {
    const item = OrderItem.create({
      productId: "prod-1",
      variantId: "var-1",
      sku: SKU.create("SKU-PROD-1"),
      title: "Wireless Headphones",
      variantName: "Black",
      unitPrice: Money.create(100.0, "USD"),
      quantity: Quantity.create(1),
    });

    const address = Address.create({
      street: "123 Main St",
      city: "Seattle",
      stateOrProvince: "WA",
      postalCode: "98101",
      countryCode: "US",
    });

    const order = Order.create({
      items: [item],
      shippingAddress: address,
      currency: "USD",
      shippingFee: Money.create(10.0, "USD"),
      taxTotal: Money.create(5.0, "USD"),
    });

    assert.equal(order.status, OrderStatus.PENDING_PAYMENT);
    assert.equal(order.total.amount, 115.0); // 100 + 10 + 5

    // Valid: PENDING_PAYMENT -> PAID
    order.markAsPaid();
    assert.equal(order.status, OrderStatus.PAID);

    // Valid: PAID -> PROCESSING
    order.markAsProcessing();
    assert.equal(order.status, OrderStatus.PROCESSING);

    // Valid: PROCESSING -> SHIPPED
    order.markAsShipped();
    assert.equal(order.status, OrderStatus.SHIPPED);

    // Valid: SHIPPED -> DELIVERED
    order.markAsDelivered();
    assert.equal(order.status, OrderStatus.DELIVERED);

    // Invalid: DELIVERED -> PENDING_PAYMENT
    assert.throws(
      () => order.transitionTo(OrderStatus.PENDING_PAYMENT),
      BusinessRuleViolationError
    );
  });
});

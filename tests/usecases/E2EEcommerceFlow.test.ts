import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { ApplicationContainer } from "../../src/api/Container.ts";
import { UserRole } from "../../src/modules/identity-access/domain/UserRole.ts";
import { OrderStatus } from "../../src/modules/order-management/domain/OrderStatus.ts";
import { PaymentMethod } from "../../src/modules/payment-processing/domain/PaymentStatus.ts";
import { Coupon } from "../../src/modules/cart-checkout/domain/Coupon.ts";
import { Money } from "../../src/shared/domain/value-objects/Money.ts";

describe("End-to-End E-Commerce Customer & Store Journey", () => {
  test("full lifecycle: IAM -> Catalog -> Inventory -> Cart -> Order -> Payment -> Shipping -> Review -> Analytics", async () => {
    const container = ApplicationContainer.create();

    // 1. User Registration (Customer & Admin)
    const customer = await container.useCases.registerUserUseCase.execute({
      email: "jane.doe@example.com",
      password: "SuperSecretPassword123!",
      firstName: "Jane",
      lastName: "Doe",
      role: UserRole.CUSTOMER,
    });
    assert.ok(customer.id);
    assert.equal(customer.fullName, "Jane Doe");

    // Authenticate
    const session = await container.useCases.authenticateUserUseCase.execute({
      email: "jane.doe@example.com",
      password: "SuperSecretPassword123!",
    });
    assert.ok(session.token);

    // 2. Catalog Management: Create Category and Product
    const category = await container.useCases.createCategoryUseCase.execute({
      name: "Smart Audio",
      description: "High fidelity wireless audio gear",
    });
    assert.equal(category.slug, "smart-audio");

    const product = await container.useCases.createProductUseCase.execute({
      title: "Noise-Cancelling Headphones Pro",
      description: "Active noise cancelling with 40-hour battery life",
      categoryIds: [category.id],
      tags: ["audio", "wireless", "anc"],
      variants: [
        {
          sku: "ANC-HP-BLK",
          name: "Matte Black",
          price: 250.0,
          currency: "USD",
          attributes: { color: "Black" },
          weightInGrams: 300,
        },
        {
          sku: "ANC-HP-SLV",
          name: "Silver Gray",
          price: 250.0,
          currency: "USD",
          attributes: { color: "Silver" },
          weightInGrams: 300,
        },
      ],
      publishImmediately: true,
    });
    assert.equal(product.variants.length, 2);
    assert.equal(product.isPublished, true);

    // 3. Inventory Stocking
    const inventory = await container.useCases.adjustStockUseCase.execute({
      sku: "ANC-HP-BLK",
      warehouseLocation: "EAST-COAST-DC",
      quantityChange: 50,
      reorderThreshold: 10,
    });
    assert.equal(inventory.availableQuantity, 50);

    // 4. Setup Coupon
    const promoCoupon = Coupon.create({
      code: "WELCOME20",
      discountType: "PERCENTAGE",
      discountValue: 20, // 20% off
    });
    await container.repositories.couponRepository.save(promoCoupon);

    // 5. Customer Cart: Add items & Apply Coupon
    const cart = await container.useCases.addItemToCartUseCase.execute({
      userId: customer.id,
      productId: product.id,
      variantId: product.variants[0].id,
      quantity: 2, // 2 * $250 = $500
    });
    assert.equal(cart.totalItemsCount, 2);
    assert.equal(cart.subtotal, 500.0);

    const discountedCart = await container.useCases.applyCouponUseCase.execute({
      cartId: cart.id,
      couponCode: "WELCOME20",
    });
    assert.equal(discountedCart.discountTotal, 100.0); // 20% of 500 = 100
    assert.equal(discountedCart.total, 400.0);

    // 6. Checkout: Create Order
    const order = await container.useCases.createOrderFromCartUseCase.execute({
      cartId: cart.id,
      shippingAddress: {
        street: "742 Evergreen Terrace",
        city: "Springfield",
        stateOrProvince: "OR",
        postalCode: "97477",
        countryCode: "US",
      },
      shippingFee: 15.0,
      notes: "Please leave package by the porch.",
    });

    // Discounted subtotal ($400) + Tax (5% of $400 = $20) + Shipping ($15) = $435
    assert.equal(order.status, OrderStatus.PENDING_PAYMENT);
    assert.equal(order.subtotal, 500.0);
    assert.equal(order.discountTotal, 100.0);
    assert.equal(order.shippingFee, 15.0);
    assert.equal(order.taxTotal, 20.0);
    assert.equal(order.total, 435.0);

    // Verify stock was reserved
    const updatedInventory = await container.repositories.inventoryRepository.findBySku("ANC-HP-BLK");
    assert.equal(updatedInventory?.availableQuantity.value, 48);
    assert.equal(updatedInventory?.reservedQuantity.value, 2);

    // 7. Payment Processing
    const payment = await container.useCases.processPaymentUseCase.execute({
      orderId: order.id,
      method: PaymentMethod.CREDIT_CARD,
      paymentDetails: {
        cardNumberMasked: "**** **** **** 4242",
        cardHolderName: "Jane Doe",
      },
    });
    assert.equal(payment.status, "CAPTURED");
    assert.ok(payment.transactionReference?.startsWith("txn_"));

    // Verify order status transitioned to PAID
    const paidOrder = await container.repositories.orderRepository.findById(order.id);
    assert.equal(paidOrder?.status, OrderStatus.PAID);

    // 8. Shipping & Logistics
    const shipment = await container.useCases.createShipmentUseCase.execute({
      orderId: order.id,
      carrier: "FedEx",
      trackingNumber: "FDX-9988776655",
      estimatedDeliveryDays: 2,
    });
    assert.equal(shipment.carrier, "FedEx");
    assert.equal(shipment.status, "LABEL_CREATED");

    // Order state transitions to SHIPPED and stock is fulfilled
    const shippedOrder = await container.repositories.orderRepository.findById(order.id);
    assert.equal(shippedOrder?.status, OrderStatus.SHIPPED);

    const fulfilledInventory = await container.repositories.inventoryRepository.findBySku("ANC-HP-BLK");
    assert.equal(fulfilledInventory?.availableQuantity.value, 48);
    assert.equal(fulfilledInventory?.reservedQuantity.value, 0);

    // 9. Customer Review (Verified Purchase)
    const review = await container.useCases.createReviewUseCase.execute({
      productId: product.id,
      userId: customer.id,
      rating: 5,
      headline: "Incredible sound quality!",
      comment: "Best noise cancelling headphones I have ever used. Highly recommend!",
    });
    assert.equal(review.isVerifiedPurchase, true);
    assert.equal(review.rating, 5);

    const ratingSummary = await container.repositories.reviewRepository.getAverageRating(product.id);
    assert.equal(ratingSummary.average, 5);
    assert.equal(ratingSummary.count, 1);

    // 10. Analytics & Reporting
    const salesSummary = await container.services.analyticsService.getSalesSummary();
    assert.equal(salesSummary.totalOrders, 1);
    assert.equal(salesSummary.paidOrders, 1);
    assert.equal(salesSummary.grossRevenue, 500.0);
    assert.equal(salesSummary.netRevenue, 435.0);
    assert.equal(salesSummary.totalDiscountsGiven, 100.0);
    assert.equal(salesSummary.topSellingProducts.length, 1);
    assert.equal(salesSummary.topSellingProducts[0].productId, product.id);
    assert.equal(salesSummary.topSellingProducts[0].unitsSold, 2);
  });
});

import { InMemoryEventBus } from "../shared/infrastructure/EventBus.ts";
import { InMemoryUserRepository } from "../modules/identity-access/infrastructure/InMemoryUserRepository.ts";
import { RegisterUserUseCase } from "../modules/identity-access/application/RegisterUserUseCase.ts";
import { AuthenticateUserUseCase } from "../modules/identity-access/application/AuthenticateUserUseCase.ts";

import { InMemoryCategoryRepository, InMemoryProductRepository } from "../modules/product-catalog/infrastructure/InMemoryCatalogRepositories.ts";
import { CreateCategoryUseCase } from "../modules/product-catalog/application/CreateCategoryUseCase.ts";
import { CreateProductUseCase } from "../modules/product-catalog/application/CreateProductUseCase.ts";
import { GetProductCatalogUseCase } from "../modules/product-catalog/application/GetProductCatalogUseCase.ts";

import { InMemoryInventoryRepository } from "../modules/inventory-warehouse/infrastructure/InMemoryInventoryRepository.ts";
import { AdjustStockUseCase } from "../modules/inventory-warehouse/application/AdjustStockUseCase.ts";
import { ReserveStockUseCase } from "../modules/inventory-warehouse/application/ReserveStockUseCase.ts";
import { ReleaseStockUseCase } from "../modules/inventory-warehouse/application/ReleaseStockUseCase.ts";

import { InMemoryCartRepository, InMemoryCouponRepository } from "../modules/cart-checkout/infrastructure/InMemoryCartRepositories.ts";
import { AddItemToCartUseCase } from "../modules/cart-checkout/application/AddItemToCartUseCase.ts";
import { ApplyCouponUseCase } from "../modules/cart-checkout/application/ApplyCouponUseCase.ts";

import { InMemoryOrderRepository } from "../modules/order-management/infrastructure/InMemoryOrderRepository.ts";
import { CreateOrderFromCartUseCase } from "../modules/order-management/application/CreateOrderFromCartUseCase.ts";
import { UpdateOrderStatusUseCase } from "../modules/order-management/application/UpdateOrderStatusUseCase.ts";

import { MockPaymentGateway } from "../modules/payment-processing/infrastructure/MockPaymentGateway.ts";
import { InMemoryPaymentRepository } from "../modules/payment-processing/infrastructure/InMemoryPaymentRepository.ts";
import { ProcessPaymentUseCase } from "../modules/payment-processing/application/ProcessPaymentUseCase.ts";

import { InMemoryShipmentRepository } from "../modules/shipping-logistics/infrastructure/InMemoryShipmentRepository.ts";
import { CreateShipmentUseCase } from "../modules/shipping-logistics/application/CreateShipmentUseCase.ts";

import { InMemoryReviewRepository } from "../modules/reviews-ratings/infrastructure/InMemoryReviewRepository.ts";
import { CreateReviewUseCase } from "../modules/reviews-ratings/application/CreateReviewUseCase.ts";

import { AnalyticsService } from "../modules/analytics-reports/domain/AnalyticsService.ts";

export class ApplicationContainer {
  public static create() {
    const eventBus = InMemoryEventBus.getInstance();

    // Repositories
    const userRepository = new InMemoryUserRepository();
    const categoryRepository = new InMemoryCategoryRepository();
    const productRepository = new InMemoryProductRepository();
    const inventoryRepository = new InMemoryInventoryRepository();
    const cartRepository = new InMemoryCartRepository();
    const couponRepository = new InMemoryCouponRepository();
    const orderRepository = new InMemoryOrderRepository();
    const paymentRepository = new InMemoryPaymentRepository();
    const shipmentRepository = new InMemoryShipmentRepository();
    const reviewRepository = new InMemoryReviewRepository();

    // Gateways
    const paymentGateway = new MockPaymentGateway();

    // Use Cases - IAM
    const registerUserUseCase = new RegisterUserUseCase(userRepository, eventBus);
    const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);

    // Use Cases - Catalog
    const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
    const createProductUseCase = new CreateProductUseCase(productRepository, categoryRepository);
    const getProductCatalogUseCase = new GetProductCatalogUseCase(productRepository);

    // Use Cases - Inventory
    const adjustStockUseCase = new AdjustStockUseCase(inventoryRepository, eventBus);
    const reserveStockUseCase = new ReserveStockUseCase(inventoryRepository, eventBus);
    const releaseStockUseCase = new ReleaseStockUseCase(inventoryRepository);

    // Use Cases - Cart
    const addItemToCartUseCase = new AddItemToCartUseCase(cartRepository, productRepository, inventoryRepository);
    const applyCouponUseCase = new ApplyCouponUseCase(cartRepository, couponRepository);

    // Use Cases - Orders
    const createOrderFromCartUseCase = new CreateOrderFromCartUseCase(
      orderRepository,
      cartRepository,
      inventoryRepository,
      eventBus
    );
    const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository, inventoryRepository, eventBus);

    // Use Cases - Payments
    const processPaymentUseCase = new ProcessPaymentUseCase(
      paymentRepository,
      paymentGateway,
      orderRepository,
      eventBus
    );

    // Use Cases - Shipping
    const createShipmentUseCase = new CreateShipmentUseCase(
      shipmentRepository,
      orderRepository,
      inventoryRepository,
      eventBus
    );

    // Use Cases - Reviews
    const createReviewUseCase = new CreateReviewUseCase(reviewRepository, productRepository, orderRepository);

    // Analytics
    const analyticsService = new AnalyticsService(orderRepository, productRepository);

    return {
      eventBus,
      repositories: {
        userRepository,
        categoryRepository,
        productRepository,
        inventoryRepository,
        cartRepository,
        couponRepository,
        orderRepository,
        paymentRepository,
        shipmentRepository,
        reviewRepository,
      },
      gateways: {
        paymentGateway,
      },
      useCases: {
        registerUserUseCase,
        authenticateUserUseCase,
        createCategoryUseCase,
        createProductUseCase,
        getProductCatalogUseCase,
        adjustStockUseCase,
        reserveStockUseCase,
        releaseStockUseCase,
        addItemToCartUseCase,
        applyCouponUseCase,
        createOrderFromCartUseCase,
        updateOrderStatusUseCase,
        processPaymentUseCase,
        createShipmentUseCase,
        createReviewUseCase,
      },
      services: {
        analyticsService,
      },
    };
  }
}

import { createServer, Server as HttpServer } from "node:http";
import { Router } from "./Router.ts";
import { ApplicationContainer } from "../Container.ts";

export class EcommerceServer {
  private server: HttpServer;
  private router: Router;
  private container: ReturnType<typeof ApplicationContainer.create>;

  constructor(container: ReturnType<typeof ApplicationContainer.create>) {
    this.container = container;
    this.router = new Router();
    this.registerRoutes();

    this.server = createServer((req, res) => {
      // CORS headers
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

      if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }

      this.router.handle(req, res, this.container);
    });
  }

  private registerRoutes(): void {
    // Health check
    this.router.register("GET", "/api/health", (req, res) => {
      this.router.sendJson(res, 200, {
        status: "healthy",
        service: "enterprise-ecommerce-platform",
        timestamp: new Date().toISOString(),
      });
    });

    // IAM Routes
    this.router.register("POST", "/api/auth/register", async (req, res, params, body, c) => {
      const result = await c.useCases.registerUserUseCase.execute(body);
      this.router.sendJson(res, 201, { success: true, data: result });
    });

    this.router.register("POST", "/api/auth/login", async (req, res, params, body, c) => {
      const result = await c.useCases.authenticateUserUseCase.execute(body);
      this.router.sendJson(res, 200, { success: true, data: result });
    });

    // Catalog Routes
    this.router.register("GET", "/api/categories", async (req, res, params, body, c) => {
      const categories = await c.repositories.categoryRepository.findAll?.();
      this.router.sendJson(res, 200, {
        success: true,
        data: (categories || []).map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          parentId: cat.parentId,
        })),
      });
    });

    this.router.register("POST", "/api/categories", async (req, res, params, body, c) => {
      const result = await c.useCases.createCategoryUseCase.execute(body);
      this.router.sendJson(res, 201, { success: true, data: result });
    });

    this.router.register("GET", "/api/products", async (req, res, params, body, c) => {
      const url = new URL(req.url || "/", "http://localhost");
      const categoryId = url.searchParams.get("categoryId") || undefined;
      const searchQuery = url.searchParams.get("q") || undefined;
      const products = await c.useCases.getProductCatalogUseCase.execute({
        categoryId,
        searchQuery,
      });
      this.router.sendJson(res, 200, { success: true, data: products });
    });

    this.router.register("POST", "/api/products", async (req, res, params, body, c) => {
      const result = await c.useCases.createProductUseCase.execute(body);
      this.router.sendJson(res, 201, { success: true, data: result });
    });

    // Inventory Routes
    this.router.register("POST", "/api/inventory/adjust", async (req, res, params, body, c) => {
      const result = await c.useCases.adjustStockUseCase.execute(body);
      this.router.sendJson(res, 200, { success: true, data: result });
    });

    // Cart Routes
    this.router.register("POST", "/api/cart/items", async (req, res, params, body, c) => {
      const result = await c.useCases.addItemToCartUseCase.execute(body);
      this.router.sendJson(res, 200, { success: true, data: result });
    });

    this.router.register("POST", "/api/cart/coupon", async (req, res, params, body, c) => {
      const result = await c.useCases.applyCouponUseCase.execute(body);
      this.router.sendJson(res, 200, { success: true, data: result });
    });

    // Order Routes
    this.router.register("POST", "/api/orders", async (req, res, params, body, c) => {
      const result = await c.useCases.createOrderFromCartUseCase.execute(body);
      this.router.sendJson(res, 201, { success: true, data: result });
    });

    this.router.register("PATCH", "/api/orders/:orderId/status", async (req, res, params, body, c) => {
      const result = await c.useCases.updateOrderStatusUseCase.execute({
        orderId: params.orderId,
        newStatus: body.newStatus,
        reason: body.reason,
      });
      this.router.sendJson(res, 200, { success: true, data: result });
    });

    // Payment Routes
    this.router.register("POST", "/api/payments/process", async (req, res, params, body, c) => {
      const result = await c.useCases.processPaymentUseCase.execute(body);
      this.router.sendJson(res, 200, { success: true, data: result });
    });

    // Shipping Routes
    this.router.register("POST", "/api/shipments", async (req, res, params, body, c) => {
      const result = await c.useCases.createShipmentUseCase.execute(body);
      this.router.sendJson(res, 201, { success: true, data: result });
    });

    // Review Routes
    this.router.register("POST", "/api/reviews", async (req, res, params, body, c) => {
      const result = await c.useCases.createReviewUseCase.execute(body);
      this.router.sendJson(res, 201, { success: true, data: result });
    });

    // Analytics
    this.router.register("GET", "/api/analytics/sales", async (req, res, params, body, c) => {
      const result = await c.services.analyticsService.getSalesSummary();
      this.router.sendJson(res, 200, { success: true, data: result });
    });
  }

  public listen(port: number = 3000): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(port, () => {
        console.log(`[EcommerceServer] Server running on http://localhost:${port}`);
        resolve();
      });
    });
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.close((err) => (err ? reject(err) : resolve()));
    });
  }
}

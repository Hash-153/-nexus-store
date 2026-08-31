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

    // Interactive Web Dashboard & Storefront
    this.router.register("GET", "/", async (req, res, params, body, c) => {
      const products = await c.useCases.getProductCatalogUseCase.execute();
      const categories = (await c.repositories.categoryRepository.findAll?.()) || [];
      const analytics = await c.services.analyticsService.getSalesSummary();

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Enterprise E-Commerce Platform</title>
  <style>
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --bg: #0f172a;
      --surface: #1e293b;
      --surface-light: #334155;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #10b981;
      --border: #334155;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); padding: 24px; }
    .container { max-width: 1200px; margin: 0 auto; }
    header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 24px; border-bottom: 1px solid var(--border); margin-bottom: 24px; }
    .logo { font-size: 24px; font-weight: 700; color: #60a5fa; display: flex; align-items: center; gap: 8px; }
    .badge { background: #065f46; color: #34d399; font-size: 12px; padding: 4px 10px; border-radius: 9999px; font-weight: 600; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 32px; }
    .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
    .stat-card h4 { color: var(--text-muted); font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
    .stat-card .val { font-size: 28px; font-weight: 700; color: #fff; }
    .section-title { font-size: 20px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-bottom: 40px; }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; }
    .card h3 { font-size: 18px; margin-bottom: 8px; color: #fff; }
    .card p { color: var(--text-muted); font-size: 14px; margin-bottom: 16px; flex-grow: 1; }
    .price-tag { font-size: 22px; font-weight: 700; color: var(--accent); }
    .btn { background: var(--primary); color: #fff; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; text-align: center; text-decoration: none; display: inline-block; }
    .btn:hover { background: var(--primary-dark); }
    .api-box { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; margin-top: 24px; }
    .endpoint-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }
    .endpoint-item { display: flex; align-items: center; gap: 12px; font-family: monospace; font-size: 14px; }
    .method { padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 11px; }
    .get { background: #0369a1; color: #bae6fd; }
    .post { background: #047857; color: #a7f3d0; }
    .patch { background: #b45309; color: #fde68a; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="logo">🛒 Enterprise E-Commerce Platform <span class="badge">RUNNING • PORT 3000</span></div>
      <div>
        <a href="/api/health" class="btn" target="_blank">Health Check JSON</a>
        <a href="/api/products" class="btn" style="background:#475569;" target="_blank">Catalog API</a>
      </div>
    </header>

    <div class="stats-grid">
      <div class="stat-card">
        <h4>Gross Revenue</h4>
        <div class="val">$${analytics.grossRevenue.toFixed(2)}</div>
      </div>
      <div class="stat-card">
        <h4>Net Revenue</h4>
        <div class="val">$${analytics.netRevenue.toFixed(2)}</div>
      </div>
      <div class="stat-card">
        <h4>Paid Orders</h4>
        <div class="val">${analytics.paidOrders}</div>
      </div>
      <div class="stat-card">
        <h4>Published Products</h4>
        <div class="val">${products.length}</div>
      </div>
    </div>

    <div class="section-title">
      <span>Featured Products Catalog</span>
      <span style="font-size:14px; color:var(--text-muted);">${categories.length} Categories Available</span>
    </div>

    <div class="grid">
      ${products.map(p => `
        <div class="card">
          <div>
            <div style="font-size:12px; color:#60a5fa; font-weight:600; margin-bottom:4px;">SKU: ${p.variants[0]?.sku || 'N/A'}</div>
            <h3>${p.title}</h3>
            <p>${p.description}</p>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
            <div class="price-tag">$${(p.variants[0]?.price || 0).toFixed(2)}</div>
            <button class="btn" onclick="alert('Item ${p.title} added to cart!')">Add to Cart</button>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="api-box">
      <h3 style="margin-bottom: 16px;">Core REST API Endpoints</h3>
      <ul class="endpoint-list">
        <li class="endpoint-item"><span class="method get">GET</span> <span>/api/health</span> &mdash; Service health check</li>
        <li class="endpoint-item"><span class="method get">GET</span> <span>/api/products</span> &mdash; Query published product catalog</li>
        <li class="endpoint-item"><span class="method get">GET</span> <span>/api/categories</span> &mdash; Retrieve category hierarchy</li>
        <li class="endpoint-item"><span class="method post">POST</span> <span>/api/auth/register</span> &mdash; Customer registration</li>
        <li class="endpoint-item"><span class="method post">POST</span> <span>/api/cart/items</span> &mdash; Add SKU to shopping cart</li>
        <li class="endpoint-item"><span class="method post">POST</span> <span>/api/orders</span> &mdash; Checkout cart and generate order</li>
        <li class="endpoint-item"><span class="method post">POST</span> <span>/api/payments/process</span> &mdash; Process payment transaction</li>
        <li class="endpoint-item"><span class="method get">GET</span> <span>/api/analytics/sales</span> &mdash; Real-time revenue analytics</li>
      </ul>
    </div>
  </div>
</body>
</html>`;

      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    });

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

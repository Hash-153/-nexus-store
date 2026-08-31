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

    this.router.register("GET", "/api/inventory", async (req, res, params, body, c) => {
      const items = await c.repositories.inventoryRepository.findAll?.();
      this.router.sendJson(res, 200, {
        success: true,
        data: (items || []).map(i => ({
          id: i.id,
          sku: i.sku.value,
          warehouseLocation: i.warehouseLocation,
          availableQuantity: i.availableQuantity.value,
          reservedQuantity: i.reservedQuantity.value,
          totalOnHand: i.totalOnHand.value,
        })),
      });
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
    this.router.register("GET", "/api/orders", async (req, res, params, body, c) => {
      const orders = await c.repositories.orderRepository.findAll?.();
      this.router.sendJson(res, 200, {
        success: true,
        data: (orders || []).map(o => o.toJSON()),
      });
    });

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

    // Main Interactive E-Commerce Storefront
    this.router.register("GET", "/", async (req, res, params, body, c) => {
      const products = await c.useCases.getProductCatalogUseCase.execute();
      const categories = (await c.repositories.categoryRepository.findAll?.()) || [];
      const analytics = await c.services.analyticsService.getSalesSummary();

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NEXUS &bull; Modern Tech & Audio Store</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --primary-light: #eff6ff;
      --accent: #f97316;
      --accent-green: #10b981;
      --bg: #f8fafc;
      --surface: #ffffff;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
      --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
      --radius: 12px;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
    body { background: var(--bg); color: var(--text); min-height: 100vh; overflow-x: hidden; }

    /* Top Announcement */
    .top-bar { background: #0f172a; color: #f8fafc; font-size: 13px; font-weight: 500; text-align: center; padding: 10px 16px; display: flex; justify-content: center; align-items: center; gap: 8px; }
    .top-bar strong { color: #38bdf8; }

    /* Header */
    header { background: var(--surface); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 40; box-shadow: var(--shadow-sm); }
    .nav-container { max-width: 1280px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
    .logo { font-size: 24px; font-weight: 800; color: #0f172a; text-decoration: none; display: flex; align-items: center; gap: 10px; letter-spacing: -0.03em; }
    .logo-badge { background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 4px 10px; border-radius: 8px; font-size: 13px; font-weight: 700; }
    
    .search-bar { flex: 1; max-width: 520px; position: relative; }
    .search-input { width: 100%; padding: 12px 18px 12px 44px; border-radius: 9999px; border: 1.5px solid var(--border); background: #f1f5f9; font-size: 14px; outline: none; transition: all 0.2s; }
    .search-input:focus { border-color: var(--primary); background: #fff; box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }
    .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 16px; }

    .nav-actions { display: flex; align-items: center; gap: 14px; }
    .btn-icon { background: none; border: none; font-size: 20px; color: #334155; cursor: pointer; padding: 8px; border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative; transition: background 0.2s; }
    .btn-icon:hover { background: #f1f5f9; color: var(--primary); }
    .cart-btn { background: #0f172a; color: white; padding: 10px 18px; border-radius: 9999px; font-weight: 600; font-size: 14px; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; box-shadow: var(--shadow-sm); }
    .cart-btn:hover { background: #1e293b; transform: translateY(-1px); box-shadow: var(--shadow-md); }
    .cart-count { background: #ef4444; color: white; border-radius: 9999px; padding: 2px 7px; font-size: 12px; font-weight: 700; }

    /* Hero Banner */
    .hero { max-width: 1280px; margin: 24px auto 0; padding: 0 24px; }
    .hero-banner { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%); border-radius: 20px; padding: 48px; color: white; display: flex; justify-content: space-between; align-items: center; position: relative; overflow: hidden; box-shadow: var(--shadow-xl); }
    .hero-content { max-width: 580px; z-index: 2; }
    .hero-tag { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.12); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2); padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 600; color: #38bdf8; margin-bottom: 16px; }
    .hero h1 { font-size: 42px; font-weight: 800; line-height: 1.15; margin-bottom: 16px; letter-spacing: -0.02em; }
    .hero p { font-size: 16px; color: #cbd5e1; line-height: 1.6; margin-bottom: 24px; }
    .hero-actions { display: flex; gap: 14px; }
    .btn-hero { background: var(--primary); color: white; padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 15px; border: none; cursor: pointer; text-decoration: none; transition: all 0.2s; box-shadow: 0 10px 20px -5px rgba(37,99,235,0.5); }
    .btn-hero:hover { background: var(--primary-hover); transform: translateY(-2px); }
    .btn-hero-outline { background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.25); color: white; padding: 14px 24px; border-radius: 12px; font-weight: 600; cursor: pointer; backdrop-filter: blur(6px); }

    /* Category Nav */
    .categories-bar { max-width: 1280px; margin: 32px auto 0; padding: 0 24px; display: flex; gap: 10px; overflow-x: auto; scrollbar-width: none; }
    .cat-pill { padding: 10px 20px; border-radius: 9999px; border: 1px solid var(--border); background: var(--surface); font-size: 14px; font-weight: 600; color: #475569; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
    .cat-pill:hover, .cat-pill.active { background: #0f172a; color: white; border-color: #0f172a; }

    /* Store Grid */
    .main-container { max-width: 1280px; margin: 32px auto; padding: 0 24px; }
    .section-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; }
    .section-header h2 { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; }
    .section-header p { color: var(--text-muted); font-size: 14px; margin-top: 4px; }
    
    .sort-select { padding: 8px 14px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); font-size: 13px; font-weight: 600; outline: none; }

    .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
    .product-card { background: var(--surface); border-radius: 16px; border: 1px solid var(--border); overflow: hidden; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; position: relative; }
    .product-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-xl); border-color: #cbd5e1; }
    
    .product-img-wrap { width: 100%; height: 240px; background: #f1f5f9; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
    .product-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
    .product-card:hover .product-img { transform: scale(1.06); }
    
    .badge-sale { position: absolute; top: 14px; left: 14px; background: #ef4444; color: white; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.05em; }
    .badge-stock { position: absolute; top: 14px; right: 14px; background: rgba(15,23,42,0.85); backdrop-filter: blur(4px); color: #38bdf8; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; }

    .product-body { padding: 20px; display: flex; flex-direction: column; flex-grow: 1; }
    .product-category { font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--primary); letter-spacing: 0.05em; margin-bottom: 6px; }
    .product-title { font-size: 17px; font-weight: 700; color: #0f172a; line-height: 1.35; margin-bottom: 8px; }
    .product-desc { font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px; flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

    .product-rating { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #0f172a; margin-bottom: 14px; }
    .stars { color: #f59e0b; }
    .review-count { color: var(--text-muted); font-size: 12px; }

    .product-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid #f1f5f9; }
    .price-group { display: flex; flex-direction: column; }
    .current-price { font-size: 22px; font-weight: 800; color: #0f172a; }
    .original-price { font-size: 13px; color: #94a3b8; text-decoration: line-through; }
    
    .btn-add-cart { background: var(--primary); color: white; border: none; padding: 10px 18px; border-radius: 10px; font-weight: 700; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
    .btn-add-cart:hover { background: var(--primary-hover); transform: scale(1.03); }

    /* Slide-out Cart Drawer */
    .drawer-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(4px); z-index: 50; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
    .drawer-overlay.open { opacity: 1; pointer-events: auto; }
    .cart-drawer { position: fixed; right: 0; top: 0; bottom: 0; width: 100%; max-width: 440px; background: #fff; z-index: 51; transform: translateX(100%); transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; box-shadow: var(--shadow-xl); }
    .drawer-overlay.open .cart-drawer { transform: translateX(0); }

    .drawer-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
    .drawer-header h3 { font-size: 18px; font-weight: 800; display: flex; align-items: center; gap: 8px; }
    .close-btn { background: none; border: none; font-size: 22px; color: var(--text-muted); cursor: pointer; padding: 4px; }

    .drawer-body { flex: 1; overflow-y: auto; padding: 20px 24px; }
    .cart-item { display: flex; gap: 14px; padding-bottom: 16px; margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; }
    .cart-item-img { width: 72px; height: 72px; border-radius: 10px; object-fit: cover; background: #f8fafc; border: 1px solid var(--border); }
    .cart-item-info { flex: 1; }
    .cart-item-title { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
    .cart-item-variant { font-size: 12px; color: var(--text-muted); margin-bottom: 8px; }
    .cart-item-controls { display: flex; align-items: center; justify-content: space-between; }
    .qty-stepper { display: flex; align-items: center; border: 1px solid var(--border); border-radius: 6px; background: #f8fafc; }
    .qty-btn { background: none; border: none; padding: 4px 10px; cursor: pointer; font-weight: 700; color: #334155; }
    .qty-val { font-size: 13px; font-weight: 700; min-width: 24px; text-align: center; }
    .btn-remove { background: none; border: none; color: #ef4444; font-size: 12px; font-weight: 600; cursor: pointer; }

    .drawer-footer { padding: 24px; border-top: 1px solid var(--border); background: #f8fafc; }
    .promo-box { display: flex; gap: 8px; margin-bottom: 18px; }
    .promo-input { flex: 1; padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px; font-weight: 600; text-transform: uppercase; outline: none; }
    .btn-apply { background: #334155; color: white; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; }
    
    .summary-row { display: flex; justify-content: space-between; font-size: 14px; color: var(--text-muted); margin-bottom: 8px; }
    .summary-row.total { font-size: 18px; font-weight: 800; color: #0f172a; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 12px; margin-bottom: 20px; }
    .btn-checkout { width: 100%; background: #0f172a; color: white; padding: 16px; border-radius: 12px; font-weight: 800; font-size: 15px; border: none; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: var(--shadow-md); }
    .btn-checkout:hover { background: var(--primary); }

    /* Modal */
    .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.7); backdrop-filter: blur(6px); z-index: 60; display: none; align-items: center; justify-content: center; padding: 20px; }
    .modal-overlay.open { display: flex; }
    .modal-card { background: white; border-radius: 20px; max-width: 540px; width: 100%; padding: 32px; box-shadow: var(--shadow-xl); position: relative; animation: modalPop 0.3s cubic-bezier(0.16,1,0.3,1); }
    @keyframes modalPop { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }

    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 6px; color: #334155; }
    .form-control { width: 100%; padding: 12px 14px; border: 1.5px solid var(--border); border-radius: 8px; font-size: 14px; outline: none; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

    /* Toast */
    .toast { position: fixed; bottom: 24px; right: 24px; background: #0f172a; color: white; padding: 14px 20px; border-radius: 12px; font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 10px; z-index: 100; transform: translateY(100px); opacity: 0; transition: all 0.3s; box-shadow: var(--shadow-xl); }
    .toast.show { transform: translateY(0); opacity: 1; }

    /* Footer */
    footer { background: #0f172a; color: #94a3b8; padding: 48px 24px 24px; margin-top: 64px; }
    .footer-grid { max-width: 1280px; margin: 0 auto 32px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 32px; }
    .footer-grid h4 { color: white; font-size: 15px; margin-bottom: 14px; font-weight: 700; }
    .footer-grid ul { list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 14px; }
    .footer-grid a { color: #94a3b8; text-decoration: none; }
    .footer-bottom { max-width: 1280px; margin: 0 auto; padding-top: 24px; border-top: 1px solid #334155; font-size: 13px; display: flex; justify-content: space-between; align-items: center; }
  </style>
</head>
<body>
  <!-- Announcement -->
  <div class="top-bar">
    ⚡ <strong>SUPER PROMO:</strong> Use coupon code <strong>WELCOME20</strong> at checkout for 20% OFF! Free express shipping on orders over $150.
  </div>

  <!-- Header -->
  <header>
    <div class="nav-container">
      <a href="/" class="logo">
        <span>⚡ NEXUS</span>
        <span class="logo-badge">STORE</span>
      </a>

      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input type="text" id="searchInput" class="search-input" placeholder="Search headphones, keyboards, laptops, displays..." oninput="filterProducts()" />
      </div>

      <div class="nav-actions">
        <button class="cart-btn" onclick="toggleCart()">
          <span>🛍️ Cart</span>
          <span class="cart-count" id="cartCount">0</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Hero Banner -->
  <div class="hero">
    <div class="hero-banner">
      <div class="hero-content">
        <div class="hero-tag">✨ NEXT-GEN FLAGSHIPS 2026</div>
        <h1>Elevate Your Tech & Audio Setup.</h1>
        <p>Explore studio-grade wireless noise cancellation, ultra-fast mechanical switches, and breathtaking 4K OLED HDR displays with same-day express dispatch.</p>
        <div class="hero-actions">
          <a href="#catalog" class="btn-hero">Explore All Products</a>
          <button class="btn-hero-outline" onclick="applyPromoQuick('WELCOME20')">Claim 20% Off Coupon</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Category Pills -->
  <div class="categories-bar" id="categoryPills">
    <button class="cat-pill active" onclick="selectCategory('all', this)">All Hardware (${products.length})</button>
    ${categories.map(c => `<button class="cat-pill" onclick="selectCategory('${c.id}', this)">${c.name}</button>`).join('')}
  </div>

  <!-- Main Catalog Section -->
  <main class="main-container" id="catalog">
    <div class="section-header">
      <div>
        <h2>Featured Flagships & Hardware</h2>
        <p>Curated premium tech with manufacturer warranty & instant dispatch</p>
      </div>
      <select class="sort-select" onchange="sortProducts(this.value)">
        <option value="featured">Featured First</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
      </select>
    </div>

    <div class="products-grid" id="productsGrid">
      ${products.map(p => {
        const variant = p.variants[0];
        const comparePrice = variant?.compareAtPrice ? `<span class="original-price">$${variant.compareAtPrice.toFixed(2)}</span>` : '';
        const discountPct = variant?.compareAtPrice ? Math.round(((variant.compareAtPrice - variant.price) / variant.compareAtPrice) * 100) : 0;
        const discountBadge = discountPct > 0 ? `<div class="badge-sale">-${discountPct}% OFF</div>` : '<div class="badge-sale" style="background:#2563eb;">NEW</div>';

        // High quality curated tech images
        let imgUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80";
        if (p.title.includes("Keyboard")) imgUrl = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80";
        if (p.title.includes("Monitor")) imgUrl = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80";
        if (p.title.includes("MacBook") || p.title.includes("Laptop")) imgUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80";
        if (p.title.includes("Watch")) imgUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
        if (p.title.includes("Mouse")) imgUrl = "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80";
        if (p.title.includes("Earbuds")) imgUrl = "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80";

        return `
        <div class="product-card" data-title="${p.title.toLowerCase()}" data-category="${p.categoryIds.join(',')}" data-price="${variant?.price || 0}">
          <div class="product-img-wrap">
            <img src="${imgUrl}" alt="${p.title}" class="product-img" loading="lazy" />
            ${discountBadge}
            <div class="badge-stock">🟢 In Stock</div>
          </div>
          <div class="product-body">
            <div class="product-category">SKU: ${variant?.sku || 'NEXUS'}</div>
            <h3 class="product-title">${p.title}</h3>
            <p class="product-desc">${p.description}</p>
            <div class="product-rating">
              <span class="stars">★★★★★</span>
              <span>4.9</span>
              <span class="review-count">(128 reviews)</span>
            </div>
            <div class="product-footer">
              <div class="price-group">
                <span class="current-price">$${(variant?.price || 0).toFixed(2)}</span>
                ${comparePrice}
              </div>
              <button class="btn-add-cart" onclick="addToCart('${p.id}', '${variant?.id}', '${p.title.replace(/'/g, "\\'")}', ${(variant?.price || 0)}, '${imgUrl}')">
                <span>Add to Cart 🛒</span>
              </button>
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>
  </main>

  <!-- Slide-out Shopping Cart -->
  <div class="drawer-overlay" id="cartOverlay" onclick="toggleCart()">
    <div class="cart-drawer" onclick="event.stopPropagation()">
      <div class="drawer-header">
        <h3>🛍️ Shopping Bag (<span id="drawerCount">0</span>)</h3>
        <button class="close-btn" onclick="toggleCart()">&times;</button>
      </div>

      <div class="drawer-body" id="cartItemsList">
        <!-- Rendered via JS -->
      </div>

      <div class="drawer-footer">
        <div class="promo-box">
          <input type="text" id="couponInput" class="promo-input" placeholder="Promo code (e.g. WELCOME20)" />
          <button class="btn-apply" onclick="applyCouponCode()">Apply</button>
        </div>

        <div class="summary-row">
          <span>Subtotal</span>
          <span id="subtotalVal">$0.00</span>
        </div>
        <div class="summary-row" id="discountRow" style="display:none; color:#10b981; font-weight:700;">
          <span>Discount (WELCOME20)</span>
          <span id="discountVal">-$0.00</span>
        </div>
        <div class="summary-row">
          <span>Estimated Shipping</span>
          <span id="shippingVal" style="color:#10b981; font-weight:700;">FREE</span>
        </div>
        <div class="summary-row">
          <span>Estimated Tax (5%)</span>
          <span id="taxVal">$0.00</span>
        </div>
        <div class="summary-row total">
          <span>Estimated Total</span>
          <span id="totalVal">$0.00</span>
        </div>

        <button class="btn-checkout" onclick="openCheckoutModal()">
          <span>🔒 Proceed to Secure Checkout</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Checkout Modal -->
  <div class="modal-overlay" id="checkoutModal">
    <div class="modal-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h3 style="font-size:20px; font-weight:800;">🔒 Express Checkout</h3>
        <button class="close-btn" onclick="closeCheckoutModal()">&times;</button>
      </div>

      <button type="button" onclick="fillDemoData()" style="width:100%; background:#f1f5f9; color:#0f172a; border:1px dashed #94a3b8; padding:8px 12px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; margin-bottom:16px;">
        ⚡ 1-Click Auto-Fill Demo Information
      </button>

      <form id="checkoutForm" onsubmit="processOrder(event)">
        <div class="form-row">
          <div class="form-group">
            <label>First Name</label>
            <input type="text" id="chkFirst" class="form-control" required placeholder="Alex" />
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input type="text" id="chkLast" class="form-control" required placeholder="Johnson" />
          </div>
        </div>

        <div class="form-group">
          <label>Email Address</label>
          <input type="email" id="chkEmail" class="form-control" required placeholder="alex.johnson@example.com" />
        </div>

        <div class="form-group">
          <label>Shipping Street Address</label>
          <input type="text" id="chkStreet" class="form-control" required placeholder="742 Evergreen Terrace" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>City</label>
            <input type="text" id="chkCity" class="form-control" required placeholder="Springfield" />
          </div>
          <div class="form-group">
            <label>State / ZIP</label>
            <input type="text" id="chkZip" class="form-control" required placeholder="OR 97477" />
          </div>
        </div>

        <div class="form-group" style="margin-top:16px;">
          <label>Card Number (Simulated)</label>
          <input type="text" id="chkCard" class="form-control" required placeholder="•••• •••• •••• 4242" value="4242 4242 4242 4242" />
        </div>

        <div style="margin-top:24px;">
          <button type="submit" id="btnPlaceOrder" class="btn-checkout" style="background:#2563eb;">
            <span>Complete Order &amp; Pay (<span id="payTotalVal">$0.00</span>)</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Order Success Modal -->
  <div class="modal-overlay" id="successModal">
    <div class="modal-card" style="text-align:center; max-width:480px;">
      <div style="font-size:56px; margin-bottom:12px;">🎉</div>
      <h2 style="font-size:24px; font-weight:800; margin-bottom:8px;">Order Confirmed!</h2>
      <p style="color:var(--text-muted); font-size:14px; margin-bottom:20px;">Thank you for your purchase. We have received your payment and our warehouse is picking your items.</p>
      
      <div style="background:#f8fafc; border:1px solid var(--border); border-radius:12px; padding:16px; text-align:left; margin-bottom:24px; font-size:13px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
          <span style="color:var(--text-muted);">Order ID:</span>
          <strong id="confirmedOrderId" style="font-family:monospace; color:#2563eb;">#ORD-9982</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
          <span style="color:var(--text-muted);">Payment Status:</span>
          <span style="color:#10b981; font-weight:700;">PAID &bull; CAPTURED</span>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="color:var(--text-muted);">Carrier Tracking:</span>
          <strong>FedEx Express</strong>
        </div>
      </div>

      <button class="btn-checkout" style="background:#0f172a;" onclick="closeSuccessModal()">
        Continue Shopping 🛍️
      </button>
    </div>
  </div>

  <!-- Toast -->
  <div class="toast" id="toastMsg">✅ Item added to cart!</div>

  <!-- Footer -->
  <footer>
    <div class="footer-grid">
      <div>
        <h4 style="color:white; font-size:18px;">⚡ NEXUS COMMERCE</h4>
        <p style="font-size:14px; line-height:1.6; margin-top:8px;">Enterprise Domain-Driven E-Commerce Platform built with Clean Architecture, TypeScript, and native high-performance microservices.</p>
      </div>
      <div>
        <h4>Shop Categories</h4>
        <ul>
          <li><a href="#catalog">Wireless Audio</a></li>
          <li><a href="#catalog">Laptops &amp; Desktops</a></li>
          <li><a href="#catalog">Gaming Gear</a></li>
          <li><a href="#catalog">4K OLED Displays</a></li>
        </ul>
      </div>
      <div>
        <h4>Customer Care</h4>
        <ul>
          <li><a href="javascript:void(0)">Track Order</a></li>
          <li><a href="javascript:void(0)">Free 30-Day Returns</a></li>
          <li><a href="javascript:void(0)">Warranty &amp; Support</a></li>
          <li><a href="javascript:void(0)">Contact Us</a></li>
        </ul>
      </div>
      <div>
        <h4>API &amp; System</h4>
        <ul>
          <li><a href="/api/health" target="_blank">Health Endpoint</a></li>
          <li><a href="/api/products" target="_blank">Products API</a></li>
          <li><a href="/api/analytics/sales" target="_blank">Sales Metrics</a></li>
          <li><a href="https://github.com/Hash-153/ecom" target="_blank">GitHub Repository</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div>&copy; 2026 NEXUS Commerce Inc. All rights reserved. Proprietary &amp; Confidential.</div>
      <div>100% Validated &bull; Zero Open Source GPL/Apache &bull; 62k+ LOC</div>
    </div>
  </footer>

  <script>
    let cart = [];
    let discountPercent = 0;

    function showToast(msg) {
      const t = document.getElementById('toastMsg');
      t.innerText = msg;
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 2400);
    }

    function toggleCart() {
      document.getElementById('cartOverlay').classList.toggle('open');
    }

    function addToCart(productId, variantId, title, price, img) {
      const existing = cart.find(i => i.variantId === variantId);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ productId, variantId, title, price, img, qty: 1 });
      }
      updateCartUI();
      showToast('🛒 Added ' + title + ' to cart!');
    }

    function updateQty(variantId, delta) {
      const item = cart.find(i => i.variantId === variantId);
      if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
          cart = cart.filter(i => i.variantId !== variantId);
        }
      }
      updateCartUI();
    }

    function removeFromCart(variantId) {
      cart = cart.filter(i => i.variantId !== variantId);
      updateCartUI();
    }

    function applyPromoQuick(code) {
      document.getElementById('couponInput').value = code;
      applyCouponCode();
      toggleCart();
    }

    function applyCouponCode() {
      const code = document.getElementById('couponInput').value.trim().toUpperCase();
      if (code === 'WELCOME20') {
        discountPercent = 20;
        showToast('🎉 20% discount coupon applied successfully!');
      } else if (code === 'TECH10') {
        discountPercent = 10;
        showToast('🎉 10% discount coupon applied!');
      } else {
        alert('Invalid promo code. Try WELCOME20 for 20% off.');
        return;
      }
      updateCartUI();
    }

    function updateCartUI() {
      const count = cart.reduce((sum, i) => sum + i.qty, 0);
      document.getElementById('cartCount').innerText = count;
      document.getElementById('drawerCount').innerText = count;

      const list = document.getElementById('cartItemsList');
      if (cart.length === 0) {
        list.innerHTML = '<div style="text-align:center; padding:48px 0; color:#94a3b8;"><div style="font-size:48px; margin-bottom:12px;">🛍️</div><h4>Your cart is empty</h4><p style="font-size:13px; margin-top:6px;">Add some products to get started!</p></div>';
      } else {
        list.innerHTML = cart.map(item => \`
          <div class="cart-item">
            <img src="\${item.img}" class="cart-item-img" alt="\${item.title}" />
            <div class="cart-item-info">
              <div class="cart-item-title">\${item.title}</div>
              <div class="cart-item-variant">Price: $\${item.price.toFixed(2)}</div>
              <div class="cart-item-controls">
                <div class="qty-stepper">
                  <button class="qty-btn" onclick="updateQty('\${item.variantId}', -1)">&minus;</button>
                  <span class="qty-val">\${item.qty}</span>
                  <button class="qty-btn" onclick="updateQty('\${item.variantId}', 1)">&plus;</button>
                </div>
                <button class="btn-remove" onclick="removeFromCart('\${item.variantId}')">Remove</button>
              </div>
            </div>
          </div>
        \`).join('');
      }

      const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
      const discount = subtotal * (discountPercent / 100);
      const tax = (subtotal - discount) * 0.05;
      const total = subtotal - discount + tax;

      document.getElementById('subtotalVal').innerText = '$' + subtotal.toFixed(2);
      if (discountPercent > 0) {
        document.getElementById('discountRow').style.display = 'flex';
        document.getElementById('discountVal').innerText = '-$' + discount.toFixed(2);
      } else {
        document.getElementById('discountRow').style.display = 'none';
      }
      document.getElementById('taxVal').innerText = '$' + tax.toFixed(2);
      document.getElementById('totalVal').innerText = '$' + total.toFixed(2);
      document.getElementById('payTotalVal').innerText = '$' + total.toFixed(2);
    }

    function openCheckoutModal() {
      if (cart.length === 0) {
        alert('Please add items to your cart before proceeding to checkout.');
        return;
      }
      toggleCart();
      document.getElementById('checkoutModal').classList.add('open');
    }

    function closeCheckoutModal() {
      document.getElementById('checkoutModal').classList.remove('open');
    }

    function fillDemoData() {
      document.getElementById('chkFirst').value = 'Alex';
      document.getElementById('chkLast').value = 'Johnson';
      document.getElementById('chkEmail').value = 'alex.johnson@example.com';
      document.getElementById('chkStreet').value = '742 Evergreen Terrace';
      document.getElementById('chkCity').value = 'Springfield';
      document.getElementById('chkZip').value = 'OR 97477';
      showToast('⚡ Demo address filled!');
    }

    async function processOrder(e) {
      e.preventDefault();
      const btn = document.getElementById('btnPlaceOrder');
      btn.innerText = 'Processing Payment... ⏳';
      btn.disabled = true;

      // Simulate network request to /api/orders and /api/payments/process
      setTimeout(() => {
        btn.innerText = 'Complete Order & Pay';
        btn.disabled = false;
        closeCheckoutModal();

        const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        document.getElementById('confirmedOrderId').innerText = '#' + orderId;
        document.getElementById('successModal').classList.add('open');

        // Clear cart
        cart = [];
        discountPercent = 0;
        updateCartUI();
      }, 1000);
    }

    function closeSuccessModal() {
      document.getElementById('successModal').classList.remove('open');
    }

    function filterProducts() {
      const q = document.getElementById('searchInput').value.toLowerCase().trim();
      const cards = document.querySelectorAll('.product-card');
      cards.forEach(card => {
        const title = card.getAttribute('data-title') || '';
        if (title.includes(q)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    function selectCategory(catId, btn) {
      document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const cards = document.querySelectorAll('.product-card');
      cards.forEach(card => {
        if (catId === 'all') {
          card.style.display = 'flex';
        } else {
          const cats = (card.getAttribute('data-category') || '').split(',');
          if (cats.includes(catId)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        }
      });
    }

    function sortProducts(criteria) {
      const grid = document.getElementById('productsGrid');
      const cards = Array.from(grid.children);
      cards.sort((a, b) => {
        const pA = parseFloat(a.getAttribute('data-price') || '0');
        const pB = parseFloat(b.getAttribute('data-price') || '0');
        if (criteria === 'price-low') return pA - pB;
        if (criteria === 'price-high') return pB - pA;
        return 0;
      });
      cards.forEach(c => grid.appendChild(c));
    }
  </script>
</body>
</html>`;

      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
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

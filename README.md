# Enterprise E-Commerce Platform

An enterprise-grade, modular, full-featured E-Commerce backend built using **Domain-Driven Design (DDD)** and **Clean Architecture** in TypeScript.

---

## Table of Contents
- [Architecture](#architecture)
- [Domain Modules](#domain-modules)
- [Dependencies](#dependencies)
- [Installation](#installation)
- [Build](#build)
- [Run](#run)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Docker Deployment](#docker-deployment)
- [License](#license)

---

## Architecture

The platform follows Clean Architecture principles with strict isolation between Domain, Application, Infrastructure, and Interface layers:

```
src/
├── shared/                       # Domain kernel, base entities, value objects, events, result monad
├── modules/
│   ├── identity-access/          # IAM, RBAC, sessions, MFA, profiles, address books
│   ├── product-catalog/          # Categories, products, variants, SKUs, brands, collections
│   ├── inventory-warehouse/      # Warehouses, stock levels, allocations, batch tracking
│   ├── cart-checkout/            # Cart line items, pricing calculators, checkout sessions
│   ├── order-management/         # Order state machine, line items, fulfillment, RMAs, invoices
│   ├── payment-processing/       # Gateway abstractions, captures, refunds, fraud scoring
│   ├── shipping-logistics/       # Carrier integrations, tracking checkpoints, rate tables
│   ├── promotions-discounts/     # Coupons, flash sales, BOGO rules, tiered cart discounts
│   ├── reviews-ratings/          # Customer reviews, verified buyer status, moderation
│   ├── customer-support/         # Support ticketing, SLA rules, canned responses
│   ├── customer-loyalty/         # Points ledger, tier thresholds, rewards vouchers
│   ├── marketing-automation/     # Email subscribers, abandoned cart recovery, campaigns
│   ├── analytics-reporting/      # Sales metrics, CLV, cohort analysis, conversion funnels
│   ├── content-cms/              # CMS pages, blog articles, promotional banners
│   ├── audit-compliance/         # Audit trails, GDPR consent tracking, data requests
│   └── notifications/            # Multi-channel notification templates and delivery logs
└── api/                          # HTTP routing, middleware, controllers, server
```

---

## Dependencies

The platform is designed to run natively on modern Node.js runtimes:

* **Runtime**: Node.js v20+ / v22+ / v24+
* **Language**: TypeScript 5+ (executed with native type transformation or compiled via `tsc`)
* **Core Libraries**: Standard `node:http`, `node:crypto`, `node:events`, `node:fs`, `node:test`
* **Dev Dependencies**: `@types/node`, `typescript`

---

## Installation

1. Clone or extract the repository:
```bash
git clone https://github.com/Hash-153/ecom.git
cd ecom
```

2. Copy the environment configuration template:
```bash
cp .env.example .env
```

3. Install development dependencies:
```bash
npm install
```

---

## Build

Compile TypeScript source files to the `dist` directory:

```bash
npm run build
```

---

## Run

### Development Mode (with hot-reload watch)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port `3000` (or `PORT` defined in `.env`):
```
[EcommerceServer] Server running on http://localhost:3000
```

---

## Usage

### 1. Health Check
```bash
curl http://localhost:3000/api/health
```

### 2. User Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "StrongPassword123!",
    "firstName": "Alex",
    "lastName": "Johnson"
  }'
```

### 3. Browse Catalog
```bash
curl http://localhost:3000/api/products
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health and uptime status |
| `POST` | `/api/auth/register` | Customer / Staff onboarding |
| `POST` | `/api/auth/login` | Session token authentication |
| `GET` | `/api/categories` | List product category hierarchy |
| `POST` | `/api/categories` | Create product category |
| `GET` | `/api/products` | Query published catalog with filters |
| `POST` | `/api/products` | Create new multi-variant product |
| `POST` | `/api/inventory/adjust` | Warehouse stock adjustment |
| `POST` | `/api/cart/items` | Add item / SKU to shopping cart |
| `POST` | `/api/cart/coupon` | Apply promotional discount code |
| `POST` | `/api/orders` | Checkout cart and generate order |
| `PATCH` | `/api/orders/:id/status` | Advance order state machine |
| `POST` | `/api/payments/process` | Capture order payment transaction |
| `POST` | `/api/shipments` | Create carrier tracking shipment |
| `POST` | `/api/reviews` | Submit product review & rating |
| `GET` | `/api/analytics/sales` | Retrieve real-time sales summary |

---

## Testing

Run the automated test suites covering value objects, state machines, and end-to-end e-commerce workflows:

```bash
npm test
```

---

## Docker Deployment

Build and run using Docker:

```bash
# Build Docker image
docker build -t ecommerce-platform .

# Run container
docker run -d -p 3000:3000 --name ecom-app ecommerce-platform
```

---

## License

Proprietary and Confidential. All rights reserved.

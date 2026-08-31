import { ApplicationContainer } from "./api/Container.ts";
import { EcommerceServer } from "./api/http/Server.ts";

async function seedInitialData(container: ReturnType<typeof ApplicationContainer.create>) {
  // Seed Categories
  const audio = await container.useCases.createCategoryUseCase.execute({
    name: "Wireless Audio & Sound",
    description: "Studio monitors, noise-cancelling headphones, and wireless earbuds",
  });

  const laptops = await container.useCases.createCategoryUseCase.execute({
    name: "Laptops & Computing",
    description: "High performance creator laptops, workstations, and ultrabooks",
  });

  const gaming = await container.useCases.createCategoryUseCase.execute({
    name: "Gaming & Peripherals",
    description: "RGB mechanical keyboards, precision optical mice, and headsets",
  });

  const displays = await container.useCases.createCategoryUseCase.execute({
    name: "Monitors & Displays",
    description: "4K OLED curved gaming panels, HDR creator monitors, and stands",
  });

  const wearables = await container.useCases.createCategoryUseCase.execute({
    name: "Smart Wearables",
    description: "Titanium smartwatches, fitness trackers, and health monitors",
  });

  // Seed Products
  await container.useCases.createProductUseCase.execute({
    title: "Sony WH-1000XM5 Wireless ANC Headphones",
    description: "Industry-leading noise cancellation with Auto NC Optimizer, 30-hour battery life, and crystal clear hands-free calling with 8 microphones.",
    categoryIds: [audio.id],
    tags: ["audio", "anc", "bluetooth", "sony", "flagship"],
    variants: [
      {
        sku: "SNY-XM5-BLK",
        name: "Matte Midnight Black",
        price: 398.00,
        compareAtPrice: 449.99,
        currency: "USD",
        attributes: { color: "Midnight Black", batteryLife: "30h" },
        weightInGrams: 250,
      },
    ],
    publishImmediately: true,
  });

  await container.useCases.createProductUseCase.execute({
    title: "Apple MacBook Pro 16\" M3 Max",
    description: "Engineered for intense workflows. Liquid Retina XDR display, up to 128GB unified memory, and extraordinary 22-hour battery life.",
    categoryIds: [laptops.id],
    tags: ["apple", "macbook", "m3", "laptop", "workstation"],
    variants: [
      {
        sku: "MBP-16-M3MAX",
        name: "Space Black (36GB / 1TB SSD)",
        price: 2499.00,
        compareAtPrice: 2899.00,
        currency: "USD",
        attributes: { chip: "M3 Max", ram: "36GB", storage: "1TB" },
        weightInGrams: 2150,
      },
    ],
    publishImmediately: true,
  });

  await container.useCases.createProductUseCase.execute({
    title: "Apex Pro TKL Wireless RGB Mechanical Keyboard",
    description: "World's fastest keyboard with OmniPoint 2.0 adjustable hypermagnetic switches, aircraft aluminum build, and OLED Smart Display.",
    categoryIds: [gaming.id],
    tags: ["keyboard", "gaming", "rgb", "omnipoint"],
    variants: [
      {
        sku: "APEX-PRO-TKL",
        name: "OmniPoint 2.0 Switches",
        price: 189.99,
        compareAtPrice: 219.99,
        currency: "USD",
        attributes: { switches: "OmniPoint 2.0", layout: "Tenkeyless" },
        weightInGrams: 880,
      },
    ],
    publishImmediately: true,
  });

  await container.useCases.createProductUseCase.execute({
    title: "Samsung Odyssey OLED G9 49\" Curved Gaming Monitor",
    description: "49-inch Dual QHD Neo Quantum Processor OLED with 240Hz refresh rate, 0.03ms response time, and futuristic slim metal design.",
    categoryIds: [displays.id, gaming.id],
    tags: ["monitor", "curved", "oled", "samsung", "gaming"],
    variants: [
      {
        sku: "SAM-G9-OLED",
        name: "49-inch Curved DQHD",
        price: 1199.00,
        compareAtPrice: 1599.00,
        currency: "USD",
        attributes: { size: "49-inch", refreshRate: "240Hz", panel: "OLED" },
        weightInGrams: 11800,
      },
    ],
    publishImmediately: true,
  });

  await container.useCases.createProductUseCase.execute({
    title: "Apple Watch Ultra 2 Titanium",
    description: "The most rugged and capable Apple Watch. 3000 nits brightness, precision dual-frequency GPS, and 36-hour normal battery life.",
    categoryIds: [wearables.id],
    tags: ["apple", "watch", "ultra", "titanium", "fitness"],
    variants: [
      {
        sku: "AW-ULTRA2-TI",
        name: "49mm Natural Titanium (Trail Loop)",
        price: 799.00,
        compareAtPrice: 849.00,
        currency: "USD",
        attributes: { case: "Titanium 49mm", band: "Trail Loop" },
        weightInGrams: 61,
      },
    ],
    publishImmediately: true,
  });

  await container.useCases.createProductUseCase.execute({
    title: "Logitech MX Master 3S Wireless Performance Mouse",
    description: "Quiet clicks with 8000 DPI track-on-glass sensor and MagSpeed electromagnetic scrolling for ultimate developer and designer flow.",
    categoryIds: [gaming.id],
    tags: ["mouse", "logitech", "ergonomic", "productivity"],
    variants: [
      {
        sku: "LOGI-MX3S-GRY",
        name: "Pale Gray / Space Black",
        price: 99.99,
        compareAtPrice: 119.99,
        currency: "USD",
        attributes: { sensor: "8000 DPI Darkfield", connection: "Bolt/Bluetooth" },
        weightInGrams: 141,
      },
    ],
    publishImmediately: true,
  });

  await container.useCases.createProductUseCase.execute({
    title: "Bose QuietComfort Ultra Earbuds",
    description: "World-class spatial audio with Bose Immersive Audio, CustomTune sound calibration, and all-day weather-resistant comfort.",
    categoryIds: [audio.id],
    tags: ["audio", "earbuds", "bose", "anc"],
    variants: [
      {
        sku: "BOSE-QCU-WHT",
        name: "White Smoke",
        price: 279.00,
        compareAtPrice: 299.00,
        currency: "USD",
        attributes: { color: "White Smoke", anc: "CustomTune" },
        weightInGrams: 50,
      },
    ],
    publishImmediately: true,
  });

  await container.useCases.createProductUseCase.execute({
    title: "Dell XPS 15 OLED InfinityEdge Laptop",
    description: "Stunning 3.5K OLED touch display, Intel Core i9 processor, NVIDIA RTX 4070 Graphics, and CNC machined aluminum chassis.",
    categoryIds: [laptops.id],
    tags: ["dell", "xps", "oled", "laptop", "creator"],
    variants: [
      {
        sku: "DELL-XPS15-OLED",
        name: "Platinum Silver (32GB / 1TB SSD)",
        price: 1849.00,
        compareAtPrice: 2199.00,
        currency: "USD",
        attributes: { gpu: "RTX 4070", display: "3.5K OLED" },
        weightInGrams: 1920,
      },
    ],
    publishImmediately: true,
  });

  // Seed inventory for all items
  const skus = [
    { sku: "SNY-XM5-BLK", qty: 85 },
    { sku: "MBP-16-M3MAX", qty: 25 },
    { sku: "APEX-PRO-TKL", qty: 120 },
    { sku: "SAM-G9-OLED", qty: 18 },
    { sku: "AW-ULTRA2-TI", qty: 60 },
    { sku: "LOGI-MX3S-GRY", qty: 200 },
    { sku: "BOSE-QCU-WHT", qty: 95 },
    { sku: "DELL-XPS15-OLED", qty: 30 },
  ];

  for (const item of skus) {
    await container.useCases.adjustStockUseCase.execute({
      sku: item.sku,
      warehouseLocation: "US-CENTRAL-DC",
      quantityChange: item.qty,
      reorderThreshold: 10,
    });
  }
}

async function main() {
  const container = ApplicationContainer.create();
  await seedInitialData(container);

  const server = new EcommerceServer(container);
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  await server.listen(port);
}

main().catch((err) => {
  console.error("Fatal error starting E-Commerce Platform:", err);
  process.exit(1);
});

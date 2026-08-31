import { ApplicationContainer } from "./api/Container.ts";
import { EcommerceServer } from "./api/http/Server.ts";

async function seedInitialData(container: ReturnType<typeof ApplicationContainer.create>) {
  // Seed sample category
  const electronics = await container.useCases.createCategoryUseCase.execute({
    name: "Consumer Electronics",
    description: "Premium gadgets, smart devices, and accessories",
  });

  const audio = await container.useCases.createCategoryUseCase.execute({
    name: "Audio & Hi-Fi",
    description: "Studio monitors, noise-cancelling headphones, and DACs",
    parentId: electronics.id,
  });

  // Seed sample products
  await container.useCases.createProductUseCase.execute({
    title: "Aura Noise-Cancelling Headphones Pro",
    description: "Ultra-low latency wireless headphones with 40-hour battery life and spatial audio.",
    categoryIds: [electronics.id, audio.id],
    tags: ["audio", "bluetooth", "anc", "premium"],
    variants: [
      {
        sku: "AURA-PRO-BLK",
        name: "Matte Midnight Black",
        price: 299.99,
        compareAtPrice: 349.99,
        currency: "USD",
        attributes: { color: "Midnight Black", edition: "Pro" },
        weightInGrams: 280,
      },
      {
        sku: "AURA-PRO-SLV",
        name: "Platinum Silver",
        price: 299.99,
        compareAtPrice: 349.99,
        currency: "USD",
        attributes: { color: "Platinum Silver", edition: "Pro" },
        weightInGrams: 280,
      },
    ],
    publishImmediately: true,
  });

  await container.useCases.createProductUseCase.execute({
    title: "Apex Mechanical Keyboard RGB",
    description: "Hot-swappable tactile mechanical switches with aircraft-grade aluminum chassis.",
    categoryIds: [electronics.id],
    tags: ["peripherals", "gaming", "mechanical"],
    variants: [
      {
        sku: "APEX-KB-RGB",
        name: "Tactile Brown Switches",
        price: 149.50,
        currency: "USD",
        attributes: { switches: "Brown Tactile", layout: "ANSI 75%" },
        weightInGrams: 850,
      },
    ],
    publishImmediately: true,
  });

  await container.useCases.createProductUseCase.execute({
    title: "Nova 4K Ultra-Wide Studio Monitor",
    description: "34-inch curved IPS panel with 99% DCI-P3 color accuracy and Thunderbolt 4 hub.",
    categoryIds: [electronics.id],
    tags: ["displays", "productivity", "4k"],
    variants: [
      {
        sku: "NOVA-34-4K",
        name: "34-inch Curved",
        price: 799.00,
        currency: "USD",
        attributes: { resolution: "3440x1440", refreshRate: "144Hz" },
        weightInGrams: 6200,
      },
    ],
    publishImmediately: true,
  });

  // Seed inventory
  await container.useCases.adjustStockUseCase.execute({
    sku: "AURA-PRO-BLK",
    warehouseLocation: "US-EAST-DC",
    quantityChange: 150,
    reorderThreshold: 20,
  });

  await container.useCases.adjustStockUseCase.execute({
    sku: "APEX-KB-RGB",
    warehouseLocation: "US-WEST-DC",
    quantityChange: 80,
    reorderThreshold: 15,
  });

  await container.useCases.adjustStockUseCase.execute({
    sku: "NOVA-34-4K",
    warehouseLocation: "US-CENTRAL-DC",
    quantityChange: 45,
    reorderThreshold: 10,
  });
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

import { ApplicationContainer } from "./api/Container.ts";
import { EcommerceServer } from "./api/http/Server.ts";

async function main() {
  const container = ApplicationContainer.create();
  const server = new EcommerceServer(container);

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  await server.listen(port);
}

main().catch((err) => {
  console.error("Fatal error starting E-Commerce Platform:", err);
  process.exit(1);
});

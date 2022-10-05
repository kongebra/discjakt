import { PrismaClient } from "@prisma/client";

import storeData from "./data/stores.json";
import productData from "./data/products.json";
import discData from "./data/discs.json";
import brandData from "./data/brands.json";

const prisma = new PrismaClient();

async function main() {
  await prisma.store.createMany({
    data: storeData,
  });

  await prisma.product.createMany({
    data: productData,
  });

  await prisma.brand.createMany({
    data: brandData,
  });

  await prisma.disc.createMany({
    data: discData,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

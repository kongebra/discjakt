import { PrismaClient, Prisma } from "@prisma/client";

import stores from "./data/stores.json";
import products from "./data/products.json";
import discs from "./data/discs.json";
import brands from "./data/brands.json";

const prisma = new PrismaClient();

async function main() {
  // for (const data of stores) {
  //   await prisma.store.create({
  //     data,
  //   });
  // }
  // for (const data of products) {
  //   const { id, createdAt, updatedAt, description, storeId, ...rest } = data;
  //   await prisma.product.create({
  //     data: { ...rest, storeId },
  //   });
  // }
  // await prisma.product.createMany({
  //   data: productData,
  // });
  // await prisma.brand.createMany({
  //   data: brandData,
  // });
  // await prisma.disc.createMany({
  //   data: discData,
  // });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

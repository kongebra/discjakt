import { prisma } from "src/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await GET(req, res);
    case "POST":
      return await POST(req, res);
    case "PUT":
      return await PUT(req, res);
    case "DELETE":
      return await DELETE(req, res);
    default:
      return res.status(405).end("method not allowed");
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  const discCount = await prisma.disc.count();
  const brandCount = await prisma.brand.count();
  const storeCount = await prisma.store.count();
  const productCount = await prisma.product.count();
  const unlinkedProductCount = await prisma.product.count({
    where: {
      discId: null,
      isDisc: null,
    },
  });

  res.status(200).json({
    stats: {
      count: {
        discs: discCount,
        brands: brandCount,
        stores: storeCount,
        products: productCount,
        unlinkedProducts: unlinkedProductCount,
      },
    },
  });
}

async function POST(req: NextApiRequest, res: NextApiResponse) {}

async function PUT(req: NextApiRequest, res: NextApiResponse) {}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {}

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  if (!id) {
    return res.status(403).end("bad request");
  }

  const products = await prisma.product.findMany({
    where: {
      storeId: +id,
    },
  });

  res.status(200).json(products);
}

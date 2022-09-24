import { prisma } from "lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await GET(req, res);
    default:
      return res.status(405).end("method not allowed");
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  const item = await prisma.product.findFirst({
    where: {
      discId: null,
      isDisc: null,
    },
  });

  if (item === null) {
    return res.status(404).json({ message: "no more products without disc" });
  }

  res.status(200).json(item);
}

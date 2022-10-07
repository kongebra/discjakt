import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "src/lib/prisma";
import { getQueryNumberValue } from "src/utils/query";

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
  const id = getQueryNumberValue("id", req);
  if (!id) {
    return res.status(403).end("bad request");
  }

  const products = await prisma.store
    .findFirst({
      where: {
        id,
      },
    })
    .products();

  res.status(200).json(products);
}

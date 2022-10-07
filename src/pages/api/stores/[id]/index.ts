import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "src/lib/prisma";
import { getQueryNumberValue } from "src/utils/query";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = getQueryNumberValue("id", req);

  if (!id) {
    return res.status(403).end("bad request");
  }

  switch (req.method) {
    case "GET":
      return await GET(req, res, id);
    default:
      return res.status(405).end("method not allowed");
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse, id: number) {
  const store = await prisma.store.findFirst({
    where: {
      id: id,
    },
  });

  if (!store) {
    return res.status(404).end("entity not found");
  }

  res.status(200).json(store);
}

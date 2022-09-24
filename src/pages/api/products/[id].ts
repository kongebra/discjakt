import { Product } from "@prisma/client";
import { prisma } from "lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id) {
    return res.status(401).end("bad request");
  }

  switch (req.method) {
    case "GET":
      return await GET(req, res, `${id}`);
    case "PUT":
      return await PUT(req, res, `${id}`);
    case "DELETE":
      return await DELETE(req, res, `${id}`);
    default:
      return res.status(405).end("method not allowed");
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse, id: string) {
  const product = await prisma.product.findFirst({
    where: {
      id,
    },
  });

  res.status(200).json(product);
}

async function PUT(req: NextApiRequest, res: NextApiResponse, id: string) {
  const body = req.body as Product;

  const product = await prisma.product.update({
    where: {
      id,
    },
    data: {
      ...body,
    },
  });

  res.status(200).json(product);
}

async function DELETE(req: NextApiRequest, res: NextApiResponse, id: string) {
  await prisma.product.delete({
    where: {
      id,
    },
  });

  res.status(200).json({ id });
}

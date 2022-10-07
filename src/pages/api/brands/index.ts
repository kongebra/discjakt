import { Brand } from "@prisma/client";
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
    default:
      return res.status(405).end("method not allowed");
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  const brands = await prisma.brand.findMany({
    include: {
      _count: true,
    },
  });

  res.status(200).json(brands);
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body as Brand;

  const brand = await prisma.brand.create({
    data: {
      ...body,
    },
  });

  if (brand === null) {
    return res.status(500).json({ message: "internal server error" });
  }

  res.status(201).json(brand);
}

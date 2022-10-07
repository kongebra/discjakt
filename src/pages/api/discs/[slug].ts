import { Disc } from "@prisma/client";
import { prisma } from "src/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { getQueryStringValue } from "src/utils/query";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const slug = getQueryStringValue("slug", req);

  if (!slug) {
    return res.status(401).end("bad request");
  }

  switch (req.method) {
    case "GET":
      return await GET(req, res, slug);
    case "PUT":
      return await PUT(req, res, slug);
    case "DELETE":
      return await DELETE(req, res, slug);
    default:
      return res.status(405).end("method not allowed");
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse, slug: string) {
  const disc = await prisma.disc.findFirst({
    where: {
      slug,
    },
    include: {
      brand: true,
      products: {
        include: {
          prices: true,
        },
      },
    },
  });

  if (!disc) {
    return res.status(404).json({ message: "disc not found" });
  }

  const result = {
    ...disc,
    lowestPrice: disc.products
      .map((product) => product.prices.map((price) => price.amount))
      .flat()
      .map((str) => (isNaN(Number(str)) ? 0 : Number(str)))
      .reduce((prev, curr) => (curr > prev ? curr : prev), 0),
  };

  res.status(200).json(result);
}

async function PUT(req: NextApiRequest, res: NextApiResponse, slug: string) {
  const record = req.body as Disc;

  const result = await prisma.disc.update({
    where: {
      slug,
    },
    data: {
      ...record,
    },
  });

  if (!result) {
    return res.status(404).end("resource not found");
  }

  res.status(200).json(result);
}

async function DELETE(req: NextApiRequest, res: NextApiResponse, slug: string) {
  const result = await prisma.disc.delete({
    where: {
      slug,
    },
  });

  if (!result) {
    return res.status(404).end("resource not found");
  }

  res.status(200).json(result);
}

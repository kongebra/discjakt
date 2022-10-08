import type { NextApiRequest, NextApiResponse } from "next";
import { getQueryStringValue } from "src/utils/query";
import { create, insert, insertBatch, remove, search } from "@lyrasearch/lyra";
import { prisma } from "src/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const q = getQueryStringValue("q", req);

  switch (req.method) {
    case "GET":
      return await GET(req, res, q);
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

async function GET(
  req: NextApiRequest,
  res: NextApiResponse,
  query: string | undefined
) {
  const db = create({
    schema: {
      name: "string",
      productId: "number",
    },
  });

  const products = await prisma.product.findMany();

  await insertBatch(
    db,
    products.map((product) => {
      return {
        name: product.title,
        productId: product.id,
      };
    })
  );

  console.log("search", { query });

  const searchResult = search(db, {
    term: query || "",
    properties: ["name"],
  });

  const { count, hits } = searchResult;

  res.status(200).json({ hits, count });
}

async function POST(req: NextApiRequest, res: NextApiResponse) {}

async function PUT(req: NextApiRequest, res: NextApiResponse) {}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {}

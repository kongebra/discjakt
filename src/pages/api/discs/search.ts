import type { NextApiRequest, NextApiResponse } from "next";
import { getQueryStringValue } from "src/utils/query";
import { create, insert, insertBatch, remove, search } from "@lyrasearch/lyra";
import { prisma } from "src/lib/prisma";
import { DiscDetails, discSelect } from "src/types/prisma";

let cache: DiscDetails[] = [];
let cacheHit: Date | null = null;

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
      discId: "number",
      name: "string",
      brandId: "number",
      brand: "string",
    },
  });

  const now = new Date();
  const diff = (now.getTime() - (cacheHit?.getTime() || 0)) / 1000;

  console.log("search, cache diff", diff);

  if (diff >= 60 * 5) {
    console.log("DISC_SEARCH :: refresh cache");
    cacheHit = new Date();
    cache = await prisma.disc.findMany({
      select: discSelect,
    });
  }

  await insertBatch(
    db,
    cache.map((disc) => {
      return {
        discId: disc.id,
        name: disc.name,
        brandId: disc.brand.id,
        brand: disc.brand.name,
      };
    })
  );

  const searchResult = search(db, {
    term: query || "",
    properties: ["name", "brand"],
  });

  const { hits } = searchResult;

  const discs = hits.map((hit) => cache.find((disc) => disc.id === hit.discId));

  res.status(200).json(discs);
}

async function POST(req: NextApiRequest, res: NextApiResponse) {}

async function PUT(req: NextApiRequest, res: NextApiResponse) {}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {}

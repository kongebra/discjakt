import { Disc } from "@prisma/client";
import { prisma } from "lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { getQueryStringValue } from "utils/query";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = getQueryStringValue("id", req);

  if (!id) {
    return res.status(401).end("bad request");
  }

  switch (req.method) {
    case "GET":
      return await GET(req, res, id);
    case "PUT":
      return await PUT(req, res, id);
    case "DELETE":
      return await DELETE(req, res, id);
    default:
      return res.status(405).end("method not allowed");
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse, id: string) {}

async function PUT(req: NextApiRequest, res: NextApiResponse, id: string) {
  const record = req.body as Disc;

  const result = await prisma.disc.update({
    where: {
      id,
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

async function DELETE(req: NextApiRequest, res: NextApiResponse, id: string) {
  const result = await prisma.disc.delete({
    where: {
      id,
    },
  });

  if (!result) {
    return res.status(404).end("resource not found");
  }

  res.status(200).json(result);
}

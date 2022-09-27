import { Disc } from "@prisma/client";
import { prisma } from "lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import { getQueryNumberValue, getQueryStringValue } from "utils/query";

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
  const pageIndex = getQueryNumberValue("pageIndex", req) || 0;
  const pageSize = getQueryNumberValue("pageSize", req) || 20;

  const name = getQueryStringValue("name", req);
  const brand = getQueryStringValue("brand", req);

  // TODO: Expand to min-max values
  const speed = getQueryNumberValue("speed", req);
  const glide = getQueryNumberValue("glide", req);
  const turn = getQueryNumberValue("turn", req);
  const fade = getQueryNumberValue("fade", req);

  const take = pageSize;
  const skip = pageIndex * take;

  const where = {
    name: name ? { contains: name } : undefined,
    brand: brand
      ? {
          name: { contains: brand },
        }
      : undefined,
    speed,
    glide,
    turn,
    fade,
  };

  const totalCount = await prisma.disc.count({
    where,
  });
  const pageCount = Math.ceil(totalCount / take);

  const rows = await prisma.disc.findMany({
    where,
    skip,
    take,
    include: {
      brand: true,
      products: {
        include: {
          prices: true,
        },
      },
    },
  });

  res.status(200).json({
    rows,
    pageCount,
    totalCount,
  });
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body as Disc;

  body.imageUrl = await downloadAndUploadImage(body.imageUrl);

  const disc = await prisma.disc.create({
    data: {
      ...body,
    },
  });

  if (disc === null) {
    return res.status(500).json({ message: "internal server error" });
  }

  res.status(201).json(disc);
}

const containerName = "uploads";
const sasToken = process.env.NEXT_PUBLIC_STORAGESASTOKEN;
const storageAccountName = process.env.NEXT_PUBLIC_STORAGERESOURCENAME;

export const downloadAndUploadImage = async (url: string) => {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });
  const buffer = Buffer.from(response.data, "utf-8");

  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/${sasToken}`
  );

  const containerClient: ContainerClient =
    blobService.getContainerClient(containerName);

  const ext = url.split(".").pop();
  const fileName = `${uuidv4()}.${ext}`;

  const blobClient = containerClient.getBlockBlobClient(fileName);
  const options = { blobHTTPHeaders: { blobContentType: `image/${ext}` } };

  await blobClient.uploadData(buffer, options);

  return `https://${storageAccountName}.blob.core.windows.net/uploads/${fileName}`;
};

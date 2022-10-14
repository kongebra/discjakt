import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import fs from "fs";

const cors = Cors({
  methods: ["POST"],
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);

  const { secret } = req.body;

  if (secret !== process.env.NEXT_CRAWL_SECRET) {
    return res.status(401).end("unauthorized");
  }

  const stores = [
    "aceshop",
    "dgshop",
    "discgolfdynasty",
    "discoverdiscs",
    "frisbeebutikken",
    "frisbeesor",
    "gurudiscgolf",
    "krokholdgs",
    "prodisc",
    "spinnvilldg",
    "starframe",
  ];

  res.status(200).json({ message: "crawl started" });

  for (const store of stores) {
    await fetch(`${process.env.NEXTAUTH_URL}/api/stores/crawl/${store}`, {
      method: "POST",
    });
  }
}

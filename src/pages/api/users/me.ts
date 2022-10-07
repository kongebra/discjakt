import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "src/lib/prisma";
import { User } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return await GET(req, res);
    case "PUT":
      return await PUT(req, res);
    default:
      return res.status(405).end("method not allowed");
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse<User | any>) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(403).end("bad request");
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return res.status(404).end("user not found");
  }

  res.status(200).json(user);
}

async function PUT(req: NextApiRequest, res: NextApiResponse) {
  // TODO: Update profile
  throw new Error("not implemented");
}

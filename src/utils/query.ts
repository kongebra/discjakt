import type { NextApiRequest } from "next";

type Req = {
  query: Partial<{
    [key: string]: string | string[];
  }>;
};

export const getQueryStringValue = (
  key: string,
  req: Req
): string | undefined => {
  const query = req.query[key];
  const value = Array.isArray(query) ? query[0] : query;

  return value;
};

export const getQueryNumberValue = (
  key: string,
  req: Req
): number | undefined => {
  const query = req.query[key];
  const value = Array.isArray(query) ? query[0] : query;

  const numValue = Number(value);
  if (isNaN(numValue)) {
    return undefined;
  }

  return numValue;
};

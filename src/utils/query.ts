import type { NextApiRequest } from "next";

export const getQueryStringValue = (
  key: string,
  req: NextApiRequest
): string | undefined => {
  const query = req.query[key];
  const value = Array.isArray(query) ? query[0] : query;

  return value;
};

export const getQueryNumberValue = (
  key: string,
  req: NextApiRequest
): number | undefined => {
  const query = req.query[key];
  const value = Array.isArray(query) ? query[0] : query;

  const numValue = Number(value);
  if (isNaN(numValue)) {
    return undefined;
  }

  return numValue;
};

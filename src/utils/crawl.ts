import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import { Store } from "@prisma/client";
import { StoreDetail } from "types/store";
import { CheerioAPI, load } from "cheerio";

export type SitemapResponse = {
  loc: string;
  lastmod: string;
};

type SitemapHandler = ($: CheerioAPI) => SitemapResponse[];
type ProductPageHandler = ($: CheerioAPI) => {
  price: string;
  title: string;
  description: string;
  imageUrl: string;
};

export type CrawlParams = {
  debug?: {
    log?: boolean;
    maxCount?: number;
  };

  store: Pick<Store, "name" | "baseUrl" | "sitemapUrl">;

  handleSitemap: SitemapHandler;
  handleProductPage: ProductPageHandler;
};

export async function crawlHelper(
  req: NextApiRequest,
  res: NextApiResponse,
  params: CrawlParams
) {
  switch (req.method) {
    case "POST":
      return await POST(req, res, params);
    default:
      return res.status(405).end("method not allowed");
  }
}

async function POST(
  req: NextApiRequest,
  res: NextApiResponse,
  { debug, store: storeParam, handleSitemap, handleProductPage }: CrawlParams
) {
  if (debug?.log) {
    console.time(storeParam.name);
  }

  const store = (await prisma.store.upsert({
    where: {
      name: storeParam.name,
    },
    create: {
      ...storeParam,
    },
    update: {},
    include: {
      products: {
        include: {
          prices: true,
        },
      },
    },
  })) as StoreDetail;

  const { products, ...rest } = store;

  // Fire and forget request
  res.status(200).json(rest);

  const urls = await crawlSitemap(store, handleSitemap);

  let count = 0;
  for (const url of urls) {
    const result = await crawlProductPage(url, store, handleProductPage);
    if (result !== null) {
      const { product, price } = result;

      await prisma.productPrice.create({
        data: {
          amount: price,
          currency: "NOK",
          productId: product.id,
        },
      });
    }

    if (debug?.log) {
      console.log(`${store.name} ${++count}/${urls.length}`);
    }

    if (debug?.maxCount && count >= debug.maxCount) {
      break;
    }
  }

  if (debug?.log) {
    console.timeEnd(storeParam.name);
  }
}

async function crawlSitemap(store: StoreDetail, handleSitemap: SitemapHandler) {
  const response = await fetch(store.sitemapUrl);
  if (response.status !== 200) {
    return [];
  }

  const html = await response.text();
  const $ = load(html);

  return handleSitemap($);
}

async function crawlProductPage(
  { loc, lastmod }: { loc: string; lastmod: string },
  store: StoreDetail,
  handleProductPage: ProductPageHandler
) {
  const found = store.products.find((product) => product.loc === loc);
  // already a product
  if (found) {
    // no changes
    if (found.lastmod === lastmod) {
      // check if we have any prices
      if (found.prices.length) {
        // take latest price
        const latestPrice = found.prices[found.prices.length - 1].amount;

        // return it
        return { product: found, price: latestPrice };
      }
    }
  }

  const data = await crawlPageDetails(loc, handleProductPage);
  if (!data) {
    return null;
  }

  const { price, ...rest } = data;

  const product = await prisma.product.upsert({
    where: {
      loc: loc,
    },
    create: {
      loc: loc,
      lastmod: lastmod,
      storeId: store.id,
      ...rest,
    },
    update: {
      lastmod: lastmod,
      ...rest,
    },
  });

  return { product, price };
}

async function crawlPageDetails(
  loc: string,
  handleProductPage: ProductPageHandler
) {
  const response = await fetch(loc);
  if (response.status !== 200) {
    return null;
  }

  const html = await response.text();
  const $ = load(html);

  return handleProductPage($);
}

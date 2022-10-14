import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "src/lib/prisma";
import { Store } from "@prisma/client";
import { CheerioAPI, load } from "cheerio";
import { StoreDetails, storeDetailsSelect } from "src/types/prisma";

export type SitemapResponse = {
  loc: string;
  lastmod: string;
};

type SitemapHandler = ($: CheerioAPI) => SitemapResponse[];
type ProductPageHandler = ($: CheerioAPI) => {
  price: number;
  title: string;
  description: string;
  imageUrl: string;
} | null;
type FindSitemapInternalFn = ($: CheerioAPI) => string;

export type CrawlParams = {
  debug?: {
    log?: boolean;
    maxCount?: number;
  };

  store: Pick<Store, "name" | "baseUrl" | "sitemapUrl" | "slug">;

  sitemaps?: string[];

  handleSitemap: SitemapHandler;
  handleProductPage: ProductPageHandler;
  findSitemapInternal?: FindSitemapInternalFn;
};

export async function crawlHelper(
  req: NextApiRequest,
  res: NextApiResponse,
  params: CrawlParams,
  disableDatabase: boolean = false
) {
  switch (req.method) {
    case "POST":
      return await POST(req, res, params, disableDatabase);
    default:
      return res.status(405).end("method not allowed");
  }
}

async function POST(
  req: NextApiRequest,
  res: NextApiResponse,
  {
    debug,
    store: storeParam,
    handleSitemap,
    handleProductPage,
    findSitemapInternal,
    sitemaps,
  }: CrawlParams,
  disableDatabase: boolean
) {
  if (debug?.log) {
    console.time(storeParam.slug!);
  }

  if (findSitemapInternal !== undefined) {
    const response = await fetch(storeParam.sitemapUrl);
    if (response.status !== 200) {
      return [];
    }

    const html = await response.text();
    const $ = load(html);

    storeParam.sitemapUrl = findSitemapInternal($);
  }

  if (!storeParam.sitemapUrl) {
    return res.status(500).json({ message: "no sitemap found" });
  }

  const store = (await prisma.store.upsert({
    where: {
      slug: storeParam.slug!,
    },
    create: {
      ...storeParam,
    },
    update: {
      ...storeParam,
    },
    select: storeDetailsSelect,
  })) as StoreDetails;

  const { products, ...rest } = store;

  // Fire and forget request
  res.status(200).json(rest);

  if (sitemaps) {
    let sitemapCount = 1;
    for (const sitemapUrl of sitemaps) {
      await scrapeSingleSitemap(
        { ...store, sitemapUrl },
        handleSitemap,
        handleProductPage,
        disableDatabase,
        { ...debug, sitemapCount, sitemapMaxCount: sitemaps.length }
      );

      sitemapCount++;
    }
  } else {
    await scrapeSingleSitemap(
      store,
      handleSitemap,
      handleProductPage,
      disableDatabase,
      debug
    );
  }

  if (debug?.log) {
    console.timeEnd(storeParam.slug!);
  }
}

async function scrapeSingleSitemap(
  store: StoreDetails,
  handleSitemap: SitemapHandler,
  handleProductPage: ProductPageHandler,
  disableDatabase: boolean,
  debug?: {
    log?: boolean | undefined;
    maxCount?: number | undefined;
    sitemapCount?: number;
    sitemapMaxCount?: number;
  }
) {
  const urls = await crawlSitemap(store, handleSitemap);

  let count = 0;
  for (const url of urls) {
    const result = await crawlProductPage(
      url,
      store,
      handleProductPage,
      disableDatabase
    );

    if (result !== null) {
      const { product, price } = result;

      if (disableDatabase === false) {
        if (product) {
          await prisma.productPrice.create({
            data: {
              amount: price,
              currency: "NOK",
              productId: product.id,
            },
          });
        }
      }
    }

    if (debug?.log) {
      if (debug.sitemapMaxCount && debug.sitemapCount) {
        console.log(
          `${store.slug} ${++count}/${urls.length} (Sitemap: ${
            debug.sitemapCount
          }/${debug.sitemapMaxCount})`
        );
      } else {
        console.log(`${store.slug} ${++count}/${urls.length}`);
      }
    }

    if (debug?.maxCount && count >= debug.maxCount) {
      break;
    }
  }
}

async function crawlSitemap(
  store: StoreDetails,
  handleSitemap: SitemapHandler
) {
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
  store: StoreDetails,
  handleProductPage: ProductPageHandler,
  disableDatabase: boolean
) {
  const found = store.products.find((product) => product.loc === loc);
  // already a product
  if (found) {
    // no changes
    if (found.lastmod === lastmod) {
      // check if we have any prices
      if (found.prices.length) {
        // take latest price
        const latestPrice = found.prices[found.prices.length - 1]!.amount;

        // return it
        return { product: found, price: latestPrice };
      }

      // no prices found, then we crawl for price and stuff
    }
  }

  const data = await crawlPageDetails(loc, handleProductPage);
  if (!data) {
    return null;
  }

  const { price, ...rest } = data;

  if (disableDatabase === true) {
    return { product: null, price };
  }

  try {
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
  } catch (error) {
    console.log("ERROR", { price, data });
    console.error(error);

    return { product: null, price };
  }
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

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import { load } from "cheerio";
import { Product, Store } from "@prisma/client";

type StoreDetails = Store & {
  products: Product[];
};

async function sitemap(url: string) {
  const response = await fetch(url);
  if (response.status !== 200) {
    throw new Error("not http 200");
  }

  const html = await response.text();
  const $ = load(html);

  const result: { loc: string; lastmod: string }[] = [];

  $("url").each((i, el) => {
    const loc = $(el).find("loc").text().trim();
    const lastmod = $(el).find("lastmod").text().trim();

    if (loc.includes("/products/")) {
      result.push({ loc, lastmod });
    }
  });

  return result;
}

async function productPage(url: string) {
  const response = await fetch(url);
  if (response.status !== 200) {
    return null;
  }

  const html = await response.text();
  const $ = load(html);

  const price = $(".product-price")?.text()?.trim().replace(",-", "") || "";

  const data = {
    title: $("h1").text()?.trim() || "",
    description: $('meta[name="description"]').attr("content")?.trim() || "",
    imageUrl: $(".product_image_price_row img").attr("src")?.trim() || "",
  };

  return {
    price,
    ...data,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return await POST(req, res);
    default:
      return res.status(405).end("method not allowed");
  }
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  console.time("frisbeebutikken.no");

  const storeName = "frisbeebutikken.no";
  const sitemapUrl = "https://frisbeebutikken.no/sitemap.xml";
  const urls = await sitemap(sitemapUrl);

  const store = (await prisma.store.upsert({
    where: {
      name: storeName,
    },
    create: {
      name: storeName,
      baseUrl: "https://frisbeebutikken.no/",
      sitemapUrl,
    },
    update: {},
    include: {
      products: true,
    },
  })) as StoreDetails;

  res.status(200).json(store);

  let count = 0;

  for (const url of urls) {
    const result = await crawlUrl(url, store);

    // No changes to product
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

    console.log(`frisbeebutikken.no ${++count}/${urls.length}`);
  }

  console.timeEnd("frisbeebutikken.no");
}

async function crawlUrl(
  url: { loc: string; lastmod: string },
  store: StoreDetails
) {
  const found = store.products.find((x) => x.loc === url.loc);
  // Found and no changes from store
  if (found && found.lastmod === url.lastmod) {
    return null;
  }

  // Crawl product page
  const data = await productPage(url.loc);
  if (data === null) {
    return null;
  }

  const { price, ...rest } = data;

  const product = await prisma.product.upsert({
    where: {
      loc: url.loc,
    },
    create: {
      loc: url.loc,
      lastmod: url.lastmod,
      storeId: store.id,
      ...rest,
    },
    update: {
      lastmod: url.lastmod,
      ...rest,
    },
  });

  return { product, price };
}

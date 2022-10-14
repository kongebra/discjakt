import type { NextApiRequest, NextApiResponse } from "next";
import { crawlHelper, SitemapResponse } from "src/utils/crawl";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  crawlHelper(
    req,
    res,
    {
      store: {
        name: "Prodisc",
        slug: "prodisc",
        sitemapUrl: "https://prodisc.no/sitemap.xml",
        baseUrl: "https://prodisc.no/",
      },

      debug: {
        log: true,
      },

      findSitemapInternal($) {
        let sitemap = "";

        $("sitemap").each((i, el) => {
          const loc = $(el).find("loc").text().trim();

          if (loc.includes("sitemap_products_1.xml")) {
            sitemap = loc;
          }
        });

        return sitemap;
      },
      handleSitemap($) {
        const result: SitemapResponse[] = [];

        $("url").each((i, el) => {
          const loc = $(el).find("loc").text().trim();
          const lastmod = $(el).find("lastmod").text().trim();

          if (loc.includes("/products/")) {
            result.push({ loc, lastmod });
          }
        });

        return result;
      },
      handleProductPage($) {
        const priceStr =
          $('meta[property="og:price:amount"]')
            .attr("content")
            ?.trim()
            .replace(",-", "") || "";

        let price = Number(priceStr.replace(",", "."));
        if (isNaN(price)) {
          price = 0;
        }

        const data = {
          title: $('meta[property="og:title"]').attr("content")?.trim() || "",
          description:
            $('meta[property="og:description"]').attr("content")?.trim() || "",
          imageUrl:
            $('meta[property="og:image"]').attr("content")?.trim() || "",
        };

        console.log({ priceStr, price, data });

        return {
          price,
          ...data,
        };
      },
    },
    // disableDatabase
    false
  );
}

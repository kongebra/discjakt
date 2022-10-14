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
        name: "Guru Disc Golf",
        slug: "gurudiscgolf",
        baseUrl: "https://www.gurudiscgolf.no",
        sitemapUrl: "https://www.gurudiscgolf.no/sitemap.xml",
      },

      sitemaps: [
        "https://www.gurudiscgolf.no/product-sitemap1.xml",
        "https://www.gurudiscgolf.no/product-sitemap2.xml",
        "https://www.gurudiscgolf.no/product-sitemap3.xml",
        "https://www.gurudiscgolf.no/product-sitemap4.xml",
      ],

      debug: {
        log: true,
      },

      handleSitemap($) {
        const result: SitemapResponse[] = [];

        $("url").each((i, el) => {
          const loc = $(el).find("loc").text().trim();
          const lastmod = $(el).find("lastmod").text().trim();

          if (loc.includes("/produkt/")) {
            result.push({ loc, lastmod });
          }
        });

        return result;
      },

      handleProductPage($) {
        const priceStr =
          $(".woocommerce-Price-amount.amount")
            .first()
            .text()
            ?.replace("kr", "")
            .trim()
            .replace(",", ".") || "";

        let price = Number(priceStr);
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

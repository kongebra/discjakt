import type { NextApiRequest, NextApiResponse } from "next";
import { crawlHelper, SitemapResponse } from "utils/crawl";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  crawlHelper(req, res, {
    store: {
      name: "aceshop.no",
      baseUrl: "https://www.aceshop.no",
      sitemapUrl: "https://www.aceshop.no/sitemap.xml",
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
      const price = $(".product-price")?.text()?.trim().replace(",-", "") || "";

      const data = {
        title: $("h1").text()?.trim() || "",
        description:
          $('meta[name="description"]').attr("content")?.trim() || "",
        imageUrl: $(".product_image_price_row img").attr("src")?.trim() || "",
      };

      return {
        price,
        ...data,
      };
    },
  });
}

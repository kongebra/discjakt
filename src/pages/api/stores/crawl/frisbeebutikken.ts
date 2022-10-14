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
        name: "Frisbeebutikken",
        slug: "frisbeebutikken",
        sitemapUrl: "https://frisbeebutikken.no/sitemap.xml",
        baseUrl: "https://frisbeebutikken.no/",
      },

      debug: {
        log: true,
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
          $(".product-price")?.text()?.trim().replace(",-", "") || "";

        let price = Number(priceStr.replace(",", "."));
        if (isNaN(price)) {
          price = 0;
        }

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
    },
    // disableDatabase
    false
  );
}

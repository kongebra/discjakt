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
        name: "Aceshop",
        slug: "aceshop",
        baseUrl: "https://www.aceshop.no",
        sitemapUrl: "https://www.aceshop.no/sitemap.xml",
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
          title: $('meta[property="og:title"]').attr("content")?.trim() || "",
          description:
            $('meta[name="description"]').attr("content")?.trim() || "",
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

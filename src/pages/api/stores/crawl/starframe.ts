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
        name: "Starframe",
        slug: "starframe",
        sitemapUrl: "https://starframe.no/sitemap.xml",
        baseUrl: "https://starframe.no/",
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
          $(".product-price").first()?.text()?.trim().replace(",-", "") || "";

        let price = Number(priceStr.replace(".", "").replace(",", "."));
        if (isNaN(price)) {
          price = 0;
        }

        const data = {
          title: $("h1.product-title-v1").text()?.trim() || "",
          description:
            $('meta[name="description"]').attr("content")?.trim() || "",
          imageUrl:
            $(".product_page_slider img").first().attr("src")?.trim() || "",
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

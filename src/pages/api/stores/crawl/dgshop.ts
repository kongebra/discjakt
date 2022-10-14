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
        name: "DGShop",
        slug: "dgshop",
        baseUrl: "https://www.dgshop.no",
        sitemapUrl: "https://www.dgshop.no/sitemap.xml",
      },

      debug: {
        log: true,
      },

      handleSitemap($) {
        const result: SitemapResponse[] = [];

        $("url").each((i, el) => {
          const loc = $(el).find("loc").text().trim();
          const lastmod = $(el).find("lastmod").text().trim();
          const priority = $(el).find("priority").text().trim();

          if (priority == "1.0") {
            result.push({ loc, lastmod });
          }
        });

        return result;
      },

      handleProductPage($) {
        const priceStr =
          $('meta[property="product:price:amount"]')
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

        if (!data.title && !data.imageUrl && !data.description && !priceStr) {
          return null;
        }

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

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
      debug: {
        log: true,
        // maxCount: 1,
      },
      store: {
        name: "frisbeesor.no",
        slug: "frisbeesor",
        baseUrl: "https://www.frisbeesor.no",
        sitemapUrl: "https://www.frisbeesor.no/sitemap.xml",
      },
      sitemaps: [
        "https://www.frisbeesor.no/product-sitemap1.xml",
        "https://www.frisbeesor.no/product-sitemap2.xml",
        "https://www.frisbeesor.no/product-sitemap3.xml",
        "https://www.frisbeesor.no/product-sitemap4.xml",
      ],
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
        const priceStr = $(".product-page-price .amount").text() || "";

        let price = Number(priceStr.slice(3, priceStr.length));
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
    }
    // disableDatabase
    // true
  );
}

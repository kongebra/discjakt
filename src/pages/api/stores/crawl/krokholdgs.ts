import type { NextApiRequest, NextApiResponse } from "next";
import { crawlHelper, SitemapResponse } from "utils/crawl";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  crawlHelper(req, res, {
    store: {
      name: "krokholdgs.no",
      sitemapUrl: "https://krokholdgs.no/sitemap.xml",
      baseUrl: "https://krokholdgs.no/",
    },
    debug: { log: true },
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
      const price =
        $("span.product-price")?.text()?.trim().replace(",-", "") || "";

      const data = {
        title: $('meta[property="og:title"]').attr("content")?.trim() || "",
        description:
          $('meta[name="description"]').attr("content")?.trim() || "",
        imageUrl: $('meta[property="og:image"]').attr("content")?.trim() || "",
      };

      return {
        price,
        ...data,
      };
    },
  });
}

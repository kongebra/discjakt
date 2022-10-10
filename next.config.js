// @ts-check

const { env } = require("./src/server/env");

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function getConfig(config) {
  return config;
}

module.exports = getConfig({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "aceshopas-i01.mycdn.no",
      "aceshopas-i02.mycdn.no",
      "aceshopas-i03.mycdn.no",
      "aceshopas-i04.mycdn.no",
      "aceshopas-i05.mycdn.no",
      "aceshopas-i06.mycdn.no",
      "discjakt.blob.core.windows.net",
      "www.krokholdgs.no",
      "frisbeebutikke-i01.mycdn.no",
      "frisbeebutikke-i02.mycdn.no",
      "frisbeebutikke-i03.mycdn.no",
      "frisbeebutikke-i04.mycdn.no",
      "frisbeebutikke-i05.mycdn.no",
      "frisbeebutikke-i06.mycdn.no",
    ],
    formats: ["image/avif", "image/webp"],
  },

  publicRuntimeConfig: {
    NODE_ENV: env.NODE_ENV,
  },
});

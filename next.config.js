/** @type {import('next').NextConfig} */
const nextConfig = {
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
  },
};

module.exports = nextConfig;

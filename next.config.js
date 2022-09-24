/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "aceshopas-i04.mycdn.no",
      "discjakt.blob.core.windows.net",
    ],
  },
};

module.exports = nextConfig;

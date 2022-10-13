const config = {
  // TODO: legg på /api
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || "development",
};

export default config;

export type Config = typeof config;

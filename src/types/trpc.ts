import { GetInferenceHelpers } from "@trpc/server";
import { AppRouter } from "src/server/routers/_app";

export type AppRouterTypes = GetInferenceHelpers<AppRouter>;

type BrandRouter = AppRouterTypes["brand"];
export type Brand = BrandRouter["list"]["output"];
export type BrandDetail = BrandRouter["getBySlug"]["output"];

type DiscRouter = AppRouterTypes["disc"];
export type Disc = DiscRouter["list"]["output"];
export type DiscDetail = DiscRouter["getBySlug"]["output"];

type ProductRouter = AppRouterTypes["product"];
export type Product = ProductRouter["list"]["output"];
export type ProductDetail = ProductRouter["getById"]["output"];

import { GetInferenceHelpers, inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "src/server/routers/_app";

export type AppRouterTypes = GetInferenceHelpers<AppRouter>;

type BrandRouter = AppRouterTypes["brand"];
export type BrandList = BrandRouter["list"];
export type BrandDetails = BrandRouter["getBySlug"]["output"];

type DiscRouter = AppRouterTypes["disc"];
export type DiscList = DiscRouter["list"]["output"];
export type DiscDetails = DiscRouter["getBySlug"]["output"];

type ProductRouter = AppRouterTypes["product"];
export type ProductList = ProductRouter["list"]["output"];
export type ProductDetails = ProductRouter["getById"]["output"];

type StoreRouter = AppRouterTypes["store"];
export type StoreList = StoreRouter["list"]["output"];
export type StoreDetails = StoreRouter["getBySlug"]["output"];

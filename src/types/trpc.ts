import { GetInferenceHelpers } from "@trpc/server";
import { AppRouter } from "src/server/routers/_app";

export type AppRouterTypes = GetInferenceHelpers<AppRouter>;

type BrandRouter = AppRouterTypes["brand"];
type DiscRouter = AppRouterTypes["disc"];

export type Brand = BrandRouter["list"]["output"];
export type BrandDetail = BrandRouter["getBySlug"]["output"];

export type Disc = DiscRouter["list"]["output"];
export type DiscDetail = DiscRouter["getBySlug"]["output"];

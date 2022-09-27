import { Brand, Disc, Product, ProductPrice } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PaginationData } from "components/Table";
import { useState } from "react";
import { useDebounce } from "usehooks-ts";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const BASE_URL = `${API_URL}/api/discs`;

export type DiscDetails = Disc & {
  brand: Brand;
  products: (Product & {
    prices: ProductPrice[];
  })[];
};

type SearchFilters = {
  name?: string;
  brand?: string;
  speed?: number;
  glide?: number;
  turn?: number;
  fade?: number;
};

const fetchDiscs = async (
  pageIndex: number,
  pageSize: number,
  filters: SearchFilters
) => {
  const keys = Object.keys(filters);
  const searchQuery = keys
    .map((key) => {
      if (filters[key as keyof SearchFilters] !== undefined) {
        return `&${key}=${filters[key as keyof SearchFilters]}`;
      }

      return "";
    })
    .filter((x) => x !== "")
    .join("&");

  const resp = await axios.get<PaginationData<DiscDetails>>(
    `${BASE_URL}?pageIndex=${pageIndex}&pageSize=${pageSize}${
      searchQuery.length > 0 ? searchQuery : ""
    }`
  );
  return resp.data;
};

const createDisc = async (record: Disc) => {
  const resp = await axios.post<Disc>(BASE_URL, record);
  return resp.data;
};

type UseDiscsProps = {
  enabled?: boolean;

  pageIndex?: number;
  pageSize?: number;
  filters?: SearchFilters;

  delay?: number;
};

export default function useDiscs(
  {
    enabled,
    filters: initialFilters,
    pageIndex: initialPageIndex,
    pageSize: initialPageSize,
    delay,
  }: UseDiscsProps = { enabled: true }
) {
  const queryClient = useQueryClient();

  const [pageIndex, setPageIndex] = useState(initialPageIndex || 0);
  const [pageSize, setPageSize] = useState(initialPageSize || 20);

  const [filters, setFilters] = useState<SearchFilters>(initialFilters || {});
  const debouncedFilters = useDebounce(filters, delay || 0);

  const { data, ...rest } = useQuery<PaginationData<DiscDetails>>(
    ["discs", { pageIndex, pageSize, ...debouncedFilters }],
    () => fetchDiscs(pageIndex, pageSize, debouncedFilters),
    {
      enabled: enabled,
    }
  );

  const createMutation = useMutation(createDisc, {
    onSuccess() {
      queryClient.invalidateQueries(["discs"]);
      queryClient.resetQueries(["data-cleaning"]);
    },
  });

  const defaultDiscs: PaginationData<DiscDetails> = {
    rows: [],
    pageCount: 0,
    totalCount: 0,
  };

  return {
    discs: data || defaultDiscs,

    ...rest,

    mutations: {
      create: createMutation,
    },

    pageIndex,
    pageSize,
    filters,

    setPageIndex,
    setPageSize,
    setFilters,
  };
}

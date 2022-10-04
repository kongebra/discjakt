import { Brand, Disc, Product, ProductPrice } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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

const fetchDiscs = async () => {
  const resp = await axios.get<DiscDetails[]>(`${BASE_URL}`);
  return resp.data;
};

const createDisc = async (record: Disc) => {
  const resp = await axios.post<Disc>(BASE_URL, record);
  return resp.data;
};

const updateDisc = async ({ id, record }: { id: string; record: Disc }) => {
  const resp = await axios.put<Disc>(`${BASE_URL}/${id}`, record);
  return resp.data;
};

const deleteDisc = async (id: string) => {
  const resp = await axios.delete<Disc>(`${BASE_URL}/${id}`);
  return resp.data;
};

type UseDiscsProps = {
  enabled?: boolean;
};

export default function useDiscs(
  { enabled }: UseDiscsProps = { enabled: true }
) {
  const queryClient = useQueryClient();

  const { data, ...rest } = useQuery<DiscDetails[]>(["discs"], fetchDiscs, {
    enabled: enabled,
  });

  const createMutation = useMutation(createDisc, {
    onSuccess() {
      queryClient.resetQueries(["discs"]);
      queryClient.invalidateQueries(["data-cleaning"]);
    },
  });

  const updateMutation = useMutation(updateDisc, {
    onSuccess() {
      queryClient.resetQueries(["discs"]);
      queryClient.invalidateQueries(["data-cleaning"]);
    },
  });

  const deleteMutation = useMutation(deleteDisc, {
    onSuccess() {
      queryClient.resetQueries(["discs"]);
      queryClient.invalidateQueries(["data-cleaning"]);
    },
  });

  return {
    discs: data || [],

    ...rest,

    mutations: {
      create: createMutation,
      update: updateMutation,
      delete: deleteMutation,
    },
  };
}

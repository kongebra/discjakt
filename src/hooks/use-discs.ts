import { Brand, Disc, Product, ProductPrice } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import config from "src/config";
import { DiscDetails } from "src/types/prisma";

const BASE_URL = `${config.baseUrl}/api/discs`;

const fetchDiscs = async () => {
  const resp = await axios.get<DiscDetails[]>(`${BASE_URL}`);
  return resp.data;
};

const createDisc = async (record: Disc) => {
  const resp = await axios.post<Disc>(BASE_URL, record);
  return resp.data;
};

const updateDisc = async ({ slug, record }: { slug: string; record: Disc }) => {
  const resp = await axios.put<Disc>(`${BASE_URL}/${slug}`, record);
  return resp.data;
};

const deleteDisc = async (slug: string) => {
  const resp = await axios.delete<Disc>(`${BASE_URL}/${slug}`);
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

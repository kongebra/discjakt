import { Disc } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = "http://localhost:3000/api/discs";

const fetchDiscs = async () => {
  const resp = await axios.get<Disc[]>(BASE_URL);
  return resp.data;
};

const createDisc = async (record: Disc) => {
  const resp = await axios.post<Disc>(BASE_URL, record);
  return resp.data;
};

export default function useDiscs() {
  const queryClient = useQueryClient();

  const { data, ...rest } = useQuery<Disc[]>(["discs"], fetchDiscs);

  const createMutation = useMutation(createDisc, {
    onSuccess() {
      queryClient.invalidateQueries(["discs"]);
      queryClient.invalidateQueries(["data-cleaning"]);
    },
  });

  return {
    discs: data || [],

    ...rest,

    mutations: {
      create: createMutation,
    },
  };
}

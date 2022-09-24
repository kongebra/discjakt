import { Product } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = "http://localhost:3000/api/products";

const fetchProducts = async () => {
  const resp = await axios.get<Product[]>(BASE_URL);
  return resp.data;
};

const updateProduct = async (record: Product) => {
  const resp = await axios.put(`${BASE_URL}/${record.id}`, record);
  return resp.data;
};

export default function useProducts() {
  const queryClient = useQueryClient();

  const { data, ...rest } = useQuery<Product[]>(["products"], fetchProducts);

  const updateMutation = useMutation(updateProduct, {
    onSuccess() {
      queryClient.invalidateQueries(["products"]);
    },
  });

  return {
    products: data || [],

    ...rest,

    mutations: {
      update: updateMutation,
    },
  };
}

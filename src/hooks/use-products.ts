import { Product, ProductPrice } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const BASE_URL = `${API_URL}/api/products`;

export type ProductDetails = Product & {
  prices: ProductPrice[];
};

const fetchProducts = async () => {
  const resp = await axios.get<ProductDetails[]>(BASE_URL);
  return resp.data;
};

const updateProduct = async (record: Product) => {
  const resp = await axios.put<Product>(`${BASE_URL}/${record.id}`, record);
  return resp.data;
};

export default function useProducts() {
  const queryClient = useQueryClient();

  const { data, ...rest } = useQuery<ProductDetails[]>(
    ["products"],
    fetchProducts
  );

  const updateMutation = useMutation(updateProduct, {
    onSuccess(resp) {
      queryClient.invalidateQueries(["products"]);

      if ((resp && resp.discId) || resp.isDisc === false) {
        queryClient.invalidateQueries(["data-cleaning"]);
      }
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

import { apiService } from "../../service/api-service";
import { APIClientMutationBuilder, APIClientQueryBuilder } from "../../types";
import { ProductCreatePayload, ProductResponse } from "./types";

export const createProductBuilder: APIClientMutationBuilder<
  ProductCreatePayload,
  ProductResponse
> = {
  cacheKey: ["PRODUCTS", "CREATE"],
  module: "products",
  resolver: async (props: ProductCreatePayload) =>
    apiService.post<ProductCreatePayload, ProductResponse>(
      "/api/products",
      props
    ),
};

export const listProductsBuilder: APIClientQueryBuilder<
  null,
  ProductResponse[]
> = {
  cacheKey: ["PRODUCTS", "LIST"],
  module: "products",
  resolver: async () => apiService.get<ProductResponse[]>("/api/products"),
};

export const getProductBuilder = (
  id: string
): APIClientQueryBuilder<null, ProductResponse> => ({
  cacheKey: ["PRODUCTS", "GET", id],
  module: "products",
  resolver: async () => apiService.get<ProductResponse>(`/api/products/${id}`),
});

export const updateProductBuilder = (
  id: string
): APIClientMutationBuilder<
  Partial<ProductCreatePayload>,
  ProductResponse
> => ({
  cacheKey: ["PRODUCTS", "UPDATE", id],
  module: "products",
  resolver: async (props) =>
    apiService.patch<Partial<ProductCreatePayload>, ProductResponse>(
      `/api/products/${id}`,
      props as any
    ),
});

export const deleteProductBuilder = (
  id: string
): APIClientMutationBuilder<null, { success: boolean }> => ({
  cacheKey: ["PRODUCTS", "DELETE", id],
  module: "products",
  resolver: async () =>
    apiService.delete<{ success: boolean }>(`/api/products/${id}`),
});

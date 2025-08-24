import { apiService } from "../../service/api-service";
import { APIClientMutationBuilder, APIClientQueryBuilder } from "../../types";
import { CartCreatePayload, CartResponse } from "./types";

export const createCartBuilder: APIClientMutationBuilder<
  CartCreatePayload,
  CartResponse
> = {
  cacheKey: ["CARTS", "CREATE"],
  module: "carts",
  resolver: async (props: CartCreatePayload) =>
    apiService.post<CartCreatePayload, CartResponse>("/api/carts", props),
};

export const listCartsBuilder: APIClientQueryBuilder<null, CartResponse[]> = {
  cacheKey: ["CARTS", "LIST"],
  module: "carts",
  resolver: async () => apiService.get<CartResponse[]>("/api/carts"),
};

export const getCartBuilder: APIClientQueryBuilder<
  { id: string },
  CartResponse
> = {
  cacheKey: ["CARTS", "GET"],
  module: "carts",
  resolver: async (props: { id: string }) =>
    apiService.get<CartResponse>(`/api/carts/${props.id}`),
};

// MODIFIED: updateCartBuilder is now a static object.
export const updateCartBuilder: APIClientMutationBuilder<
  Partial<CartCreatePayload> & { id: string },
  CartResponse
> = {
  cacheKey: ["CARTS", "UPDATE"],
  module: "carts",
  // The resolver now accepts props containing the id and the payload.
  resolver: async (props) => {
    const { id, ...payload } = props;
    return apiService.patch<Partial<CartCreatePayload>, CartResponse>(
      `/api/carts/${id}`,
      payload
    );
  },
};

// MODIFIED: deleteCartBuilder is now a static object.
export const deleteCartBuilder: APIClientMutationBuilder<
  { id: string },
  { success: boolean }
> = {
  cacheKey: ["CARTS", "DELETE"],
  module: "carts",
  // The resolver now accepts a props object containing the id.
  resolver: async (props: { id: string }) =>
    apiService.delete<{ success: boolean }>(`/api/carts/${props.id}`),
};

export default {
  createCartBuilder,
  listCartsBuilder,
  getCartBuilder,
  updateCartBuilder,
  deleteCartBuilder,
};

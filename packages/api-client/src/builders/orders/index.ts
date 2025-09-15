import { apiService } from "../../service/api-service";
import { APIClientMutationBuilder, APIClientQueryBuilder } from "../../types";
import { OrderCreatePayload, OrderResponse } from "./types";

export const createOrderBuilder: APIClientMutationBuilder<
  OrderCreatePayload,
  OrderResponse
> = {
  cacheKey: ["ORDERS", "CREATE"],
  module: "orders",
  resolver: async (props: OrderCreatePayload) =>
    apiService.post<OrderCreatePayload, OrderResponse>("/api/orders", props),
};

export const listOrdersBuilder: APIClientQueryBuilder<null, OrderResponse[]> = {
  cacheKey: ["ORDERS", "LIST"],
  module: "orders",
  resolver: async () => apiService.get<OrderResponse[]>("/api/orders"),
};

// MODIFIED: getOrderBuilder is now a static object.
export const getOrderBuilder: APIClientQueryBuilder<
  { id: string },
  OrderResponse
> = {
  // The base cache key. The calling function should append the
  // id for unique query caching (e.g., [...builder.cacheKey, id]).
  cacheKey: ["ORDERS", "GET"],
  module: "orders",
  // The resolver now accepts a props object containing the id.
  resolver: async (props: { id: string }) =>
    apiService.get<OrderResponse>(`/api/orders/${props.id}`),
};

export const updateOrderBuilder = (
  id: string
): APIClientMutationBuilder<Partial<OrderCreatePayload>, OrderResponse> => ({
  cacheKey: ["ORDERS", "UPDATE", id],
  module: "orders",
  resolver: async (props) =>
    apiService.patch<Partial<OrderCreatePayload>, OrderResponse>(
      `/api/orders/${id}`,
      props as any
    ),
});

export const deleteOrderBuilder = (
  id: string
): APIClientMutationBuilder<null, { success: boolean }> => ({
  cacheKey: ["ORDERS", "DELETE", id],
  module: "orders",
  resolver: async () =>
    apiService.delete<{ success: boolean }>(`/api/orders/${id}`),
});

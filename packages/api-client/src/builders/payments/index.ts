import { apiService } from "../../service/api-service";
import { APIClientMutationBuilder, APIClientQueryBuilder } from "../../types";
import { PaymentCreatePayload, PaymentResponse } from "./types";

export const createPaymentBuilder: APIClientMutationBuilder<
  PaymentCreatePayload,
  PaymentResponse
> = {
  cacheKey: ["PAYMENTS", "CREATE"],
  module: "payments",
  resolver: async (props: PaymentCreatePayload) =>
    apiService.post<PaymentCreatePayload, PaymentResponse>(
      "/api/payments",
      props
    ),
};

export const listPaymentsBuilder: APIClientQueryBuilder<
  null,
  PaymentResponse[]
> = {
  cacheKey: ["PAYMENTS", "LIST"],
  module: "payments",
  resolver: async () => apiService.get<PaymentResponse[]>("/api/payments"),
};

// MODIFIED: getPaymentBuilder is now a static object.
export const getPaymentBuilder: APIClientQueryBuilder<
  { id: string },
  PaymentResponse
> = {
  // The base cache key. The calling function should append the
  // id for unique query caching (e.g., [...builder.cacheKey, id]).
  cacheKey: ["PAYMENTS", "GET"],
  module: "payments",
  // The resolver now accepts a props object containing the id.
  resolver: async (props: { id: string }) =>
    apiService.get<PaymentResponse>(`/api/payments/${props.id}`),
};

export const updatePaymentBuilder = (
  id: string
): APIClientMutationBuilder<
  Partial<PaymentCreatePayload>,
  PaymentResponse
> => ({
  cacheKey: ["PAYMENTS", "UPDATE", id],
  module: "payments",
  resolver: async (props) =>
    apiService.patch<Partial<PaymentCreatePayload>, PaymentResponse>(
      `/api/payments/${id}`,
      props as any
    ),
});

export const deletePaymentBuilder = (
  id: string
): APIClientMutationBuilder<null, { success: boolean }> => ({
  cacheKey: ["PAYMENTS", "DELETE", id],
  module: "payments",
  resolver: async () =>
    apiService.delete<{ success: boolean }>(`/api/payments/${id}`),
});

export default {
  createPaymentBuilder,
  listPaymentsBuilder,
  getPaymentBuilder,
  updatePaymentBuilder,
  deletePaymentBuilder,
};

import { apiService } from "../../service/api-service";
import { APIClientMutationBuilder, APIClientQueryBuilder } from "../../types";
import { UserCreatePayload, UserResponse } from "./types";

export const createUserBuilder: APIClientMutationBuilder<
  UserCreatePayload,
  UserResponse
> = {
  cacheKey: ["USERS", "CREATE"],
  module: "users",
  resolver: async (props: UserCreatePayload) =>
    apiService.post<UserCreatePayload, UserResponse>("/api/users", props),
};

export const listUsersBuilder: APIClientQueryBuilder<null, UserResponse[]> = {
  cacheKey: ["USERS", "LIST"],
  module: "users",
  resolver: async () => apiService.get<UserResponse[]>("/api/users"),
};

export const getUserBuilder = (
  id: string
): APIClientQueryBuilder<null, UserResponse> => ({
  cacheKey: ["USERS", "GET", id],
  module: "users",
  resolver: async () => apiService.get<UserResponse>(`/api/users/${id}`),
});

export const updateUserBuilder = (
  id: string
): APIClientMutationBuilder<Partial<UserCreatePayload>, UserResponse> => ({
  cacheKey: ["USERS", "UPDATE", id],
  module: "users",
  resolver: async (props) =>
    apiService.patch<Partial<UserCreatePayload>, UserResponse>(
      `/api/users/${id}`,
      props as any
    ),
});

export const deleteUserBuilder = (
  id: string
): APIClientMutationBuilder<null, { success: boolean }> => ({
  cacheKey: ["USERS", "DELETE", id],
  module: "users",
  resolver: async () =>
    apiService.delete<{ success: boolean }>(`/api/users/${id}`),
});

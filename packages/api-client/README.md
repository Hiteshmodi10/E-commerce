API client builders and TanStack Query helpers for the monorepo.

Usage:

- Define small builder objects that match `APIClientQueryBuilder` or `APIClientMutationBuilder`.
- Use `useQuery(builder)` or `useMutation(builder)` from `@repo/api-client` in React components.

Example:

import { apiService } from "../../lib/dashboard.client";
import { APIClientMutationBuilder } from "@repo/api-client";

export const loginUserEmailBuilder: APIClientMutationBuilder<
  { email: string; password: string },
  { token: string }
> = {
  cacheKey: ["AUTH", "LOGIN"],
  module: "login",
  resolver: async (props) => apiService.post('/auth/login/email/password', props),
};

Configuration (example - attach Supabase access token):

import { configureApiService } from '@repo/api-client';
// call early in your app initialization (e.g. App.tsx)
configureApiService({
  baseUrl: '/api',
  getToken: async () => {
    // return the currently signed-in Supabase access token
    // e.g. const { data } = await supabase.auth.getSession(); return data.session?.access_token ?? null
    return null;
  },
});

import {
  QueryFunctionContext,
  UseQueryOptions,
  QueryKey,
} from "@tanstack/react-query";
import { APIClientQueryBuilder } from "@repo/api-client";

export const buildClientQueryBuilder = <E, R>(
  config: APIClientQueryBuilder<E, R>
): UseQueryOptions<R, unknown, R, QueryKey> => {
  return {
    queryKey: config.cacheKey,
    queryFn: ({ queryKey }: QueryFunctionContext) => {
      const [, props] = queryKey as [string, E];
      return config.resolver(props);
    },
    enabled: config.options?.enabled ?? true,
    refetchInterval: ({ state }) => {
      if (state.error) {
        return false;
      }
      if (typeof config.options?.refetchInterval === "number") {
        return config.options.refetchInterval;
      }
    },
    refetchIntervalInBackground:
      config.options?.refetchIntervalInBackground ?? false,
    retry: config.options?.retry ?? 3,
  };
};

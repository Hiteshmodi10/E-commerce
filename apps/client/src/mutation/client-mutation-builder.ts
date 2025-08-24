import { UseMutationOptions, MutationKey } from "@tanstack/react-query";
import { APIClientMutationBuilder } from "@repo/api-client";

export const buildClientMutationBuilder = <E, R>(
  config: APIClientMutationBuilder<E, R>
): UseMutationOptions<R, unknown, E, MutationKey> => {
  return {
    mutationKey: config.cacheKey,
    mutationFn: async (props: E) => await config.resolver(props),
  };
};

import { useQuery as useRQQuery } from "@tanstack/react-query";
import { APIClientQueryBuilder } from "@repo/api-client";
import { buildClientQueryBuilder } from "./client-query-builder";

export const useQuery = <E = unknown, R = unknown>(
  props: APIClientQueryBuilder<E, R>
) => {
  const queryKey = buildClientQueryBuilder(props)
    .queryKey as unknown as readonly unknown[];
  const queryFn = buildClientQueryBuilder(props)
    .queryFn as unknown as () => Promise<R>;
  return useRQQuery<R, Error>({ queryKey, queryFn });
};

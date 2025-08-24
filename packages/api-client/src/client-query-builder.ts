import { QueryFunctionContext, UseQueryOptions, QueryKey } from '@tanstack/react-query';
import { APIClientQueryBuilder } from './types';

export const buildClientQueryBuilder = <E, R>(
  config: APIClientQueryBuilder<E, R>
): UseQueryOptions<R, Error, R, QueryKey> => {
  const opts: any = {
    queryKey: config.cacheKey,
    queryFn: ({ queryKey }: QueryFunctionContext) => {
      const [, props] = queryKey as [string, E];
      return config.resolver(props) as Promise<R> | R;
    },
    enabled: typeof config.options?.enabled === 'function' ? undefined : config.options?.enabled ?? true,
    refetchInterval: ({ state }: any) => {
      if (state.error) return false;
      if (typeof config.options?.refetchInterval === 'number') {
        return config.options.refetchInterval;
      }
      return false;
    },
    refetchIntervalInBackground: config.options?.refetchIntervalInBackground ?? false,
    retry: config.options?.retry ?? 3,
    keepPreviousData: config.options?.keepPreviousData ?? false,
    refetchOnWindowFocus: config.options?.refetchOnWindowFocus ?? true,
  };

  return opts as UseQueryOptions<R, Error, R, QueryKey>;
};

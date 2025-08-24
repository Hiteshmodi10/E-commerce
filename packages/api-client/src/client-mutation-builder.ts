import { UseMutationOptions, MutationKey } from '@tanstack/react-query';
import { APIClientMutationBuilder } from './types';

export const buildClientMutationBuilder = <E, R>(
  config: APIClientMutationBuilder<E, R>
): UseMutationOptions<R, Error, E, MutationKey> => {
  const opts: any = {
    mutationKey: config.cacheKey,
    mutationFn: config.resolver as any,
  };

  return opts as UseMutationOptions<R, Error, E, MutationKey>;
};

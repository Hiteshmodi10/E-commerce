import { useQuery as useRQQuery } from '@tanstack/react-query';
import { APIClientQueryBuilder } from '../types';
import { buildClientQueryBuilder } from '../client-query-builder';

export const useQuery = <E, R>(props: APIClientQueryBuilder<E, R>) => {
  // buildClientQueryBuilder returns UseQueryOptions<R, Error, R, QueryKey>
  // react-query's useQuery overloads expect the Error generic to be Error
  return useRQQuery<R>(buildClientQueryBuilder(props) as any);
};

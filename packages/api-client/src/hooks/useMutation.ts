import { useMutation as useRQMutation, MutationKey } from '@tanstack/react-query';
import { APIClientMutationBuilder } from '../types';
import { buildClientMutationBuilder } from '../client-mutation-builder';

export const useMutation = <E, R>(props: APIClientMutationBuilder<E, R>) => {
  return useRQMutation<R, unknown, E, MutationKey>(buildClientMutationBuilder(props) as any);
};

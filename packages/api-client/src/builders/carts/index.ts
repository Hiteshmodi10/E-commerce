import { apiService } from '../../service/api-service';
import { APIClientMutationBuilder, APIClientQueryBuilder } from '../../types';
import { CartCreatePayload, CartResponse } from './types';

export const createCartBuilder: APIClientMutationBuilder<CartCreatePayload, CartResponse> = {
  cacheKey: ['CARTS', 'CREATE'],
  module: 'carts',
  resolver: async (props: CartCreatePayload) => apiService.post<CartCreatePayload, CartResponse>('/api/carts', props),
};

export const listCartsBuilder: APIClientQueryBuilder<null, CartResponse[]> = {
  cacheKey: ['CARTS', 'LIST'],
  module: 'carts',
  resolver: async () => apiService.get<CartResponse[]>('/api/carts'),
};

export const getCartBuilder = (id: string): APIClientQueryBuilder<null, CartResponse> => ({
  cacheKey: ['CARTS', 'GET', id],
  module: 'carts',
  resolver: async () => apiService.get<CartResponse>(`/api/carts/${id}`),
});

export const updateCartBuilder = (id: string): APIClientMutationBuilder<Partial<CartCreatePayload>, CartResponse> => ({
  cacheKey: ['CARTS', 'UPDATE', id],
  module: 'carts',
  resolver: async (props) => apiService.patch<Partial<CartCreatePayload>, CartResponse>(`/api/carts/${id}`, props as any),
});

export const deleteCartBuilder = (id: string): APIClientMutationBuilder<null, { success: boolean }> => ({
  cacheKey: ['CARTS', 'DELETE', id],
  module: 'carts',
  resolver: async () => apiService.delete<{ success: boolean }>(`/api/carts/${id}`),
});

export default {
  createCartBuilder,
  listCartsBuilder,
  getCartBuilder,
  updateCartBuilder,
  deleteCartBuilder,
};

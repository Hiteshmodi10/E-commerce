export interface OrderCreatePayload { userId: string; items: Array<{ productId: string; quantity: number }>; total: number; status?: string }
export interface OrderResponse { id: string; userId: string; items: Array<{ productId: string; quantity: number }>; total: number; status: string }

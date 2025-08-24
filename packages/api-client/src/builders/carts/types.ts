export interface CartCreatePayload { userId: string; items: Array<{ productId: string; quantity: number }> }
export interface CartResponse { id: string; userId: string; items: Array<{ productId: string; quantity: number }> }

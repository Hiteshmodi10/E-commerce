export interface PaymentCreatePayload { orderId: string; provider: string; amount: number; status?: string }
export interface PaymentResponse { id: string; orderId: string; provider: string; amount: number; status: string }

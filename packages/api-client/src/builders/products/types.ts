export interface ProductCreatePayload { 
  name: string; 
  description: string; 
  price: number; 
  originalPrice?: number;
  image?: string; 
  category: string;
  stock: number;
  rating?: number;
}

export interface ProductResponse { 
  id: string; 
  name: string; 
  description: string; 
  price: number; 
  originalPrice?: number;
  image?: string; 
  category: string;
  stock: number;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  quantity: number;
  image?: string;
}

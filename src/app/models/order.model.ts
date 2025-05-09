import { Product } from "./product.model";

export interface CreateOrderRequest {
  details: CreateOrderDetailRequest[];
}

export interface CreateOrderDetailRequest {
  quantity: number;
  product_id: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface Payment {
  link: string;
}

export interface PaymentRequestDTO {
  businessKey: String;
}

export interface Order {
  totalPrice: number;
  totalProduct: number;
  status: string;
  businessKey: string;
}

export interface CreateOrderResponse {
  totalPrice: number;
  totalProduct: number;
  status: string;
  createOrderDetailResponses: CreateOrderDetailResponse[];
}

export interface CreateOrderDetailResponse {
  quantity: number;
  product: Product;
  price: number;
  businessKey: string;
}

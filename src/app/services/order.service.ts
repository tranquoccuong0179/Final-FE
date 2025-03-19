import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
  CreateOrderRequest,
  CreateOrderResponse,
  ApiResponse,
  Order,
  Payment,
  PaymentRequestDTO,
} from "../models/order.model";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private apiUrl = "http://14.225.220.28:8182/api/v1/order";

  constructor(private http: HttpClient) {}

  createOrder(orderData: CreateOrderRequest): Observable<CreateOrderResponse> {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error(
        "Bạn chưa đăng nhập. Vui lòng đăng nhập trước khi đặt hàng."
      );
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });

    return this.http
      .post<ApiResponse<CreateOrderResponse>>(this.apiUrl, orderData, {
        headers,
      })
      .pipe(map((response) => response.data));
  }

  getOrders(): Observable<Order[]> {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error(
        "Bạn chưa đăng nhập. Vui lòng đăng nhập trước khi xem đơn hàng."
      );
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });

    return this.http
      .get<ApiResponse<Order[]>>(this.apiUrl, { headers })
      .pipe(map((response) => response.data));
  }

  getOrdersForAdmin(): Observable<Order[]> {
    return this.http
      .get<ApiResponse<Order[]>>(`${this.apiUrl}/admin`)
      .pipe(map((response) => response.data));
  }

  receiveOrder(id: number): Observable<Order> {
    return this.http
      .put<ApiResponse<Order>>(`${this.apiUrl}/${id}/receive`, {})
      .pipe(map((response) => response.data));
  }

  paymentOrder(request: PaymentRequestDTO): Observable<string> {
    return this.http
      .post(
        `http://localhost:8080/api/v1/payment/create?businessKey=${request.businessKey}`,
        {},
        { responseType: "text" }
      )
      .pipe(map((response) => response));
  }
}

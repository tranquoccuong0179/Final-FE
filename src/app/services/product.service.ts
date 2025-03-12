import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiResponse, Product, ProductRequest } from "../models/product.model";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private apiUrl = "http://localhost:8080/api/v1/product";

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http
      .get<ApiResponse<Product[]>>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  addProduct(product: ProductRequest): Observable<Product> {
    return this.http
      .post<ApiResponse<Product>>(this.apiUrl, product)
      .pipe(map((response) => response.data));
  }

  updateProduct(id: number, product: ProductRequest): Observable<Product> {
    return this.http
      .put<ApiResponse<Product>>(`${this.apiUrl}/${id}`, product)
      .pipe(map((response) => response.data));
  }

  getProduct(id: number): Observable<Product> {
    return this.http
      .get<ApiResponse<Product>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  deleteProduct(id: number): Observable<Product> {
    return this.http
      .delete<ApiResponse<Product>>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.data));
  }
}

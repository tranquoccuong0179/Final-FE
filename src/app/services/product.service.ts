import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiResponse, Product, ProductRequest } from "../models/product.model";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private apiUrl = "http://14.225.220.28:8182/api/v1/product";

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http
      .get<ApiResponse<Product[]>>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  addProduct(product: ProductRequest, file: File): Observable<Product> {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", product.price.toString());
    formData.append("quantity", product.quantity.toString()); // Thêm quantity
    formData.append("file", file);
    return this.http
      .post<ApiResponse<Product>>(this.apiUrl, formData)
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

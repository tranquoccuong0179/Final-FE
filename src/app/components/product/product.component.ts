import { CurrencyPipe } from "./../../pipe/currency.pipe";
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProductService } from "../../services/product.service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import {
  CreateOrderDetailRequest,
  CreateOrderRequest,
  CreateOrderResponse,
} from "../../models/order.model";
import { OrderService } from "../../services/order.service";
@Component({
  selector: "app-product",
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule],
  template: `
    <div class="container">
      <header class="header">
        <button class="home-btn" (click)="goToHome()">Home</button>
        <div class="title-wrapper">
          <h1 class="title">Product List</h1>
        </div>
        <button *ngIf="isAdmin" class="add-btn" (click)="addProduct()">
          Thêm sản phẩm
        </button>
      </header>

      <main class="content">
        <div *ngIf="products.length > 0; else noProducts" class="product-grid">
          <div *ngFor="let product of products" class="product-card">
            <img [src]="product.imageUrl" alt="{{ product.name }}" />
            <h2>{{ product.name }}</h2>
            <p class="description">{{ product.description }}</p>
            <p class="price">{{ product.price | currency : "VND" }}</p>

            <div class="product-actions">
              <button
                class="view-details-btn"
                (click)="viewProduct(product.id)"
              >
                {{ isAdmin ? "Chỉnh sửa" : "Xem chi tiết" }}
              </button>

              <div *ngIf="!isAdmin" class="quantity-selector">
                <label for="quantity_{{ product.id }}">Số lượng:</label>
                <div class="quantity-input">
                  <button (click)="decreaseQuantity(product)">-</button>
                  <input
                    type="number"
                    id="quantity_{{ product.id }}"
                    [(ngModel)]="productQuantities[product.id]"
                    min="0"
                    (change)="updateOrderButtonVisibility()"
                  />
                  <button (click)="increaseQuantity(product)">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ng-template #noProducts>
          <p class="no-products">Không có sản phẩm nào.</p>
        </ng-template>
      </main>

      <footer *ngIf="showOrderButton" class="footer">
        <button class="order-btn" (click)="placeOrder()">Đặt hàng</button>
      </footer>

      <div *ngIf="selectedProduct" class="popup-overlay" (click)="closePopup()">
        <div class="popup-content" (click)="$event.stopPropagation()">
          <button class="close-btn" (click)="closePopup()">×</button>
          <ng-container *ngIf="isAdmin; else viewMode">
            <h2 class="popup-title">Chỉnh sửa sản phẩm</h2>
            <div class="form-group">
              <label for="name">Tên sản phẩm:</label>
              <input id="name" type="text" [(ngModel)]="selectedProduct.name" />
            </div>

            <div class="form-group">
              <label for="imageUrl">Hình ảnh URL:</label>
              <input
                id="imageUrl"
                type="text"
                [(ngModel)]="selectedProduct.imageUrl"
              />
            </div>

            <div class="form-group">
              <label for="price">Giá:</label>
              <input
                id="price"
                type="number"
                [(ngModel)]="selectedProduct.price"
              />
            </div>

            <div class="form-group">
              <label for="description">Mô tả:</label>
              <textarea
                id="description"
                [(ngModel)]="selectedProduct.description"
              ></textarea>
            </div>

            <div class="button-group">
              <button class="update-btn" (click)="saveChanges()">
                Cập nhật
              </button>
              <button class="delete-btn" (click)="deleteProduct()">Xóa</button>
            </div>
          </ng-container>

          <ng-template #viewMode>
            <h2>{{ selectedProduct.name }}</h2>
            <img
              [src]="selectedProduct.imageUrl"
              alt="{{ selectedProduct.name }}"
            />
            <p>Giá: {{ selectedProduct.price | currency : "VND" }}</p>
            <p>Mô tả: {{ selectedProduct.description }}</p>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background-color: #f3f4f6;
        font-family: "Arial", sans-serif;
      }

      .header {
        background-color: #4f46e5;
        color: #fff;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .header .title-wrapper {
        text-align: center;
        flex-grow: 1;
      }

      .home-btn {
        background-color: #10b981;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .home-btn:hover {
        background-color: #059669;
      }

      .title {
        margin: 0;
        font-size: 24px;
      }

      .content {
        flex-grow: 1;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
        width: 100%;
        max-width: 1000px;
      }

      .product-card {
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        text-align: center;
        background: white;
        transition: transform 0.3s ease-in-out;
      }

      .product-card:hover {
        transform: scale(1.05);
      }

      .product-card img {
        width: 100%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 5px;
        cursor: pointer;
      }

      .product-card h2 {
        margin-top: 0;
        margin-bottom: 5px;
      }

      .product-card .description {
        font-size: 0.9em;
        color: #666;
        margin-bottom: 5px;
      }

      .product-card .price {
        font-weight: bold;
      }

      .product-actions {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 10px;
      }

      .view-details-btn {
        background-color: #4caf50;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 5px;
        cursor: pointer;
        margin-bottom: 5px;
      }

      .quantity-selector {
        margin-top: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .quantity-selector label {
        margin-right: 5px;
      }

      .quantity-input {
        display: flex;
        align-items: center;
      }

      .quantity-input button {
        background-color: #ddd;
        border: none;
        padding: 5px 10px;
        cursor: pointer;
      }

      .quantity-input input {
        width: 50px;
        text-align: center;
        margin: 0 5px;
      }

      .footer {
        background-color: #f3f4f6;
        padding: 20px;
        text-align: center;
        box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
      }

      .order-btn {
        background-color: #2196f3;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        font-size: 16px;
      }

      .order-btn:hover {
        background-color: #1976d2;
      }

      .popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .popup-content {
        background: white;
        padding: 30px;
        border-radius: 15px;
        text-align: left;
        position: relative;
        max-width: 700px;
        width: 90%;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }

      .popup-title {
        font-size: 24px;
        margin-bottom: 20px;
        color: #333;
        text-align: center;
      }

      .form-group {
        margin-bottom: 20px;
      }

      label {
        display: block;
        font-weight: 500;
        margin-bottom: 5px;
        color: #555;
      }

      input[type="text"],
      input[type="number"],
      textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 16px;
        color: #333;
        box-sizing: border-box;
      }

      textarea {
        height: 100px;
      }

      .button-group {
        display: flex;
        justify-content: flex-end;
        gap: 15px;
        margin-top: 20px;
      }

      .close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: transparent;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #888;
        transition: color 0.3s ease;
      }

      .close-btn:hover {
        color: #333;
      }

      .add-btn {
        background-color: #4caf50;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        font-size: 16px;
      }

      .add-btn:hover {
        background-color: #388e3c;
      }

      .update-btn {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .update-btn:hover {
        background-color: #0056b3;
      }

      .delete-btn {
        background-color: #dc3545;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .delete-btn:hover {
        background-color: #c82333;
      }
    `,
  ],
})
export class ProductComponent implements OnInit {
  products: any[] = [];
  selectedProduct: any = null;
  isAdmin = false;
  productQuantities: { [productId: number]: number } = {};
  showOrderButton = false;
  orderData: CreateOrderResponse | null = null; // Lưu trữ response tạo đơn hàng

  constructor(
    private productService: ProductService,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.checkAdminRole();
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.products.forEach((product) => {
          this.productQuantities[product.id] = 0;
        });
      },
      error: (error) => {
        console.error("Error loading products:", error);
      },
    });
  }

  viewProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: (data) => {
        this.selectedProduct = data;
      },
      error: (error) => {
        console.error("Error fetching product:", error);
      },
    });
  }

  closePopup(): void {
    this.selectedProduct = null;
  }

  updateProduct(id: number): void {
    this.viewProduct(id);
  }

  goToHome() {
    this.router.navigate(["/home"]);
  }

  checkAdminRole(): void {
    this.isAdmin = localStorage.getItem("role") === "admin";
  }

  addProduct() {
    this.router.navigate(["/product/add"]);
  }

  saveChanges(): void {
    this.productService
      .updateProduct(this.selectedProduct.id, this.selectedProduct)
      .subscribe({
        next: () => {
          alert("Cập nhật thành công!");
          this.closePopup();
          this.loadProducts();
        },
        error: (error) => {
          console.error("Lỗi khi cập nhật sản phẩm:", error);
        },
      });
  }

  deleteProduct(): void {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      this.productService.deleteProduct(this.selectedProduct.id).subscribe({
        next: () => {
          alert("Xóa sản phẩm thành công!");
          this.closePopup();
          this.loadProducts();
        },
        error: (error) => {
          console.error("Lỗi khi xóa sản phẩm:", error);
        },
      });
    }
  }

  updateOrderButtonVisibility(): void {
    this.showOrderButton = Object.values(this.productQuantities).some(
      (quantity) => quantity > 0
    );
  }

  placeOrder(): void {
    const orderDetails: CreateOrderDetailRequest[] = [];
    for (const productId in this.productQuantities) {
      if (
        this.productQuantities.hasOwnProperty(productId) &&
        this.productQuantities[productId] > 0
      ) {
        orderDetails.push({
          product_id: Number(productId),
          quantity: this.productQuantities[productId],
        });
      }
    }

    const orderData: CreateOrderRequest = { details: orderDetails };
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Bạn chưa đăng nhập. Vui lòng đăng nhập trước khi đặt hàng.");
      return;
    }

    this.orderService.createOrder(orderData).subscribe({
      next: (order) => {
        console.log("Order created successfully:", order);
        alert("Đặt hàng thành công!");
        this.orderData = order;

        Object.keys(this.productQuantities).forEach((productId) => {
          this.productQuantities[Number(productId)] = 0;
        });
        this.updateOrderButtonVisibility();
        this.router.navigate(["/order"]);
      },
      error: (error) => {
        console.error("Error creating order:", error);
        alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.");
      },
    });
  }

  increaseQuantity(product: any): void {
    this.productQuantities[product.id] =
      (this.productQuantities[product.id] || 0) + 1;
    this.updateOrderButtonVisibility();
  }

  decreaseQuantity(product: any): void {
    if (this.productQuantities[product.id] > 0) {
      this.productQuantities[product.id] -= 1;
      this.updateOrderButtonVisibility();
    }
  }
}

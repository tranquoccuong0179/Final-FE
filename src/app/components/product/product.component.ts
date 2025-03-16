import { CurrencyPipe } from "@angular/common";
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
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzInputNumberModule } from "ng-zorro-antd/input-number";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzModalModule, NzModalService } from "ng-zorro-antd/modal";
import {
  EditOutline,
  EyeOutline,
  ShoppingCartOutline,
} from "@ant-design/icons-angular/icons";
import { IconDefinition } from "@ant-design/icons-angular";
import { AuthService } from "../../services/auth.service";

const icons: IconDefinition[] = [EditOutline, EyeOutline, ShoppingCartOutline];

@Component({
  selector: "app-product",
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    FormsModule,
    NzButtonModule,
    NzIconModule,
    NzInputNumberModule,
    NzCardModule,
    NzModalModule,
  ],
  template: `
    <div class="container">
      <header class="header">
        <div class="header-left">
          <div class="avatar">
            <span>{{ getInitials() }}</span>
          </div>
          <div *ngIf="!isAdmin">
            <h1 class="greeting">
              Chào mừng trở lại, {{ firstName }} {{ lastName }}!
            </h1>
            <p class="subtitle">Hãy khám phá những sản phẩm mới nhất! 🎉</p>
          </div>
        </div>

        <div class="header-right">
          <button class="nav-btn" (click)="goToHome()">Home</button>
          <button class="nav-btn" (click)="goToOrder()">Đơn hàng</button>
        </div>
      </header>

      <main class="content">
        <div class="addproduct">
          <button
            class="btn-add"
            nz-button
            nzType="primary"
            *ngIf="isAdmin"
            (click)="addProduct()"
          >
            <i nz-icon nzType="plus" nzTheme="outline"></i>
            Thêm sản phẩm
          </button>
        </div>
        <div *ngIf="products.length > 0; else noProducts" class="product-grid">
          <nz-card
            *ngFor="let product of products"
            class="product-card"
            [nzHoverable]="true"
            [nzCover]="coverTemplate"
          >
            <ng-template #coverTemplate>
              <img
                [src]="
                  'https://drive.google.com/thumbnail?id=' +
                  getImageId(product.image)
                "
                alt="{{ product.name }}"
                (error)="onImageError($event, product)"
              />
            </ng-template>

            <nz-card-meta
              [nzTitle]="product.name"
              [nzDescription]="product.description"
            ></nz-card-meta>

            <div class="product-quantity">
              Số lượng:
              <span class="quantity-value">
                {{ product.quantity }}
                <span *ngIf="product.quantity > 0; else hetHang">
                  (Còn hàng)
                </span>
                <ng-template #hetHang>(Hết hàng)</ng-template>
              </span>
            </div>

            <div class="price">
              {{ product.price | currency : "VND" }}
            </div>
            <div *ngIf="!isAdmin" class="quantity-selector">
              <label for="quantity_{{ product.id }}">Số lượng:</label>
              <nz-input-number-group>
                <button
                  nz-button
                  nzType="default"
                  nzSize="small"
                  (click)="decreaseQuantity(product)"
                >
                  <i nz-icon nzType="minus" nzTheme="outline"></i>
                </button>
                <nz-input-number
                  [(ngModel)]="productQuantities[product.id]"
                  [nzMin]="0"
                  [nzStep]="1"
                  (ngModelChange)="updateOrderButtonVisibility()"
                ></nz-input-number>
                <button
                  nz-button
                  nzType="default"
                  nzSize="small"
                  (click)="increaseQuantity(product)"
                >
                  <i nz-icon nzType="plus" nzTheme="outline"></i>
                </button>
              </nz-input-number-group>
            </div>

            <div class="product-actions">
              <button
                nz-button
                nzType="text"
                (click)="openEditModal(product); $event.stopPropagation()"
                *ngIf="isAdmin"
              >
                <i nz-icon nzType="edit" nzTheme="outline"></i>
                Chỉnh sửa
              </button>
              <button
                nz-button
                nzType="text"
                (click)="showViewModal(product); $event.stopPropagation()"
              >
                <i nz-icon nzType="eye" nzTheme="outline"></i> Xem
              </button>
              <button
                nz-button
                nzType="text"
                (click)="addToCart(product); $event.stopPropagation()"
                *ngIf="!isAdmin"
              >
                <i nz-icon nzType="shopping-cart" nzTheme="outline"></i> Thêm
                vào giỏ
              </button>
            </div>
          </nz-card>
        </div>

        <ng-template #noProducts>
          <p class="no-products">Không có sản phẩm nào.</p>
        </ng-template>

        <div *ngIf="showOrderButton" class="place-order-container">
          <button
            nz-button
            nzType="primary"
            (click)="placeOrder()"
            class="place-order-button"
          >
            <i nz-icon nzType="shopping-cart" nzTheme="outline"></i>
            Đặt hàng
          </button>
        </div>
      </main>

      <!-- Product View Modal - Enhanced -->
      <nz-modal
        [(nzVisible)]="isViewModalVisible"
        [nzTitle]="selectedProduct?.name"
        (nzOnCancel)="handleCancel()"
        (nzOnOk)="handleCancel()"
        [nzFooter]="null"
        nzWidth="700px"
        nzClassName="product-view-modal"
      >
        <ng-container *nzModalContent>
          <div class="product-view-container">
            <div class="product-view-image-container">
              <img
                *ngIf="selectedProduct"
                [src]="
                  'https://drive.google.com/thumbnail?id=' +
                  getImageId(selectedProduct?.image)
                "
                alt="{{ selectedProduct?.name }}"
                class="product-view-image"
                (error)="onImageError($event, selectedProduct)"
              />
            </div>

            <div class="product-view-details">
              <h2 class="product-view-name">{{ selectedProduct?.name }}</h2>

              <div class="product-info-row">
                <span class="product-info-label">Giá:</span>
                <span class="product-view-price">
                  {{ selectedProduct?.price | currency : "VND" }}
                </span>
              </div>

              <div class="product-info-row">
                <span class="product-info-label">Số lượng:</span>
                <span class="product-view-quantity">
                  {{ selectedProduct?.quantity }}
                  <span *ngIf="selectedProduct.quantity > 0; else hetHang">
                    (Còn hàng)
                  </span>
                  <ng-template #hetHang class="het-hang-text"
                    >(Hết hàng)</ng-template
                  >
                </span>
              </div>

              <div class="product-info-row">
                <span class="product-info-label">Mô tả:</span>
                <div class="product-view-description">
                  {{ selectedProduct?.description }}
                </div>
              </div>

              <div class="product-view-actions">
                <button
                  nz-button
                  nzType="default"
                  (click)="handleCancel()"
                  class="close-button"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </ng-container>
      </nz-modal>

      <!-- Product Edit Modal -->
      <nz-modal
        [(nzVisible)]="isEditModalVisible"
        nzTitle="{{ isAdmin ? 'Chỉnh sửa sản phẩm' : 'Xem chi tiết' }}"
        (nzOnCancel)="closeEditModal()"
        (nzOnOk)="saveChanges()"
        [nzOkText]="isAdmin ? 'Cập nhật' : 'OK'"
        [nzCancelText]="'Hủy'"
        nzClassName="bordered-modal"
      >
        <ng-container *nzModalContent>
          <div class="edit-modal-content">
            <ng-container *ngIf="isAdmin; else viewMode">
              <div class="form-group">
                <label for="name">Tên sản phẩm:</label>
                <input
                  nz-input
                  id="name"
                  type="text"
                  [(ngModel)]="selectedProduct!.name"
                />
              </div>

              <div class="form-group">
                <label for="imageUrl">Hình ảnh URL:</label>
                <input
                  nz-input
                  id="imageUrl"
                  type="text"
                  [(ngModel)]="selectedProduct!.image"
                />
              </div>

              <div class="form-group">
                <label>Hình ảnh:</label>
                <img
                  *ngIf="selectedProduct"
                  [src]="
                    'https://drive.google.com/thumbnail?id=' +
                    getImageId(selectedProduct!.image)
                  "
                  alt="{{ selectedProduct!.name }}"
                  style="width: 100%; margin-bottom: 10px;"
                  (error)="onImageError($event, selectedProduct)"
                />
              </div>

              <div class="form-group">
                <label for="price">Giá:</label>
                <input
                  nz-input
                  id="price"
                  type="number"
                  [(ngModel)]="selectedProduct!.price"
                />
              </div>

              <div class="form-group">
                <label for="quantity">Số lượng:</label>
                <input
                  nz-input
                  id="quantity"
                  type="number"
                  [(ngModel)]="selectedProduct!.quantity"
                />
              </div>

              <div class="form-group">
                <label for="description">Mô tả:</label>
                <textarea
                  nz-input
                  id="description"
                  [(ngModel)]="selectedProduct!.description"
                  rows="4"
                ></textarea>
              </div>
            </ng-container>

            <ng-template #viewMode>
              <h2 *ngIf="selectedProduct">{{ selectedProduct.name }}</h2>
              <img
                *ngIf="selectedProduct"
                [src]="
                  'https://drive.google.com/thumbnail?id=' +
                  getImageId(selectedProduct.image)
                "
                alt="{{ selectedProduct.name }}"
                style="width: 100%; margin-bottom: 10px;"
                (error)="onImageError($event, selectedProduct)"
              />
              <p *ngIf="selectedProduct">
                Giá: {{ selectedProduct.price | currency : "VND" }}
              </p>
              <p *ngIf="selectedProduct">
                Mô tả: {{ selectedProduct.description }}
              </p>

              <p *ngIf="selectedProduct">
                Số lượng: {{ selectedProduct.quantity }}
              </p>

              <p *ngIf="selectedProduct">
                <span *ngIf="selectedProduct.quantity > 0; else hetHang">
                  Còn hàng
                </span>
                <ng-template #hetHang>Hết hàng</ng-template>
              </p>
            </ng-template>
          </div>
        </ng-container>
      </nz-modal>
    </div>
  `,
  styles: [
    `
      /* General Styles */
      .container {
        position: relative;
        font-family: "Roboto", sans-serif;
        background-color: #f4f7f9;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-grow: 1;
      }

      .content {
        flex-grow: 1;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
      }

      .addproduct {
        display: flex;
        justify-content: flex-end;
        width: 100%; /* Chiếm toàn bộ chiều rộng của content */
        padding-bottom: 10px; /* Add some space below */
      }

      .btn-add {
        background: linear-gradient(135deg, #43cea2, #185a9d);
        color: white;
        padding: 12px 22px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
        font-size: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .btn-add:hover {
        background-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-2px);
      }

      .header {
        background: linear-gradient(
          135deg,
          #43cea2,
          #185a9d
        ); /* Gradient mạnh mẽ */
        color: #fff;
        padding: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        width: 100%;
        box-sizing: border-box;
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .logo {
        width: 50px;
        height: 50px;
        background-color: white;
        border-radius: 50%;
        margin-right: 20px;
      }

      .avatar {
        width: 70px;
        height: 70px;
        background-color: #fff;
        color: #185a9d;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: bold;
        border-radius: 50%;
        text-transform: uppercase;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25);
        transition: all 0.3s ease;
      }

      .avatar:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 10px rgba(0, 0, 0, 0.3);
      }

      .greeting {
        font-size: 28px;
        margin: 0;
        font-weight: 700;
        letter-spacing: 0.5px;
      }

      .subtitle {
        font-size: 18px;
        color: #d4e1f7;
        margin: 0;
      }

      .nav-btn {
        background-color: rgba(255, 255, 255, 0.3);
        color: white;
        padding: 12px 22px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
        font-size: 16px;
      }

      .nav-btn:hover {
        background-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-2px);
      }

      content {
        flex-grow: 1;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
      }

      .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        width: 100%; /* Fixed width */
        max-width: 1400px; /* Increased width */
      }

      /* Enhanced Card Styling */
      .product-card {
        background-color: #fff;
        border-radius: 15px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 450px; /* Increased height */
      }

      .product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
      }

      .product-card img {
        width: 100%;
        height: 220px;
        object-fit: cover;
        border-radius: 10px 10px 0 0; /* Rounded top corners */
      }

      .product-card .ant-card-meta {
        padding: 16px;
      }

      .product-card .ant-card-meta-title {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin-bottom: 8px;
      }

      .product-card .ant-card-meta-description {
        color: #666;
        font-size: 14px;
      }

      .price {
        padding: 16px;
        font-size: 22px;
        font-weight: bold;
        color: #43cea2;
      }

      .product-actions {
        border-top: 1px solid #eee;
        padding: 12px;
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap; /* Allow items to wrap */
      }

      .product-actions button {
        border: none;
        background: none;
        cursor: pointer;
        color: #777;
        transition: color 0.3s ease;
        margin: 5px; /* Added some margin */
      }
      .quantity-selector {
        padding: 15px;
        text-align: center;
      }

      .product-actions button:hover {
        color: #185a9d;
      }

      .product-quantity {
        padding: 8px 16px;
        font-size: 14px;
        color: #777;
        font-style: italic; /* Make it italic like description */
      }

      .quantity-value {
        font-style: normal;
        color: #333; /* Make the number stand out */
        font-weight: bold;
      }

      /* Enhanced Product View Modal Styles */
      .product-view-modal .ant-modal-content {
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        border: none;
      }

      .product-view-container {
        display: flex;
        width: 100%;
        height: 100%;
        background-color: #fff;
      }

      .product-view-image-container {
        width: 40%;
        background-color: #fafafa;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .product-view-image {
        max-width: 100%;
        max-height: 300px;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      .product-view-details {
        width: 60%;
        padding: 30px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
      }

      .product-view-name {
        font-size: 26px;
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 16px;
        text-align: left;
      }

      .product-info-row {
        display: flex;
        align-items: baseline;
        margin-bottom: 12px;
      }

      .product-info-label {
        font-weight: 500;
        color: #718096;
        width: 90px;
        text-align: left;
        flex-shrink: 0;
        font-size: 15px;
      }

      .product-view-price {
        font-size: 20px;
        color: #3182ce;
        font-weight: 600;
      }

      .product-view-quantity {
        font-size: 15px;
        color: #4a5568;
      }

      .product-view-description {
        font-size: 15px;
        color: #4a5568;
        line-height: 1.5;
        overflow-wrap: break-word;
        word-break: break-word;
        text-align: justify;
        margin-top: 8px;
      }

      .product-view-actions {
        margin-top: auto;
        text-align: right;
      }

      .close-button {
        background-color: #edf2f7;
        border: 1px solid #e2e8f0;
        color: #4a5568;
        padding: 10px 24px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        font-size: 16px;
        display: inline-block;
        width: auto;
        height: auto;
        line-height: normal;
      }

      .close-button:hover {
        background-color: #e2e8f0;
        border-color: #cbd5e0;
      }

      /* Styles for Edit Modal */
      .edit-modal-content {
        display: flex;
        flex-direction: column;
      }

      .edit-modal-content .form-group {
        margin-bottom: 12px;
      }

      .edit-modal-content label {
        display: block;
        margin-bottom: 6px;
        font-weight: bold;
      }

      .edit-modal-content input[nz-input],
      .edit-modal-content textarea[nz-input] {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }

      /* Bordered Modal Style */
      .bordered-modal .ant-modal-content {
        border: 1px solid #ddd;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-radius: 10px;
      }

      /* Enhanced Place Order Button */
      .place-order-container {
        display: flex;
        justify-content: center;
        padding: 20px 0;
        width: 100%;
      }

      .place-order-button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 14px 32px;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        font-size: 18px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
      }

      .place-order-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
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
  orderData: CreateOrderResponse | null = null;
  isViewModalVisible = false;
  isEditModalVisible = false;
  isLoading: boolean = true; // Add loading state
  firstName: string = "";
  lastName: string = "";

  private errorHandled: { [key: string]: boolean } = {}; // Track errors

  constructor(
    private productService: ProductService,
    private router: Router,
    private orderService: OrderService,
    private modal: NzModalService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkAdminRole();
    this.authService.getProfile().subscribe((profile: any) => {
      if (profile) {
        this.firstName = profile.firstName;
        this.lastName = profile.lastName;
      }
    });
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        console.log(data);
        this.products = data;
        this.products.forEach((product) => {
          this.productQuantities[product.id] = 0;
        });
        this.isLoading = false; // Set loading to false when products are loaded
      },
      error: (error) => {
        console.error("Error loading products:", error);
        this.isLoading = false; // Also set loading to false in case of an error
      },
    });
  }

  getInitials(): string {
    return (this.firstName[0] + this.lastName[0]).toUpperCase();
  }

  openEditModal(product: any): void {
    this.selectedProduct = product;
    this.isEditModalVisible = true;
  }

  closeEditModal(): void {
    this.selectedProduct = null;
    this.isEditModalVisible = false;
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

  goToHome() {
    this.router.navigate(["/home"]);
  }
  goToOrder() {
    this.router.navigate(["/order/admin"]);
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
        next: (data) => {
          this.modal.success({
            nzTitle: "Thành công",
            nzContent: "Cập nhật sản phẩm thành công!",
          });
          this.closeEditModal();
          this.loadProducts();
        },
        error: (error) => {
          console.error("Error updating product:", error);
          this.modal.error({
            nzTitle: "Lỗi",
            nzContent: "Có lỗi xảy ra khi cập nhật sản phẩm.",
          });
        },
      });
  }

  deleteProduct(): void {
    this.modal.confirm({
      nzTitle: "Xác nhận",
      nzContent: "Bạn có chắc chắn muốn xóa sản phẩm này không?",
      nzOnOk: () => {
        this.productService.deleteProduct(this.selectedProduct.id).subscribe({
          next: (data) => {
            this.modal.success({
              nzTitle: "Thành công",
              nzContent: "Xóa sản phẩm thành công!",
            });
            this.closeEditModal();
            this.loadProducts();
          },
          error: (error) => {
            console.error("Error deleting product:", error);
            this.modal.error({
              nzTitle: "Lỗi",
              nzContent: "Có lỗi xảy ra khi xóa sản phẩm.",
            });
          },
        });
      },
    });
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

  // Product View Modal
  showViewModal(product: any): void {
    this.selectedProduct = product;
    this.isViewModalVisible = true;
  }

  handleCancel(): void {
    this.isViewModalVisible = false;
    this.selectedProduct = null;
  }

  addToCart(product: any): void {
    console.log(`Added product ${product.name} to cart`);
    // Add your add to cart logic here
    this.modal.success({
      nzTitle: "Thành công",
      nzContent: `Đã thêm sản phẩm ${product.name} vào giỏ hàng!`,
    });
  }

  getImageId(imageUrl: string): string {
    try {
      const url = new URL(imageUrl);
      const pathname = url.pathname;
      const parts = pathname.split("/");
      const idIndex = parts.indexOf("d") + 1; // Find index after 'd'
      if (idIndex > 0 && idIndex < parts.length) {
        return parts[idIndex];
      } else {
        console.warn("Could not extract ID from Google Drive URL.");
        return "";
      }
    } catch (error) {
      console.error("Invalid URL:", imageUrl, error);
      return "";
    }
  }

  onImageError(event: any, product: any) {
    const productId = product.id; // Use a unique key for each product

    if (!this.errorHandled[productId]) {
      console.log(
        `Image failed to load for product ${product.name}.  Attempting to load placeholder.`
      );
      this.errorHandled[productId] = true; // Mark this product as handled

      event.target.onerror = null; // Prevent infinite loop
      event.target.src = "assets/placeholder.png"; // Replace with placeholder

      // Log if the placeholder is not loading (for debugging)
      event.target.onload = () => {
        console.log(
          `Placeholder image loaded successfully for product ${product.name}`
        );
      };
      event.target.onerror = () => {
        console.error(
          `Placeholder image failed to load for product ${product.name}!`
        );
      };
    } else {
      console.warn(
        `Error already handled for product ${product.name}.  Ignoring.`
      );
    }
  }
}

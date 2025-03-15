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
              <img [src]="product.imageUrl" alt="{{ product.name }}" />
            </ng-template>

            <nz-card-meta
              [nzTitle]="product.name"
              [nzDescription]="product.description"
            ></nz-card-meta>
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
      </main>

      <footer *ngIf="showOrderButton" class="footer">
        <button nz-button nzType="primary" (click)="placeOrder()">
          Đặt hàng
        </button>
      </footer>

      <!-- Product View Modal -->
      <nz-modal
        [(nzVisible)]="isViewModalVisible"
        [nzTitle]="selectedProduct?.name"
        (nzOnCancel)="handleCancel()"
        (nzOnOk)="handleCancel()"
      >
        <ng-container *nzModalContent>
          <img
            *ngIf="selectedProduct"
            [src]="selectedProduct?.imageUrl"
            alt="{{ selectedProduct?.name }}"
            style="width: 100%; margin-bottom: 10px;"
          />
          <p *ngIf="selectedProduct">
            Giá: {{ selectedProduct?.price | currency : "VND" }}
          </p>
          <p *ngIf="selectedProduct">
            Mô tả: {{ selectedProduct?.description }}
          </p>
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
      >
        <ng-container *nzModalContent>
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
                [(ngModel)]="selectedProduct!.imageUrl"
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
              [src]="selectedProduct.imageUrl"
              alt="{{ selectedProduct.name }}"
              style="width: 100%; margin-bottom: 10px;"
            />
            <p *ngIf="selectedProduct">
              Giá: {{ selectedProduct.price | currency : "VND" }}
            </p>
            <p *ngIf="selectedProduct">
              Mô tả: {{ selectedProduct.description }}
            </p>
          </ng-template>
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
      }

      .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        width: 100%;
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
    this.router.navigate([this.isAdmin ? "/order/admin" : "/order"]);
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
}

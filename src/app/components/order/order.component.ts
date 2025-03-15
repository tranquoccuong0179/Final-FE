import { CommonModule } from "@angular/common";
import { OrderService } from "./../../services/order.service";
import { Component, OnInit } from "@angular/core";
import { CurrencyPipe } from "../../pipe/currency.pipe";
import { Router } from "@angular/router";
import { NzTagModule } from "ng-zorro-antd/tag"; // Import NzTagModule
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-order",
  standalone: true,
  imports: [CommonModule, CurrencyPipe, NzTagModule], // Add NzTagModule to imports
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
            <p class="subtitle">Đây là danh sách đơn hàng của bạn.</p>
          </div>
        </div>

        <div class="header-right">
          <button class="home-btn" (click)="navigateTo('home')">Home</button>
          <button class="home-btn" (click)="navigateTo('product')">
            Products
          </button>
        </div>
      </header>

      <main class="content">
        <div
          *ngIf="orders.length > 0; else noOrders"
          class="order-table-wrapper"
        >
          <table class="order-table custom-table">
            <thead>
              <tr>
                <th>Tổng giá</th>
                <th>Số lượng sản phẩm</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of orders">
                <td>{{ order.totalPrice | currency : "VND" }}</td>
                <td>{{ order.totalProduct }}</td>
                <td class="status" [ngClass]="getStatusClass(order.status)">
                  <nz-tag [nzColor]="getStatusColor(order.status)">
                    {{ order.status }}
                  </nz-tag>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <ng-template #noOrders>
          <p class="no-orders">Không có đơn hàng nào.</p>
        </ng-template>
      </main>
    </div>
  `,
  styles: [
    `
      .container {
        font-family: "Roboto", sans-serif;
        background-color: #f4f7f9;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
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

      .home-btn {
        background-color: rgba(255, 255, 255, 0.3);
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

      .home-btn:hover {
        background-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-2px);
      }

      .title-wrapper {
        text-align: center;
      }

      .content {
        flex-grow: 1;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .order-table-wrapper {
        width: 100%;
        max-width: 1400px;
      }

      .custom-table {
        width: 100%;
        background: white;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        font-size: 1.1rem;
        border-collapse: collapse; /* Required for custom styles to work correctly */
      }

      .custom-table thead th {
        background-color: #546e7a;
        color: white;
        font-weight: 600;
        padding: 16px 20px;
        text-align: left;
        border-bottom: 3px solid #455a64;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .custom-table tbody td {
        padding: 16px 20px;
        text-align: left;
        border-bottom: 1px solid #e0e0e0;
      }

      .custom-table tbody tr:nth-child(even) {
        background-color: #f2f6ff;
      }

      .custom-table tbody tr:hover {
        background-color: #bbdefb;
        transition: background-color 0.3s ease;
      }

      .custom-table th:first-child,
      .custom-table td:first-child {
        padding-left: 25px;
      }

      .custom-table th:last-child,
      .custom-table td:last-child {
        padding-right: 25px;
        text-align: center;
      }

      .custom-table .ant-tag {
        margin: 0;
        font-size: 1rem;
      }

      .no-orders {
        font-size: 18px;
        color: #777;
        margin-top: 20px;
      }
      .status {
        font-weight: bold;
        padding: 8px;
        border-radius: 4px;
        text-align: center; /* Center the tag content */
        display: block; /* Make it a block-level element */
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
    `,
  ],
})
export class OrderComponent implements OnInit {
  orders: any[] = [];
  firstName: string = "";
  lastName: string = "";
  isAdmin: boolean = false;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getProfile().subscribe((profile: any) => {
      if (profile) {
        this.firstName = profile.firstName;
        this.lastName = profile.lastName;
      }
    });

    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => {
        console.error("Lỗi khi lấy danh sách đơn hàng:", err);
      },
    });
  }

  getStatusClass(status: string): string {
    return status.toUpperCase();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case "PENDING":
        return "warning";
      case "COMPLETED":
        return "success";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }

  getInitials(): string {
    if (this.firstName && this.lastName) {
      return (this.firstName[0] + this.lastName[0]).toUpperCase();
    }
    return "";
  }
}

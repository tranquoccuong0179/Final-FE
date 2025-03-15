import { CommonModule } from "@angular/common";
import { OrderService } from "./../../services/order.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { CurrencyPipe } from "../../pipe/currency.pipe";
import { Router } from "@angular/router";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzTagModule } from "ng-zorro-antd/tag";
import { AuthService } from "../../services/auth.service";
import { NzIconModule } from "ng-zorro-antd/icon";
import { Observable, Subscription, forkJoin, of } from "rxjs";
import { switchMap, catchError, tap } from "rxjs/operators";

@Component({
  selector: "app-order",
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzTableModule,
    NzTagModule,
    NzIconModule,
    CurrencyPipe,
  ],
  template: `
    <div class="container">
      <header class="header">
        <div *ngIf="!isLoading" class="header-left">
          <div class="avatar">
            <span>{{ getInitials() }}</span>
          </div>
        </div>

        <div class="header-right">
          <button class="nav-btn" (click)="navigateTo('home')">Home</button>
          <button class="nav-btn" (click)="navigateTo('product')">
            Products
          </button>
        </div>
      </header>

      <main class="content">
        <div *ngIf="isLoading">Loading...</div>
        <div
          *ngIf="!isLoading && orders && orders.length > 0; else noOrders"
          class="order-table-wrapper"
        >
          <nz-table
            #basicTable
            [nzData]="orders"
            [nzShowPagination]="false"
            class="custom-table"
          >
            <thead>
              <tr>
                <th>Tổng giá</th>
                <th>Số lượng sản phẩm</th>
                <th>Trạng thái</th>
                <th *ngIf="isAdmin">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let data of basicTable.data">
                <td>
                  {{ data.totalPrice | currency : "VND" : "symbol" : "1.0-0" }}
                </td>
                <td>{{ data.totalProduct }}</td>
                <td>
                  <nz-tag [nzColor]="getStatusColor(data.status)">
                    {{ data.status }}
                  </nz-tag>
                </td>
                <td *ngIf="isAdmin">
                  <button
                    class="btn-add"
                    nz-button
                    nzType="primary"
                    *ngIf="data.status === 'PENDING'"
                    (click)="receiveOrder(data)"
                  >
                    Chấp nhận
                  </button>
                </td>
              </tr>
            </tbody>
          </nz-table>
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
        margin-bottom: 20px; /* Thêm margin-bottom */
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

      .nav-btn {
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

      .nav-btn:hover {
        background-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-2px);
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
    `,
  ],
})
export class OrderAdminComponent implements OnInit, OnDestroy {
  // Implemented OnDestroy
  orders: any[] = [];
  isAdmin: boolean = false;
  firstName: string = "";
  lastName: string = "";
  isLoading: boolean = true;
  private subscription: Subscription | undefined; // Store the subscription

  constructor(
    private orderService: OrderService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true; // Ensure isLoading is initially true

    this.subscription = this.authService
      .getProfile()
      .pipe(
        tap((profile: any) => {
          console.log("Profile Data:", profile); // Log the profile
          if (profile) {
            this.firstName = profile.firstName;
            this.lastName = profile.lastName;
          } else {
            console.warn("Profile is null.");
          }
        }),
        switchMap((profile: any) => {
          this.isAdmin = this.checkIfAdmin(); // Check admin role within switchMap
          console.log("Is Admin:", this.isAdmin); // Log admin status
          const orderRequest: Observable<any> = this.isAdmin
            ? this.orderService.getOrdersForAdmin()
            : this.orderService.getOrders();
          return orderRequest;
        }),
        tap((orderData) => {
          console.log("Order Data:", orderData); // Log the order data
        }),
        catchError((err) => {
          console.error("Error in chained observables:", err);
          this.isLoading = false;
          return of(null); // Return a default value to prevent the stream from breaking
        })
      )
      .subscribe((orderData) => {
        this.orders = orderData || []; // Ensure orders is an array
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Prevent memory leaks
    }
  }

  getInitials(): string {
    if (this.firstName && this.lastName) {
      return (this.firstName[0] + this.lastName[0]).toUpperCase();
    }
    return ""; // Handle cases where names are not available
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

  receiveOrder(order: any): void {
    this.orderService.receiveOrder(order.id).subscribe({
      next: () => {
        console.log("Nhận đơn hàng thành công!");
        this.reloadOrders();
      },
      error: (err) => console.error("Lỗi khi nhận đơn hàng:", err),
    });
  }

  reloadOrders(): void {
    if (this.isAdmin) {
      this.orderService.getOrdersForAdmin().subscribe({
        next: (data) => {
          this.orders = data;
        },
        error: (err) => console.error("Lỗi khi tải lại đơn hàng:", err),
      });
    } else {
      this.orderService.getOrders().subscribe({
        next: (data) => {
          this.orders = data;
        },
        error: (err) => console.error("Lỗi khi tải lại đơn hàng:", err),
      });
    }
  }

  checkIfAdmin(): boolean {
    // Dummy function, replace with actual logic
    return true;
  }
}
